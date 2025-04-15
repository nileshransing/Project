import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Typography } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";

import mapStyles from "../../mapStyles";
import useStyles from "./styles.js";

const Map = ({ coords, setCoords, setBounds }) => {
  const classes = useStyles();
  const [nearestAirport, setNearestAirport] = useState(null);

  // Fetch nearest airport when coords change
  useEffect(() => {
    if (coords.lat && coords.lng) {
      fetchNearestAirport(coords.lat, coords.lng);
    }
  }, [coords]);

  // Function to fetch the nearest airport
  const fetchNearestAirport = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 50000, // Search within 50km
      type: "airport",
    };

    service.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        const closestAirport = results[0]; // Pick the first (nearest) airport
        setNearestAirport(closestAirport);
      } else {
        console.error("No airports found or error:", status);
      }
    });
  };

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: ["places"],
        }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={10}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
      >
        {/* Display only the nearest airport */}
        {nearestAirport && (
          <div
            lat={nearestAirport.geometry.location.lat()}
            lng={nearestAirport.geometry.location.lng()}
            className={classes.markerContainer}
          >
            <LocationOnOutlinedIcon color="secondary" fontSize="large" />
            <Typography variant="caption">{nearestAirport.name}</Typography>
          </div>
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;