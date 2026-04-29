function shareLocation() {
  if (!userLat || !userLng) {
    alert("⚠️ Please enable location services first.");
    getLocation(); // Try to get location again
    return;
  }
  
  const locationLink = `https://www.google.com/maps?q=${userLat},${userLng}`;
  const message = `🚨 EMERGENCY ALERT from Raksha Saheli 🚨\n\nMode: ${mode.toUpperCase()}\n📍 My Live Location: ${locationLink}\n\nI need immediate help!`;
  
  // Try WhatsApp first
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  // Fallback to SMS if WhatsApp fails
  const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
  
  // Ask user which method to use
  const choice = confirm("Share location via:\n\nOK = WhatsApp\nCancel = SMS");
  
  if (choice) {
    window.open(whatsappUrl, '_blank');
  } else {
    window.location.href = smsUrl;
  }
  
  // Also copy to clipboard as backup
  navigator.clipboard.writeText(message).then(() => {
    document.getElementById('voiceFeedback').innerHTML = "✅ Location link copied to clipboard!";
  });
}
