// components/Step2Form.jsx
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Step2Form = ({ formData, handleChange, prevStep, isLoading }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize map when component mounts
    if (mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }

    // Clean up map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    // Check if Leaflet is loaded and the map container exists
    if (!L || !mapRef.current) return;

    // Initial coordinates - default to Islamabad, Pakistan
    const defaultLat = formData.location.coordinates[1]; // latitude
    const defaultLng = formData.location.coordinates[0]; // longitude

    // Initialize the map
    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
    
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the default position
    const marker = L.marker([defaultLat, defaultLng], {
      draggable: true // Allow the marker to be dragged
    }).addTo(map);
    
    // Store the map and marker instances in refs
    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Update coordinates when marker is dragged
    marker.on('dragend', function(event) {
      const position = marker.getLatLng();
      updateLocationCoordinates(position.lng, position.lat);
    });

    // Update coordinates when map is clicked
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocationCoordinates(lng, lat);
    });

    // Improve map rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  };

  const updateLocationCoordinates = (longitude, latitude) => {
    // Update form data with the new coordinates (rounded to 6 decimal places)
    handleChange({
      target: {
        name: "location.coordinates",
        value: [
          parseFloat(longitude.toFixed(6)), 
          parseFloat(latitude.toFixed(6))
        ]
      }
    });

    // Fetch the address for these coordinates
    fetchAddressFromCoordinates(longitude, latitude);
  };
  
  const fetchAddressFromCoordinates = async (longitude, latitude) => {
    try {
      // Use Nominatim for reverse geocoding (OpenStreetMap's service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en-US,en' } }
      );
      
      if (!response.ok) throw new Error('Failed to fetch address');
      
      const data = await response.json();
      
      // Format the address from the response
      const address = data.display_name || `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      
      // Update form data with the new address
      handleChange({
        target: {
          name: "location.address",
          value: address
        }
      });
    } catch (error) {
      console.error("Error fetching address:", error);
      // Set a fallback address using the coordinates
      handleChange({
        target: {
          name: "location.address",
          value: `Location at coordinates ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-5">
        Location Details
      </h2>
      <p className="text-gray-600 mb-6">
        Click on the map to set your location or drag the marker.
      </p>
      
      <div className="space-y-4">
        {/* Map Component */}
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div
            ref={mapRef}
            className="w-full h-64 bg-gray-100"
          >
            {/* The Leaflet map will be rendered here */}
          </div>
          
          {/* Display selected coordinates */}
          <div className="bg-gray-100 p-2 text-xs text-center font-mono">
            Selected: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
          </div>
        </div>
        
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Full address of your fuel pump"
            className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md h-24"
            required
          />
        </div>
        
        <div className="flex space-x-3 pt-2">
          <Button
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-1/2 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
          >
            {isLoading ? "Registering..." : "Complete Registration"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Step2Form;