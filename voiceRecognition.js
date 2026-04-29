// voiceRecognition.js - Voice commands for Raksha Saheli

let recognition = null;
let isListening = false;

// Initialize voice recognition
document.addEventListener('DOMContentLoaded', function() {
    initVoiceRecognition();
    
    // Voice button click handler
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecognition);
    }
});

function initVoiceRecognition() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English
        
        recognition.onstart = function() {
            isListening = true;
            const voiceStatus = document.getElementById('voiceStatus');
            voiceStatus.innerHTML = "🎤 Listening... Say a command";
            voiceStatus.style.backgroundColor = "#e3f2fd";
            document.getElementById('voiceBtn').style.backgroundColor = "#2980b9";
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log("Voice command:", transcript);
            processVoiceCommand(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error);
            const voiceStatus = document.getElementById('voiceStatus');
            voiceStatus.innerHTML = "❌ Could not recognize. Please try again.";
            voiceStatus.style.backgroundColor = "#ffe5e5";
            setTimeout(() => {
                voiceStatus.innerHTML = "💬 Click the mic and say: 'SOS', 'Find police', or 'Share location'";
                voiceStatus.style.backgroundColor = "#f8f9fa";
            }, 3000);
            isListening = false;
            document.getElementById('voiceBtn').style.backgroundColor = "#3498db";
        };
        
        recognition.onend = function() {
            isListening = false;
            document.getElementById('voiceBtn').style.backgroundColor = "#3498db";
            setTimeout(() => {
                const voiceStatus = document.getElementById('voiceStatus');
                if (voiceStatus.innerHTML === "🎤 Listening... Say a command") {
                    voiceStatus.innerHTML = "💬 Click the mic and say: 'SOS', 'Find police', or 'Share location'";
                    voiceStatus.style.backgroundColor = "#f8f9fa";
                }
            }, 1000);
        };
        
    } else {
        document.getElementById('voiceStatus').innerHTML = "⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.";
        document.getElementById('voiceBtn').disabled = true;
        document.getElementById('voiceBtn').style.opacity = "0.5";
    }
}

function toggleVoiceRecognition() {
    if (!recognition) {
        alert("Voice recognition not supported in your browser");
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch(e) {
            console.log("Error starting recognition:", e);
        }
    }
}

function processVoiceCommand(command) {
    const voiceStatus = document.getElementById('voiceStatus');
    
    // Check for SOS commands
    if (command.includes('sos') || 
        command.includes('help') || 
        command.includes('emergency') || 
        command.includes('save me') || 
        command.includes('danger')) {
        
        voiceStatus.innerHTML = "🚨 SOS command recognized! Activating emergency...";
        voiceStatus.style.backgroundColor = "#e74c3c";
        voiceStatus.style.color = "white";
        
        if (typeof triggerSOS === 'function') {
            triggerSOS();
        } else {
            console.log("SOS function not found");
            alert("SOS ACTIVATED! (Demo)");
        }
    }
    
    // Check for police commands
    else if (command.includes('police') || 
             command.includes('find police') || 
             command.includes('nearby police') || 
             command.includes('police station')) {
        
        voiceStatus.innerHTML = "🚔 Finding nearby police stations...";
        voiceStatus.style.backgroundColor = "#f39c12";
        
        if (typeof findNearbyPolice === 'function' && window.currentLocation) {
            findNearbyPolice(window.currentLocation.lat, window.currentLocation.lng);
            setTimeout(() => {
                voiceStatus.innerHTML = "✅ Police stations found! Check the map above.";
                voiceStatus.style.backgroundColor = "#d4edda";
                setTimeout(() => {
                    voiceStatus.innerHTML = "💬 Click the mic and say: 'SOS', 'Find police', or 'Share location'";
                    voiceStatus.style.backgroundColor = "#f8f9fa";
                }, 3000);
            }, 2000);
        } else {
            voiceStatus.innerHTML = "⚠️ Please enable location first";
            if (typeof getUserLocation === 'function') {
                getUserLocation();
            }
        }
    }
    
    // Check for location sharing commands
    else if (command.includes('location') || 
             command.includes('share location') || 
             command.includes('where am i') || 
             command.includes('share my location')) {
        
        voiceStatus.innerHTML = "📍 Sharing your live location...";
        voiceStatus.style.backgroundColor = "#2ecc71";
        
        if (typeof shareLiveLocation === 'function') {
            shareLiveLocation();
        } else {
            alert("Sharing location: " + (window.currentLocation ? 
                `Your location is ${window.currentLocation.lat}, ${window.currentLocation.lng}` : 
                "Getting your location..."));
        }
    }
    
    // Check for emergency numbers command
    else if (command.includes('emergency number') || 
             command.includes('call police') || 
             command.includes('helpline')) {
        
        voiceStatus.innerHTML = "📞 Emergency numbers: Police 100, Women Helpline 1091, Ambulance 108";
        
        // Scroll to emergency contacts
        document.querySelector('.emergency-contacts').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Unknown command
    else {
        voiceStatus.innerHTML = `🤔 I heard: "${command}". Try saying "SOS", "Find police", or "Share location"`;
        voiceStatus.style.backgroundColor = "#fff3cd";
        setTimeout(() => {
            voiceStatus.innerHTML = "💬 Click the mic and say: 'SOS', 'Find police', or 'Share location'";
            voiceStatus.style.backgroundColor = "#f8f9fa";
        }, 3000);
    }
    
    // Reset styling after commands (except SOS which has its own timing)
    if (!command.includes('sos')) {
        setTimeout(() => {
            if (voiceStatus.innerHTML !== "💬 Click the mic and say: 'SOS', 'Find police', or 'Share location'") {
                setTimeout(() => {
                    voiceStatus.style.backgroundColor = "#f8f9fa";
                    voiceStatus.style.color = "#555";
                }, 2000);
            }
        }, 3000);
    }
}

// Helper function to speak text (optional)
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
    }
}
