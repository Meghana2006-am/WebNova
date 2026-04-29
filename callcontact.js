function callContact(contactId) {
  const contact = emergencyContacts.find(c => c.id === contactId);
  if (contact && contact.number) {
    // Remove any spaces, dashes, brackets from the number
    let cleanNumber = contact.number.replace(/[\s\-\(\)]/g, '');
    
    // Ensure it's a valid number format
    if (cleanNumber.startsWith('+')) {
      // International format - keep as is
    } else if (cleanNumber.startsWith('0')) {
      // Remove leading zero for Indian numbers
      cleanNumber = '+91' + cleanNumber.substring(1);
    } else if (cleanNumber.length === 10) {
      // 10 digit Indian number
      cleanNumber = '+91' + cleanNumber;
    }
    
    console.log("Calling:", cleanNumber);
    window.location.href = `tel:${cleanNumber}`;
  } else {
    alert("❌ Contact not found or invalid number");
  }
}
