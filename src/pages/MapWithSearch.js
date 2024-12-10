import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// OpenCage API Key
const OPEN_CAGE_API_KEY = '15cc336989724193a500d914cbb3b6cf'; // Replace with your OpenCage API key

// Set up the marker icon
const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapWithSearch = ({ onSelectAddress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerLocation, setMarkerLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the user's current location when the component mounts
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User's Current Location:", { latitude, longitude });
        setMarkerLocation([latitude, longitude]); // Set marker to user's location initially

        // Reverse geocode the user's current location to get the address
        const address = await fetchAddressFromCoordinates(latitude, longitude);
        setSearchQuery(address); // Set the search query to the user's current address
      },
      (error) => {
        console.error('Error fetching user location:', error);
        alert('Could not retrieve your location. Please enable location services or try again later.');
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Function to reverse geocode coordinates into an address
  const fetchAddressFromCoordinates = async (lat, lng) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${OPEN_CAGE_API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted; // Return the formatted address
      } else {
        console.warn('No results found for the coordinates.');
        return '';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 3) return; // Minimum 3 characters to start search

    setLoading(true);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${OPEN_CAGE_API_KEY}&countrycode=in&limit=5`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.results.length > 0) {
        setAutocomplete(data.results);
      } else {
        console.warn('No results found.');
        setAutocomplete([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch address suggestions. Please try again.');
      setAutocomplete([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (selectedPlace) => {
    const { lat, lng } = selectedPlace.geometry;
    const formattedAddress = selectedPlace.formatted;
    console.log('Selected Location:', { latitude: lat, longitude: lng });

    setMarkerLocation([lat, lng]);
    setSearchQuery(formattedAddress);
    setAutocomplete([]);
    onSelectAddress(formattedAddress); // Call the parent function to pass the selected address
  };

  return (
    <div style={{ height: '100vh' }}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search address..."
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{ width: '100%', padding: '10px' }}
      />
      {loading && <p>Loading suggestions...</p>}
      {autocomplete.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {autocomplete.map((place, index) => (
            <li key={index} onClick={() => handleSelectAddress(place)}>
              {place.formatted}
            </li>
          ))}
        </ul>
      )}
      <MapContainer
        center={markerLocation || [20.5937, 78.9629]} // Default center is user's location or India
        zoom={markerLocation ? 14 : 5}
        style={{ height: '90vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markerLocation && (
          <Marker position={markerLocation} icon={customIcon}>
            <Popup>{searchQuery ? `Selected Location: ${searchQuery}` : 'Your Current Location'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithSearch;
