// Store contacts
let emergencyContacts = [];

// Save 2 contacts
function saveContacts() {
  const name1 = document.getElementById("name1").value.trim();
  const number1 = document.getElementById("number1").value.trim();

  const name2 = document.getElementById("name2").value.trim();
  const number2 = document.getElementById("number2").value.trim();

  let contacts = [];

  if (name1 && number1) {
    contacts.push({ id: "c1", name: name1, number: number1 });
  }

  if (name2 && number2) {
    contacts.push({ id: "c2", name: name2, number: number2 });
  }

  if (contacts.length === 0) {
    alert("Please enter at least one contact");
    return;
  }

  emergencyContacts = contacts;

  localStorage.setItem("raksha_contacts", JSON.stringify(emergencyContacts));

  renderContacts();
}

// Load contacts on start
function loadContacts() {
  const saved = localStorage.getItem("raksha_contacts");
  if (saved) {
    emergencyContacts = JSON.parse(saved);
    renderContacts();
  }
}

// Show contacts
function renderContacts() {
  const container = document.getElementById("contactsList");
  container.innerHTML = "";

  emergencyContacts.forEach(contact => {
    container.innerHTML += `
      <div style="background:#eee; padding:10px; margin:10px; border-radius:10px;">
        <b>${contact.name}</b><br>
        📞 ${contact.number}<br><br>
        <button onclick="callContact('${contact.number}')">📞 Call</button>
      </div>
    `;
  });
}

// Call
function callContact(number) {
  window.location.href = `tel:${number}`;
}
