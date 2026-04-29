Raksha Saheli 

## 🚨 1. Problem Context (Real World Issue)
In emergency situations like harassment, accidents, or sudden danger, the biggest challenge is **human panic response**:
- People cannot type or unlock phones properly
- Time is wasted searching for contacts or numbers
- Delay in response can worsen the situation

👉 We identified a critical gap:  
**There is no fast, hands-free, intelligent emergency system that works instantly under panic conditions.**

---

## 💡 2. Our Solution – Raksha Saheli
We built **Raksha Saheli – Voice Safety Companion**, a real-time emergency response web application designed to reduce reaction time to seconds.

It works as a **digital safety assistant** that activates help using:
- Voice commands 🎙️  
- One-tap SOS 🚨  
- Automatic location tracking 📍  
- Emergency contact alerts 👥  

---

## ⚙️ 3. System Workflow (How It Works)

### Step 1: Mode Selection
User selects safety mode:
- 👧 Child Safety  
- 👩 Women Safety  
- 🚑 Accident Emergency  

---

### Step 2: Location Detection
- System automatically captures GPS location using browser Geolocation API  
- Location is stored for emergency sharing  

---

### Step 3: Emergency Trigger
User can trigger help via:
- 🎙️ Voice command (e.g., “SOS”, “Help me”, “Emergency”)  
- 🚨 Manual SOS button  

---

### Step 4: Automated Response System
Once triggered:
- Emergency call is initiated (112 / 1091 / 108 / 1098)  
- Live Google Maps location is generated  
- Alert is prepared for sharing  
- Police station data is fetched using API  

---

## 🧠 4. Key Technical Features

### 🎙️ Voice Recognition System
- Uses Web Speech API  
- Converts speech → command detection  
- Enables hands-free emergency activation  

---

### 📍 Geolocation System
- Captures real-time latitude & longitude  
- Enables live tracking during emergencies  

---

### 👥 Emergency Contact Manager
- Users can add/remove contacts  
- Stored using Local Storage  
- Persistent even after refresh  

---

### 🚔 Police Station Finder
- Uses OpenStreetMap Overpass API  
- Finds nearby police stations dynamically  

---

### 🌐 SOS Sharing System
- Generates WhatsApp-ready emergency message  
- Includes live location link  

---

## ⚡ 5. Innovation Highlights
- Fully voice-controlled emergency system  
- Works in panic situations without typing  
- Combines AI speech recognition + geolocation  
- Real-time emergency automation pipeline  
- Designed for real-world deployment scenarios  

---

## 📊 6. Impact Analysis

### 👩 Women Safety
Quick response during harassment or unsafe travel situations

### 👧 Child Safety
Immediate alert system for missing or danger situations

### 🚑 Accident Support
Fast emergency calling and location sharing

---

## ⏱️ 7. Performance Goal
👉 Designed to reduce emergency response time to **under 5 seconds**

---

## 🏁 8. Final Statement
Raksha Saheli is not just a web application — it is a **real-time emergency response ecosystem** that bridges the gap between danger and immediate help using voice, automation, and location intelligence.

It transforms a simple browser into a **life-saving assistant.**
