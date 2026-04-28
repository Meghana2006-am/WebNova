<!DOCTYPE html>
<html lang="en">
<head>
  <title>Raksha Saheli • Safety Companion</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --child-blue: #00b4ff;
      --women-pink: #ff4d94;
      --accident-red: #ff3366;
      --universal-blue: #00aaff;
      --share-green: #00c853;
      --sos-red: #ff0022;
      --dark: #0a0a0a;
      --card: #111111;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0a0a0a, #1a0033);
      color: white;
      min-height: 100vh;
      padding: 20px;
    }

    h1 {
      font-size: 2.3rem;
      font-weight: 700;
      background: linear-gradient(90deg, #ff3366, #00f5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #bbb;
      margin-bottom: 30px;
      font-size: 1.1rem;
    }

    /* Role Selection Screen */
    #roleScreen {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(10, 10, 10, 0.98);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
    }

    .role-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .role-header h1 {
      font-size: 2.6rem;
      margin-bottom: 10px;
    }

    .safety-quote {
      font-size: 1.15rem;
      color: #ddd;
      font-style: italic;
      max-width: 320px;
      text-align: center;
      margin-top: 10px;
      opacity: 0.9;
    }

    .role-container {
      width: 100%;
      max-width: 380px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .roleBtn {
      padding: 18px 20px;
      border: none;
      border-radius: 16px;
      font-size: 1.15rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .roleBtn:hover { transform: translateY(-5px); }

    .roleBtn.child   { background: linear-gradient(135deg, #00b4ff, #0077cc); color: white; }
    .roleBtn.women   { background: linear-gradient(135deg, #ff4d94, #cc0066); color: white; }
    .roleBtn.accident{ background: linear-gradient(135deg, #ff3366, #cc0022); color: white; }

    /* Main App */
    #app {
      display: none;
      max-width: 420px;
      margin: 0 auto;
    }

    .card {
      background: var(--card);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      border: 1px solid rgba(255, 51, 102, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .section-title {
      font-size: 1.4rem;
      margin-bottom: 18px;
      font-weight: 600;
    }

    button {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 14px;
      font-size: 1.08rem;
      font-weight: 600;
      cursor: pointer;
      margin: 8px 0;
      transition: all 0.3s ease;
    }

    /* Mode-specific Helpline Buttons */
    .btn-child   { background: linear-gradient(135deg, #00b4ff, #0088dd); color: white; }
    .btn-women   { background: linear-gradient(135deg, #ff4d94, #e6007a); color: white; }
    .btn-accident{ background: linear-gradient(135deg, #ff3366, #cc0022); color: white; }

    /* Big SOS Button */
    .btn-sos {
      background: linear-gradient(135deg, var(--sos-red), #aa0011);
      color: white;
      font-size: 1.35rem;
      padding: 22px;
      margin-top: 15px;
      box-shadow: 0 0 30px rgba(255, 0, 34, 0.7);
    }

    .btn-sos:active {
      transform: scale(0.95);
      box-shadow: 0 0 45px rgba(255, 0, 34, 0.9);
    }

    .btn-share {
      background: linear-gradient(135deg, var(--share-green), #00aa44);
      color: white;
    }

    .btn-universal {
      background: linear-gradient(135deg, var(--universal-blue), #0077cc);
      color: white;
    }

    /* SOS Screen */
    #sosScreen {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(45deg, #ff0033, #990022);
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: white;
      z-index: 9999;
      animation: pulse 1.1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.88; }
    }

    .sos-text {
      font-size: 2.1rem;
      font-weight: 700;
      text-align: center;
      text-shadow: 0 0 20px rgba(255,255,255,0.5);
    }
  </style>
</head>
<body>

  <!-- ROLE SELECTION SCREEN -->
  <div id="roleScreen">
    <div class="role-header">
      <h1>Raksha Saheli</h1>
      <p class="safety-quote">
        "Your safety is our priority"<br>
        <span style="font-size: 1rem; opacity: 0.8;">— Always Protected, Always Connected</span>
      </p>
    </div>

    <div class="role-container">
      <h2 style="margin-bottom: 25px; text-align:center; font-size: 1.6rem; color: #fff;">
        Choose Safety Mode
      </h2>
      
      <button class="roleBtn child" onclick="setMode('child')">👧 Child Safety</button>
      <button class="roleBtn women" onclick="setMode('women')">👩 Women Safety</button>
      <button class="roleBtn accident" onclick="setMode('accident')">🚑 Accident Emergency</button>
    </div>
  </div>

  <!-- MAIN APP -->
  <div id="app">
    <div class="card">
      <h2 id="modeTitle" class="section-title">Emergency Mode</h2>
      <div id="emergencyButtons"></div>
      <button class="btn-sos" onclick="callSOS()">🚨 SOS EMERGENCY</button>
    </div>

    <div class="card">
      <h2 class="section-title">🚔 Nearby Police</h2>
      <button class="btn-child" onclick="findPolice()">Find Police Stations</button>
      <div id="policeList" style="margin-top: 15px;"></div>
    </div>

    <div class="card">
      <h2 class="section-title">📍 Share Live Location</h2>
      <button class="btn-share" onclick="shareLocation()">Send Live Location Alert</button>
    </div>

    <div class="card">
      <h2 class="section-title">🌐 Universal SOS</h2>
      <button class="btn-universal" onclick="shareUniversalSOS()">Share SOS Link</button>
    </div>
  </div>

  <!-- SOS SCREEN -->
  <div id="sosScreen">
    <div class="sos-text">🚨 EMERGENCY ACTIVATED 🚨</div>
    <p style="font-size: 1.3rem; margin-top: 15px;">Calling Emergency Services...</p>
  </div>

<script>
let mode = "";
let userLat, userLng;

navigator.geolocation.getCurrentPosition(
  (pos) => { 
    userLat = pos.coords.latitude; 
    userLng = pos.coords.longitude; 
  },
  () => console.log("Location access denied")
);

function setMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("roleScreen").style.display = "none";
  document.getElementById("app").style.display = "block";

  let title = "";
  let buttonsHTML = "";

  if (mode === "child") {
    title = "👧 Child Safety Mode";
    buttonsHTML = `
      <button class="btn-child" onclick="callNumber('1098')">Child Helpline - 1098</button>
      <button class="btn-child" onclick="callNumber('112')">Emergency - 112</button>
    `;
  } 
  else if (mode === "women") {
    title = "👩 Women Safety Mode";
    buttonsHTML = `
      <button class="btn-women" onclick="callNumber('1091')">Women Helpline - 1091</button>
      <button class="btn-women" onclick="callNumber('112')">Emergency - 112</button>
    `;
  } 
  else if (mode === "accident") {
    title = "🚑 Accident Emergency Mode";
    buttonsHTML = `
      <button class="btn-accident" onclick="callNumber('108')">Ambulance - 108</button>
      <button class="btn-accident" onclick="callNumber('112')">Emergency - 112</button>
    `;
  }

  document.getElementById("modeTitle").innerHTML = title;
  document.getElementById("emergencyButtons").innerHTML = buttonsHTML;
}

function callNumber(num) {
  window.location.href = `tel:${num}`;
}

async function callSOS() {
    let emergencyNumber = "112";
    if (mode === "child") emergencyNumber = "1098";
    if (mode === "women") emergencyNumber = "1091";
    if (mode === "accident") emergencyNumber = "108";

    if (navigator.vibrate) {
        navigator.vibrate([600, 300, 600, 300, 600]);
    }

    document.getElementById("sosScreen").style.display = "flex";

    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    audio.loop = true;
    audio.play().catch(() => {});

    // Send to Backend
    if (userLat && userLng) {
        try {
            const payload = {
                mode: mode || "unknown",
                latitude: userLat,
                longitude: userLng,
                timestamp: new Date().toISOString()
            };

            await fetch('http://127.0.0.1:5000/api/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log("✅ SOS Alert sent to backend");
        } catch (error) {
            console.warn("⚠️ Backend not reachable", error);
        }
    }

    setTimeout(() => {
        window.location.href = `tel:${emergencyNumber}`;
    }, 1800);
}

function findPolice() {
  if (!userLat || !userLng) {
    alert("Location not available");
    return;
  }

  const radius = 5000;
  const query = `[out:json]; node["amenity"="police"](around:${radius},${userLat},${userLng}); out;`;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  document.getElementById("policeList").innerHTML = "⏳ Loading nearby stations...";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.elements.length) {
        document.getElementById("policeList").innerHTML = "❌ No police stations found nearby.";
        return;
      }

      let html = "";
      data.elements.forEach(station => {
        const name = station.tags.name || "Police Station";
        const lat = station.lat;
        const lon = station.lon;

        html += `
          <div style="background:#222; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #444;">
            <b>🚔 ${name}</b><br>
            <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:#00c853;">
              📍 View on Map
            </a>
          </div>
        `;
      });
      document.getElementById("policeList").innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("policeList").innerHTML = "⚠ Error loading police stations.";
    });
}

function shareLocation() {
  if (!userLat) return alert("Location not available");
  let msg = `🚨 Emergency Alert from Raksha Saheli\nMode: ${mode.toUpperCase()}\nLive Location: https://www.google.com/maps?q=${userLat},${userLng}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

function shareUniversalSOS() {
  let link = window.location.href + "?sos=active";
  let msg = `🚨 SOS ALERT 🚨\nI need immediate help!\n${link}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("sos") === "active") {
    alert("🚨 ACTIVE SOS TRIGGERED");
  }
};
</script>
</body>
</html>
