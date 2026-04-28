let mode = "";
let userLat = null, userLng = null;
let recognition = null;
let isListening = false;

// Default contacts
let emergencyContacts = [
  { id: "contact1", name: "Meghana", number: "9880333932" },
  { id: "contact2", name: "Mithun N", number: "8123150416" },
  { id: "contact3", name: "Mithun L", number: "8151033818" },
  { id: "contact4", name: "Merin Thomos", number: "7625050448" }
];

function loadContacts() {
  const saved = localStorage.getItem("raksha_emergency_contacts");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) {
        emergencyContacts = parsed;
      }
    } catch(e) {}
  }
  renderContactsList();
}

function saveContactsToStorage() {
  localStorage.setItem("raksha_emergency_contacts", JSON.stringify(emergencyContacts));
}

function renderContactsList() {
  const container = document.getElementById('contactsList');
  if (!container) return;
  
  if (emergencyContacts.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#636e72;">No contacts added. Click "+ Add New Contact" to add emergency contacts.</div>';
    return;
  }
  
  let html = '';
  emergencyContacts.forEach((contact) => {
    html += `
      <div class="custom-contact-card" data-id="${contact.id}">
        <div class="custom-contact-name">👤 ${escapeHtml(contact.name)}</div>
        <div class="custom-contact-number">📞 ${escapeHtml(contact.number)}</div>
        <div class="contact-buttons">
          <button class="btn-custom" onclick="callContact('${contact.id}')">📞 Call Now</button>
          <button class="small-btn delete-contact" onclick="deleteContact('${contact.id}')">🗑️ Remove</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function callContact(contactId) {
  const contact = emergencyContacts.find(c => c.id === contactId);
  if (contact && contact.number) {
    const cleanNumber = contact.number.replace(/[\s\-\(\)]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  } else {
    alert("Contact not found");
  }
}

function deleteContact(contactId) {
  if (confirm("Are you sure you want to remove this emergency contact?")) {
    emergencyContacts = emergencyContacts.filter(c => c.id !== contactId);
    saveContactsToStorage();
    renderContactsList();
    speakText("Contact removed");
  }
}

function showAddContactForm() {
  document.getElementById('addContactPanel').style.display = 'block';
  document.getElementById('newContactName').value = '';
  document.getElementById('newContactNumber').value = '';
}

function hideAddContactForm() {
  document.getElementById('addContactPanel').style.display = 'none';
}

function addNewContact() {
  const name = document.getElementById('newContactName').value.trim();
  const number = document.getElementById('newContactNumber').value.trim();
  
  if (!name || !number) {
    alert("Please enter both name and number");
    return;
  }
  
  if (!/^[\d\s+()-]+$/.test(number)) {
    alert("Please enter a valid phone number");
    return;
  }
  
  const newId = "contact_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  emergencyContacts.push({
    id: newId,
    name: name,
    number: number
  });
  
  saveContactsToStorage();
  renderContactsList();
  hideAddContactForm();
  speakText(`${name} added to emergency contacts`);
  document.getElementById('voiceFeedback').innerHTML = `✅ Added ${name} as emergency contact`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
      },
      (err) => {
        console.log("Location error:", err.message);
      }
    );
  }
}

function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    document.getElementById('voiceFeedback').innerHTML = "❌ Voice recognition not supported. Please use Chrome, Edge, or Safari.";
    document.getElementById('voiceBtn').disabled = true;
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SpeechRecognition();
  
  recog.continuous = false;
  recog.interimResults = false;
  recog.lang = 'en-US';
  
  recog.onstart = () => {
    isListening = true;
    document.getElementById('voiceBtn').classList.add('listening');
    document.getElementById('voiceBtn').innerHTML = "🎙️ Listening... Speak Now";
    document.getElementById('voiceStatus').innerHTML = "🔴 Listening";
    let contactNames = emergencyContacts.map(c => c.name.split(' ')[0]).join(', ');
    document.getElementById('voiceFeedback').innerHTML = `🎤 Listening... Say: SOS, Helpline, Police, Share Location, or Call ${contactNames.substring(0, 60)}`;
    document.getElementById('permissionHint').style.display = 'none';
  };
  
  recog.onerror = (event) => {
    let errorMessage = "";
    switch(event.error) {
      case 'not-allowed':
        errorMessage = "❌ Microphone access denied. Click the camera/mic icon in your browser address bar and ALLOW microphone access.";
        break;
      case 'no-speech':
        errorMessage = "🎤 No speech detected. Please click the button and speak clearly.";
        break;
      default:
        errorMessage = "⚠️ Could not recognize speech. Please try again.";
    }
    document.getElementById('voiceFeedback').innerHTML = errorMessage;
    stopListening();
  };
  
  recog.onend = () => {
    if (isListening) stopListening();
  };
  
  recog.onresult = (event) => {
    if (!event.results || event.results.length === 0) return;
    const command = event.results[0][0].transcript.toLowerCase().trim();
    const resultDiv = document.getElementById('voiceCommandResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `🗣️ You said: "${command}"`;
    document.getElementById('voiceFeedback').innerHTML = `✅ Recognized: "${command}"`;
    processCommand(command);
    stopListening();
  };
  
  return recog;
}

function startVoiceRecognition() {
  if (!recognition) {
    recognition = initVoiceRecognition();
    if (!recognition) return;
  }
  
  try {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        stream.getTracks().forEach(track => track.stop());
        recognition.start();
      })
      .catch(function(err) {
        document.getElementById('voiceFeedback').innerHTML = "❌ Cannot access microphone. Please allow microphone access.";
      });
  } catch(e) {
    document.getElementById('voiceFeedback').innerHTML = "Error starting voice recognition.";
  }
}

function stopListening() {
  isListening = false;
  const btn = document.getElementById('voiceBtn');
  btn.classList.remove('listening');
  btn.innerHTML = "🎙️ Activate Voice Command";
  document.getElementById('voiceStatus').innerHTML = "⚪ Idle";
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
  }
}

function processCommand(command) {
  if (!mode) {
    speakText("Please select safety mode first.");
    return;
  }
  
  const cmd = command.toLowerCase();
  
  for (let contact of emergencyContacts) {
    const contactNameLower = contact.name.toLowerCase();
    if (cmd.includes('call') && cmd.includes(contactNameLower)) {
      speakText(`Calling ${contact.name}`);
      setTimeout(() => { 
        const cleanNumber = contact.number.replace(/[\s\-\(\)]/g, '');
        window.location.href = `tel:${cleanNumber}`;
      }, 300);
      return;
    }
  }
  
  if (cmd.includes('sos') || cmd.includes('emergency') || cmd === 'help') {
    callSOS();
    speakText("SOS activated. Calling emergency.");
  }
  else if (cmd.includes('helpline') || cmd.includes('call helpline')) {
    let number = "112";
    if (mode === "child") number = "1098";
    else if (mode === "women") number = "1091";
    else if (mode === "accident") number = "108";
    speakText(`Calling helpline ${number}`);
    setTimeout(() => { window.location.href = `tel:${number}`; }, 500);
  }
  else if (cmd.includes('police') || cmd.includes('find police')) {
    findPolice();
    speakText("Searching for police stations.");
  }
  else if (cmd.includes('share location') || cmd.includes('location')) {
    shareLocation();
    speakText("Sharing your location.");
  }
  else if (cmd.includes('universal sos') || cmd.includes('universal')) {
    shareUniversalSOS();
    speakText("Sharing universal SOS link.");
  }
  else {
    speakText(`Command not recognized. Try: SOS, Helpline, Police, Share Location`);
  }
}

function speakText(message) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function setMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("roleScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  getLocation();

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
  speakText(`${mode} mode activated. You can use voice commands.`);
}

function callNumber(num) {
  window.location.href = `tel:${num}`;
}

function callSOS() {
  let emergencyNumber = "112";
  if (mode === "child") emergencyNumber = "1098";
  if (mode === "women") emergencyNumber = "1091";
  if (mode === "accident") emergencyNumber = "108";

  if (navigator.vibrate) {
    navigator.vibrate([600, 300, 600]);
  }

  document.getElementById("sosScreen").style.display = "flex";
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.value = 880;
    gain.gain.value = 0.5;
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1.5);
    oscillator.stop(audioCtx.currentTime + 1.5);
  } catch(e) {}

  setTimeout(() => {
    window.location.href = `tel:${emergencyNumber}`;
  }, 1500);
}

function closeSOS() {
  document.getElementById("sosScreen").style.display = "none";
}

function findPolice() {
  if (!userLat || !userLng) {
    document.getElementById("policeList").innerHTML = "⚠️ Please enable location to find nearby police stations.";
    return;
  }

  const query = `[out:json]; node["amenity"="police"](around:5000,${userLat},${userLng}); out;`;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
  
  document.getElementById("policeList").innerHTML = "⏳ Searching for police stations...";
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.elements || data.elements.length === 0) {
        document.getElementById("policeList").innerHTML = "❌ No police stations found nearby.";
        return;
      }
      
      let html = "";
      data.elements.slice(0, 5).forEach(station => {
        const name = station.tags.name || "Police Station";
        html += `
          <div class="police-item">
            <b>🚔 ${name}</b><br>
            <a href="https://www.google.com/maps?q=${station.lat},${station.lon}" target="_blank">📍 View on Map →</a>
          </div>
        `;
      });
      document.getElementById("policeList").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("policeList").innerHTML = "⚠️ Internet needed for live police data. Call 112 for emergency.";
    });
}

function shareLocation() {
  if (!userLat || !userLng) {
    alert("Please enable location services first.");
    return;
  }
  const msg = `🚨 Emergency Alert from Raksha Saheli\nMode: ${mode.toUpperCase()}\nLive Location: https://www.google.com/maps?q=${userLat},${userLng}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

function shareUniversalSOS() {
  let msg = `🚨 SOS ALERT 🚨\nI need immediate help!\nMode: ${mode}`;
  if (userLat && userLng) {
    msg += `\nLocation: https://www.google.com/maps?q=${userLat},${userLng}`;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

window.onload = function() {
  loadContacts();
  recognition = initVoiceRecognition();
  getLocation();
};
