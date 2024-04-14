// Maps.js
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PickupSearchBox from "./PickupSearchBox";
import DropSearchBox from "./DropSearchBox";
import PickupAndDropService from "./PickupAndDropService";


const icon = L.icon({
  iconUrl: "./pin marker.png",
  iconSize: [50, 45],
});

const position = [27.69625199, 83.46399466];

const nepalBounds = [
  [26.347, 80.058], 
  [30.447, 88.201]  
];

function ResetCenterView(props) {
  const { pickupPosition, dropPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (pickupPosition && dropPosition) { 
      const pickupLatLng = L.latLng(pickupPosition.lat, pickupPosition.lon);
      const dropLatLng = L.latLng(dropPosition.lat, dropPosition.lon);
      const bounds = L.latLngBounds(pickupLatLng, dropLatLng);

      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (pickupPosition) {
      map.setView([pickupPosition.lat, pickupPosition.lon], map.getZoom(), {
        animate: true,
      });
    } else if (dropPosition) {
      map.setView([dropPosition.lat, dropPosition.lon], map.getZoom(), {
        animate: true,
      });
    }
  }, [pickupPosition, dropPosition, map]);

  return null;
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};


export default function Maps(props) {
  const { pickupPosition, dropPosition, setPickupPosition, setDropPosition } = props;
  const [pickupSearchText, setPickupSearchText] = useState(pickupPosition?.display_name || ""); 
  const [dropSearchText, setDropSearchText] = useState(dropPosition?.display_name || ""); 
  const [distance, setDistance] = useState(null);
  const distanceLogged = useRef(false); // Ref to track if distance has been logged


  useEffect(() => {
    if (pickupPosition && dropPosition) {
      const newDistance = calculateDistance(pickupPosition.lat, pickupPosition.lon, dropPosition.lat, dropPosition.lon);
      setDistance(newDistance);
      distanceLogged.current = false; // Reset distanceLogged when distance updates
    }
  }, [pickupPosition, dropPosition]);

  // Log distance only if it's updated and not already logged
  useEffect(() => {
    if (distance !== null && !distanceLogged.current) {
      console.log("distance between points:", distance);
      distanceLogged.current = true; // Set distanceLogged to true after logging
    }
  }, [distance]);

  const handleDragEndPickup = async (event) => {
    const newPosition = event.target.getLatLng();
    console.log("New pickup position:", newPosition);
  
    try {
      // Reverse geocode to get the display name
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${newPosition.lat}&lon=${newPosition.lng}&format=json`);
      const data = await response.json();
      console.log("Response from reverse geocoding API:", data);
  
      const displayName = data.display_name;
      console.log("New pickup display name:", displayName);
  
      // Update pickup position and display name
      setPickupPosition({
        lat: newPosition.lat,
        lon: newPosition.lng,
        display_name: displayName
      });
  
      // Recalculate distance
      recalculateDistance({
        lat: newPosition.lat,
        lon: newPosition.lng
      }, dropPosition);
  
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }
  };
  
  const handleDragEndDrop = async (event) => {
    const newPosition = event.target.getLatLng();
    console.log("New drop position:", newPosition);
  
    try {
      // Reverse geocode to get the display name
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${newPosition.lat}&lon=${newPosition.lng}&format=json`);
      const data = await response.json();
      console.log("Response from reverse geocoding API:", data);
  
      const displayName = data.display_name;
      console.log("New drop display name:", displayName);
  
      // Update drop position and display name
      setDropPosition({
        lat: newPosition.lat,
        lon: newPosition.lng,
        display_name: displayName
      });
  
      // Recalculate distance
      recalculateDistance(pickupPosition, {
        lat: newPosition.lat,
        lon: newPosition.lng
      });
  
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }
  };

  const recalculateDistance = (pickupPosition, dropPosition) => {
    const newDistance = calculateDistance(pickupPosition.lat, pickupPosition.lon, dropPosition.lat, dropPosition.lon);
    setDistance(newDistance);
  };

  
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: 550, zIndex: 1 }}
      scrollWheelZoom = {true}
      maxBounds={nepalBounds}
      maxBoundsViscosity={1.0} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=vugHFWQ2WDlqwfxDqZgO"
      />
      {pickupPosition && (
        <Marker 
        position={[pickupPosition.lat, pickupPosition.lon]} 
        icon={icon} 
        draggable= {true}
        eventHandlers={{
          dragend: handleDragEndPickup,
          mouseover: (event) => event.target.openPopup(),
          mouseout: (event) => event.target.closePopup()
        }} 
        >
          <Popup> <b>Pickup Location:</b> <br/> {pickupPosition.display_name}</Popup>
        </Marker>
      )}
      {dropPosition && (
        <Marker 
        position={[dropPosition.lat, dropPosition.lon]} 
        icon={icon} draggable= {true}  
        eventHandlers={{
          dragend: handleDragEndDrop,
          mouseover: (event) => event.target.openPopup(),
          mouseout: (event) => event.target.closePopup()
        }}>
         <Popup> <b>Drop Location:</b> <br/> {dropPosition.display_name}</Popup>
        </Marker>
      )}
      <ResetCenterView pickupPosition={pickupPosition} dropPosition={dropPosition} />
      {/* <RoutingPickupDrop pickupPosition={pickupPosition} dropPosition={dropPosition}/> */}

       {/* Draw polyline if both pickup and drop positions are available */}
       {pickupPosition && dropPosition && (
        <Polyline positions={[
          [pickupPosition.lat, pickupPosition.lon],
          [dropPosition.lat, dropPosition.lon]
        ]} color="red" />
      )}

      <PickupSearchBox 
        selectPosition={pickupPosition} 
        setSelectPosition={setPickupPosition} 
        pickupSearchText={pickupSearchText} 
        setPickupSearchText={setPickupSearchText} 
        
      />
      <DropSearchBox 
        selectPosition={dropPosition} 
        setSelectPosition={setDropPosition} 
        dropSearchText={dropSearchText} 
        setDropSearchText={setDropSearchText} 
      />
      {distance !== null && <PickupAndDropService distance={distance} />}
    </MapContainer> 
  );
}



// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";


// function RoutingPickupDrop ( pickupPosition, dropPosition) {

//   const map = useMap();

//   useEffect(() => {
//     if (pickupPosition && dropPosition && map) {
//       const routingControl = L.Routing.control({
//         waypoints: [
//           L.latLng(pickupPosition.lat, pickupPosition.lon),
//           L.latLng(dropPosition.lat, dropPosition.lon)
//         ], 
//         routeWhileDragging: true
//       }).addTo(map);
  
//       return () => map.removeControl(routingControl);
//     }
    
//   }, [map, pickupPosition, dropPosition])

//   return null;
// }
