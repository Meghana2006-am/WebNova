// Voice Recognition Module - Raksha Saheli

let recognition = null;
let isListening = false;

function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log("Voice recognition not supported");
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SpeechRecognition();

  recog.continuous = false;
  recog.interimResults = false;
  recog.lang = 'en-US';

  recog.onstart = () => {
    isListening = true;
    console.log("Listening...");
  };

  recog.onerror = (event) => {
    console.log("Error:", event.error);
    stopListening();
  };

  recog.onend = () => {
    stopListening();
  };

  recog.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Command:", command);
    processCommand(command);
  };

  return recog;
}

function startVoiceRecognition() {
  if (!recognition) {
    recognition = initVoiceRecognition();
    if (!recognition) return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
      recognition.start();
    })
    .catch(() => {
      console.log("Microphone permission denied");
    });
}

function stopListening() {
  isListening = false;
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
  }
}

function processCommand(command) {
  if (command.includes("sos")) {
    alert("SOS Triggered");
  } else if (command.includes("police")) {
    alert("Finding police stations");
  } else if (command.includes("location")) {
    alert("Sharing location");
  } else {
    console.log("Unknown command");
  }
}
