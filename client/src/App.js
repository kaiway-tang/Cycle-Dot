import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css'; 
//../node_modules/mapbox-gl/dist/mapbox-gl.css
import axios from 'axios';
// import { LineLayer } from '@deck.gl/layers';
import './App.css';

function App() {

  const [viewport, setViewport] = useState({
    latitude: 37.7577,  // Initial center (replace with your rough location)
    longitude: -122.4376,
    zoom: 8
  });

  const [locations, setLocations] = useState([]);

  const [lineData, setLineData] = useState(null); // Initialize lineData

  const [username, setUsername] = useState("");
  const handleChangeUsername = (event) => {setUsername(event.target.value);} 

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setViewport({ 
            ...viewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude 
          });
          // Send location to the server
          axios.post('https://cycle-dot-server.vercel.app/api/savelocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date() 
          })
            .catch(error => console.error('Error saving data:', error));
        });
      }
    }, 10000); // Every 10 seconds 

      // Get initial location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      setViewport({ 
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 14 // Adjust zoom level as needed
      });
      });
    } 

    const fetchLocations = async () => {
      const response = await axios.get('https://cycle-dot-server.vercel.app/api/locations'); 
      setLocations(response.data);
   
      // Create new lineData with updated locations
     const newLineData = {
         'type': 'Feature',
         'properties': {},
         'geometry': {
           'type': 'LineString',
           'coordinates': response.data.map(loc => [loc.longitude, loc.latitude]) 
         }
      };
      setLineData(newLineData); 
   };
  
    fetchLocations();

    const lineData = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': locations.map(loc => [loc.longitude, loc.latitude]) 
      }
    };

   return () => clearInterval(interval);
 }, []);

 console.log(process.env.REACT_APP_MAPBOX_TOKEN)
 return (
  <div> 
    <Map
      initialViewState={{
        longitude: -118.448565,
        latitude: 34.063673,
        zoom: 14
      }}
      style={{width: "100vw", height: "50vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // Get your token from Mapbox
    >
       {locations.map(location => (
         <Marker 
            key={location.timestamp}
            latitude={location.latitude} 
            longitude={location.longitude}
         >
           {/* Customize your marker here if needed */}
           <div style={{ width: '10px', height: '10px', background: 'red', borderRadius: '50%' }}></div>
         </Marker>
       ))}

    {/* {locations.length > 0 && ( // Check for locations 
      <LineLayer
          id="location-trail"
          data={lineData}
          lineWidth={3} 
          getLineColor={[255, 0, 0]} // Red color
      />
    )}  */}

    </Map>
    <input placeholder= "First and Last Name (required)" value={username} onChange={handleChangeUsername}
      style = {{"width": "10%"}}
    ></input>
    <br></br>
    <button onClick={() => {
      axios.post("https://cycle-dot-server.vercel.app/create-account", {
        username: username,
        password: "also dying"
      })
      .then(response  => {
        console.log(response.data)
      }).catch(error => {console.log(error)})
    }}>
      Poke poke eyeball crit
    </button>

  </div>
);
}

export default App;