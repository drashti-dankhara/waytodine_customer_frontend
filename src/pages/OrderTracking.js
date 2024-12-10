import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  CUSTOMER_BACKEND_URL,
  REACT_APP_GOOGLE_MAPS_API_KEY,
} from "../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import Navbar from "../components/Navbar";

function OrderTracking() {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState(null);
  const [directionsRequested, setDirectionsRequested] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverLocationLogs, setDriverLocationLogs] = useState([]); // Log of locations
  const [driverMarker, setDriverMarker] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to track your order.");
    }
  }, [token]);

  // WebSocket to receive driver location updates
  useEffect(() => {
    const socket = new WebSocket("wss://waytodine-spring-backend-5.onrender.com/ws/track");

    socket.onopen = () => {
      console.log("WebSocket connection established in OrderTracking.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received in OrderTracking:", data);

        if (data.orderId === parseInt(orderId) && data.location) {
          const [lat, lng] = data.location.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            const newLocation = { lat, lng };
            setDriverLocation(newLocation);

            // Update location logs
            setDriverLocationLogs((prevLogs) => [
              ...prevLogs,
              { time: new Date().toLocaleTimeString(), ...newLocation },
            ]);
          } else {
            console.error("Invalid location data received:", data.location);
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed in OrderTracking.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error in OrderTracking:", error);
    };

    return () => {
      socket.close(); // Cleanup WebSocket connection
    };
  }, [orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${CUSTOMER_BACKEND_URL}/order/get-order-by-id/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;

      const pickupCoords = data.pickupLocation
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      const dropoffCoords = data.dropoffLocation
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      const pickup = { lat: pickupCoords[0], lng: pickupCoords[1] };
      const dropoff = { lat: dropoffCoords[0], lng: dropoffCoords[1] };

      setPickupLocation(pickup);
      setDropoffLocation(dropoff);
      setDriverLocation(pickup); // Initialize driver location at pickup point
      setOrderStatus(data.orderStatus);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderStatus === 3 && pickupLocation && dropoffLocation) {
      setDirectionsRequested(true);
    }
  }, [orderStatus, pickupLocation, dropoffLocation]);

  const handleMapLoad = (map) => {
    if (driverLocation) {
      const marker = new window.google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
      setDriverMarker(marker);
    }
  };

  const handleDirectionsCallback = (response) => {
    if (response && response.status === "OK") {
      setDirections(response);
    } else {
      toast.error("Failed to load directions.");
    }
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      {orderStatus && (
        <div>
          <h2>Order Stages</h2>
          <ul>
            <li>Order Placed: {orderStatus === 1 ? "✔️" : ""}</li>
            <li>Order Preparing: {orderStatus === 2 ? "✔️" : ""}</li>
            <li>Out for Delivery: {orderStatus === 3 ? "✔️" : ""}</li>
            <li>Delivered: {orderStatus === 4 ? "✔️" : ""}</li>
          </ul>
          {orderStatus === 3 && (
            <Button onClick={handleModalShow} variant="primary">
              Track Delivery Boy
            </Button>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Track Delivery Boy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoaded ? (
            <>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={pickupLocation || { lat: 21.227341, lng: 72.894547 }}
                zoom={14}
                onLoad={handleMapLoad}
              >
                {pickupLocation && (
                  <Marker
                    position={pickupLocation}
                    label="Pickup"
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                  />
                )}
                {dropoffLocation && (
                  <Marker
                    position={dropoffLocation}
                    label="Dropoff"
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                  />
                )}
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    label="Driver"
                    icon={{
                      url: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                )}
                {directionsRequested && pickupLocation && dropoffLocation && (
                  <DirectionsService
                    options={{
                      origin: pickupLocation,
                      destination: dropoffLocation,
                      travelMode: "DRIVING",
                    }}
                    callback={handleDirectionsCallback}
                  />
                )}
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: "blue",
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                      },
                    }}
                  />
                )}
              </GoogleMap>

              <h3>Driver Location Logs:</h3>
              <ul>
                {driverLocationLogs.map((log, index) => (
                  <li key={index}>
                    {log.time}: {log.lat}, {log.lng}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Loading map...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderTracking;
