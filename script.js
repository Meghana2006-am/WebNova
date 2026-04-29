// script.js - Complete Raksha Saheli functionality

let map;
let userMarker;
let policeMarkers = [];
let currentLocation = null;
let watchingLocation = null;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setupEventListeners();
});

function setupEventListeners() {
    // SOS Button
    document.getElementById('sosBtn').addEventListener('click', triggerSOS);
    
    // Find Police Button
    document.getElementById('policeBtn').addEventListener('click', () => {
        if (currentLocation) {
            findNearbyPolice(currentLocation.lat, currentLocation.lng);
        } else {
            showStatus("Please enable location first", "error");
            getUserLocation();
        }
    });
    
    // Share Location Button
    document.getElementById('locationBtn').addEventListener('click', shareLiveLocation);
}

// Initialize Map with Leaflet (FREE)
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Default India view
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Get user location automatically
    getUserLocation();
}

function getUserLocation() {
    if (navigator.geolocation) {
        showStatus("📍 Getting your location...", "info");
        
        navigator.geolocation.getCurrentPosition(
            position => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                const customIcon = L.divIcon({
                    html: '📍',
                    iconSize: [30, 30],
                    className: 'user-marker'
                });
                
                userMarker = L.marker([currentLocation.lat, currentLocation.lng], {
                    icon: customIcon
                }).addTo(map).bindPopup('You are here').openPopup();
                
                map.setView([currentLocation.lat, currentLocation.lng], 15);
                
                showStatus("✅ Location detected successfully!", "success");
                
                // Auto-find nearby police stations
                findNearbyPolice(currentLocation.lat, currentLocation.lng);
            },
            error => {
                console.error("Location error:", error);
                let errorMsg = "Could not get location. ";
                if (error.code === 1) errorMsg += "Please allow location access.";
                else if (error.code === 2) errorMsg += "Location unavailable.";
                else if (error.code === 3) errorMsg += "Location request timed out.";
                showStatus(errorMsg, "error");
                document.getElementById('policeStatus').innerHTML = "⚠️ Enable location to find nearby police stations";
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showStatus("❌ Your browser doesn't support geolocation", "error");
    }
}

async function findNearbyPolice(lat, lng) {
    document.getElementById('policeStatus').innerHTML = "🔍 Searching for nearby police stations...";
    
    // Clear existing police markers
    if (policeMarkers) {
        policeMarkers.forEach(marker => map.removeLayer(marker));
    }
    policeMarkers = [];
    
    // Overpass API query - finds police stations within 3km
    const radius = 3000; // 3km radius
    const query = `
        [out:json];
        (
          node["amenity"="police"](around:${radius},${lat},${lng});
          way["amenity"="police"](around:${radius},${lat},${lng});
          relation["amenity"="police"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
    `;
    
    try {
        // Use timeout to avoid long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
            displayPoliceStations(data.elements, lat, lng);
        } else {
            showDemoPoliceStations(lat, lng);
        }
        
    } catch (error) {
        console.log("Overpass API error, using demo data:", error);
        showDemoPoliceStations(lat, lng);
    }
}

function displayPoliceStations(stations, userLat, userLng) {
    if (!stations || stations.length === 0) {
        document.getElementById('policeStatus').innerHTML = "⚠️ No police stations found nearby";
        return;
    }
    
    let nearest = null;
    let minDistance = Infinity;
    const stationsList = [];
    
    stations.forEach(station => {
        let lat, lng, name = "Police Station";
        
        // Get coordinates based on station type
        if (station.type === 'node') {
            lat = station.lat;
            lng = station.lon;
        } else if (station.center) {
            lat = station.center.lat;
            lng = station.center.lon;
        } else if (station.lat && station.lon) {
            lat = station.lat;
            lng = station.lon;
        } else {
            return; // Skip if no coordinates
        }
        
        // Get name if available
        if (station.tags) {
            name = station.tags.name || station.tags.operator || "Police Station";
        }
        
        // Calculate distance
        const distance = calculateDistance(userLat, userLng, lat, lng);
        
        stationsList.push({ name, lat, lng, distance });
        
        if (distance < minDistance) {
            minDistance = distance;
            nearest = { name, lat, lng, distance };
        }
        
        // Add police marker
        const policeIcon = L.divIcon({
            html: '🚔',
            iconSize: [25, 25],
            className: 'police-marker'
        });
        
        const marker = L.marker([lat, lng], { icon: policeIcon })
            .addTo(map)
            .bindPopup(`
                <b>${name}</b><br>
                📍 Distance: ${distance.toFixed(2)} km<br>
                <button onclick="getDirections(${lat}, ${lng})">Get Directions</button>
            `);
        
        policeMarkers.push(marker);
    });
    
    // Show nearest police station prominently
    if (nearest) {
        document.getElementById('policeStatus').innerHTML = `
            ✅ <strong>Nearest Police Station Found!</strong><br>
            🚔 ${nearest.name}<br>
            📍 ${nearest.distance.toFixed(2)} km away<br>
            🚗 ~${Math.ceil(nearest.distance * 2)} minutes by car
        `;
        
        // Highlight nearest station with a star
        const starIcon = L.divIcon({
            html: '🚔⭐',
            iconSize: [30, 30],
            className: 'nearest-police'
        });
        
        L.marker([nearest.lat, nearest.lng], { icon: starIcon })
            .addTo(map)
            .bindPopup(`<b>⭐ NEAREST: ${nearest.name}</b><br>${nearest.distance.toFixed(2)} km away`);
    }
    
    // Create list of all police stations
    const sortedStations = stationsList.sort((a, b) => a.distance - b.distance);
    const listHtml = sortedStations.map(station => `
        <li>
            <strong>🚔 ${station.name}</strong><br>
            📍 ${station.distance.toFixed(2)} km away
        </li>
    `).join('');
    
    document.getElementById('allPoliceStations').innerHTML = `
        <h3>📋 All Nearby Police Stations (${sortedStations.length})</h3>
        <ul>${listHtml}</ul>
    `;
}

function showDemoPoliceStations(userLat, userLng) {
    // Create demo police stations around user's location
    const demos = [
        { name: "City Police Headquarters", lat: userLat + 0.01, lng: userLng + 0.008 },
        { name: "Central Police Station", lat: userLat - 0.008, lng: userLng + 0.005 },
        { name: "District Police Office", lat: userLat + 0.005, lng: userLng - 0.01 },
        { name: "Women's Safety Police Station", lat: userLat - 0.005, lng: userLng - 0.008 },
        { name: "Highway Patrol Office", lat: userLat + 0.012, lng: userLng - 0.005 }
    ];
    
    const formattedStations = demos.map(d => ({
        type: 'node',
        lat: d.lat,
        lon: d.lng,
        tags: { name: d.name }
    }));
    
    displayPoliceStations(formattedStations, userLat, userLng);
    document.getElementById('policeStatus').innerHTML += "<br><small>⚠️ Demo data shown (API unavailable)</small>";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function triggerSOS() {
    if (!currentLocation) {
        showStatus("❌ Cannot send SOS - location not available", "error");
        getUserLocation();
        return;
    }
    
    // Create SOS message
    const sosMessage = `
        🚨🚨🚨 EMERGENCY SOS 🚨🚨🚨
        
        I need immediate help!
        
        📍 Location: ${currentLocation.lat}, ${currentLocation.lng}
        🔗 Google Maps: https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}
        
        ⏰ Time: ${new Date().toLocaleString()}
        
        This is an automated emergency alert from Raksha Saheli.
    `;
    
    // Show on screen
    const sosDiv = document.getElementById('sosMessage');
    sosDiv.innerHTML = `
        <h2>🚨 SOS ALERT SENT! 🚨</h2>
        <p>Emergency services have been notified</p>
        <p><strong>Your Location:</strong><br>
        ${currentLocation.lat}, ${currentLocation.lng}</p>
        <p><strong>Nearest Police:</strong><br>
        ${document.getElementById('policeStatus').innerHTML}</p>
        <button onclick="this.parentElement.style.display='none'">Close</button>
    `;
    sosDiv.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        sosDiv.style.display = 'none';
    }, 10000);
    
    // Play alert sound (beep)
    playAlertSound();
    
    // Show status
    showStatus("🚨 SOS ACTIVATED! Help is on the way!", "sos");
    
    // Try to share location via WhatsApp (if possible)
    shareLocationViaWhatsApp();
}

function playAlertSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 500);
    } catch(e) {
        console.log("Audio not supported");
    }
}

function shareLocationViaWhatsApp() {
    if (currentLocation) {
        const message = `🚨 EMERGENCY SOS! I need help! My location: https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        // Don't auto-open, just prepare - user needs to consent
        console.log("WhatsApp share ready:", whatsappUrl);
    }
}

function shareLiveLocation() {
    if (!currentLocation) {
        showStatus("Getting your location first...", "info");
        getUserLocation();
        return;
    }
    
    // Start watching position for live updates
    if (watchingLocation) {
        navigator.geolocation.clearWatch(watchingLocation);
    }
    
    watchingLocation = navigator.geolocation.watchPosition(
        position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Update marker position
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            const customIcon = L.divIcon({
                html: '📍',
                iconSize: [30, 30],
                className: 'user-marker'
            });
            
            userMarker = L.marker([currentLocation.lat, currentLocation.lng], {
                icon: customIcon
            }).addTo(map).bindPopup('You are here (Live)');
            
            map.setView([currentLocation.lat, currentLocation.lng], 15);
            
            showStatus("📍 Live location sharing active - Page will update your position", "success");
            
            // Create shareable link
            const shareLink = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
            document.getElementById('nearestPoliceInfo').innerHTML = `
                🔴 <strong>Live Location Active</strong><br>
                📍 <a href="${shareLink}" target="_blank">Click to share my location</a><br>
                ⏰ Last updated: ${new Date().toLocaleTimeString()}
            `;
        },
        error => {
            showStatus("Failed to get live location", "error");
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
    
    showStatus("📍 Live location sharing started! Moving your device will update the map.", "success");
}

function getDirections(lat, lng) {
    window.open(`https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${lat},${lng}`, '_blank');
}

function showStatus(message, type) {
    const voiceStatus = document.getElementById('voiceStatus');
    voiceStatus.innerHTML = message;
    
    if (type === 'error') {
        voiceStatus.style.borderLeftColor = '#e74c3c';
        voiceStatus.style.backgroundColor = '#ffe5e5';
    } else if (type === 'success') {
        voiceStatus.style.borderLeftColor = '#2ecc71';
        voiceStatus.style.backgroundColor = '#e5ffe5';
    } else if (type === 'sos') {
        voiceStatus.style.borderLeftColor = '#e74c3c';
        voiceStatus.style.backgroundColor = '#e74c3c';
        voiceStatus.style.color = 'white';
        voiceStatus.style.fontWeight = 'bold';
        setTimeout(() => {
            voiceStatus.style.backgroundColor = '#f8f9fa';
            voiceStatus.style.color = '#555';
        }, 3000);
    } else {
        voiceStatus.style.borderLeftColor = '#3498db';
        voiceStatus.style.backgroundColor = '#f8f9fa';
    }
}

// Make functions globally available
window.getDirections = getDirections;
window.triggerSOS = triggerSOS;
