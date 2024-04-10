//DropSearchBox.js

import React, { useState, useEffect } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const Butwal_Lat = 27.69625199;
const Butwal_Long = 83.46399466;
const MAX_DISTANCE = 70; // in kilometers

export default function DropSearchBox(props) {
  const { selectPosition, setSelectPosition, DropSearchText } = props;
  const [searchText, setSearchText] = useState(DropSearchText ?? "");
  const [listPlace, setListPlace] = useState([]);


  useEffect(() => {
    setSearchText(DropSearchText || ''); // Update searchText when DropSearchText changes
  }, [DropSearchText]);

  // useEffect(() => {
  //   console.log("searchText :", searchText); // Log searchText for debugging
  // }, [searchText]);



  useEffect(() => {
    // Calculate the bounding box based on Butwal's coordinates and maximum distance
    const minLat = Butwal_Lat - (MAX_DISTANCE / 110.574); // 1 degree of latitude is approximately 110.574 kilometers
    const maxLat = Butwal_Lat + (MAX_DISTANCE / 110.574);
    const minLon = Butwal_Long - (MAX_DISTANCE / (111.32 * Math.cos(Butwal_Lat * (Math.PI / 180)))); // 1 degree of longitude varies based on latitude
    const maxLon = Butwal_Long + (MAX_DISTANCE / (111.32 * Math.cos(Butwal_Lat * (Math.PI / 180))));

    // Update the bounding box parameters in the search URL
    const params = {
      q: "",
      format: "json",
      addressdetails: "addressdetails",
      bbox: `${minLon},${minLat},${maxLon},${maxLat}`, // Include bounding box coordinates
    };
    setParams(params);
  }, []);

  const [params, setParams] = useState({
    q: "",
    format: "json",
    addressdetails: "addressdetails",
  });

  const handleClearSearch = () => {
    setSearchText("");
    setListPlace([]);
  };


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <OutlinedInput
            style={{ marginLeft:10, width: '100%', height: 50 }}
            placeholder="Search Drop Location Here..."
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            endAdornment={
              searchText && (
              <IconButton
              aria-label="clear search"
              onClick={handleClearSearch}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
            >
              <DeleteIcon />
            </IconButton>
            )
            }
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Search functionality
              const queryParams = {
                ...params,
                q: searchText,
              };
              const queryString = new URLSearchParams(queryParams).toString();
              const requestOptions = {
                method: "GET",
                redirect: "follow",
              };
              fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  const places = JSON.parse(result);
                  // Filter places within 70 km radius from Butwal
                  const filteredPlaces = places.filter(place => {
                    const distance = calculateDistance(place);
                    return distance <= MAX_DISTANCE;
                  });
                  setListPlace(filteredPlaces);
                })
                .catch((err) => console.log("err: ", err));
            }}
          >
            Search
          </Button>
        </div>
      </div>
      <div>
         <List> {/*component="nav" aria-label="main mailbox folders" */}
          {listPlace.map((item) => (
            <div key={item?.place_id}>
              <ListItem
                button
                onClick={() => {
                  setSelectPosition(item); // sets the position value to the clicked location from the lists
                  setSearchText(item.display_name); // Update search text with selected place
                  setListPlace([]); // Clear the list of places after a placed is selected
                }}
              >
                <ListItemIcon>
                  <img
                    src="./map.png"
                    alt="Placeholder"
                    style={{ width: 38, height: 38 }}
                  />
                </ListItemIcon>
                <ListItemText primary={item?.display_name} />
              </ListItem>
            </div>
          ))}
        </List>
      </div>
    </div>
  );

  function calculateDistance(place) {
    // Calculate distance between place and Butwal using Haversine formula
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = Butwal_Lat * (Math.PI / 180);
    const lon1 = Butwal_Long * (Math.PI / 180);
    const lat2 = parseFloat(place.lat) * (Math.PI / 180);
    const lon2 = parseFloat(place.lon) * (Math.PI / 180);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }
}
