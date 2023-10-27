let contacts = [];
let currentContactIndex = 0;
let contactDisplayTimer;
let displayTime = 400;
let isEditMode = false; // To track if we're editing an existing contact

window.onload = function () {
  try {
    contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    if (contacts.length > 0) {
      displayContact(contacts[currentContactIndex]);
    } else {
      document.getElementById('createContactEl').style.display = 'block';
    }

    document.getElementById('newContactForm').addEventListener('submit', function (event) {
      try {
        event.preventDefault();

        let contactData = {
          name: document.getElementById('name').value,
          title: document.getElementById('title').value,
          profilePicture: document.getElementById('profilePicture').value,
          companyLogo: document.getElementById('companyLogo').value,
        };

        // Check if all form fields are empty
        if (Object.values(contactData).every((value) => value === '')) {
          return; // Exit the function without adding a new contact
        }

        // If in edit mode, update the current contact
        if (isEditMode) {
          contacts[currentContactIndex] = contactData;
          isEditMode = false; // Reset edit mode flag
        } else {
          contacts.push(contactData);
        }

        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContact(contactData);
        hideForm();
        document.getElementById('newContactForm').reset();
      } catch (err) {
        console.error('Error processing the form submission:', err);
      }
    });

    document.body.addEventListener('mouseover', function () {
      document.getElementById('createContactEl').style.display = 'block';
    });

    document.body.addEventListener('mouseout', function () {
      document.getElementById('createContactEl').style.display = 'none';
    });
  } catch (err) {
    console.error('Error during window.onload:', err);
  }
};

function updateCurrent() {
  try {
    // Populate the form with the current contact's details
    let currentContact = contacts[currentContactIndex];
    document.getElementById('name').value = currentContact.name;
    document.getElementById('title').value = currentContact.title;
    document.getElementById('profilePicture').value = currentContact.profilePicture;
    document.getElementById('companyLogo').value = currentContact.companyLogo;

    // Set edit mode flag to true
    isEditMode = true;

    showForm();
  } catch (err) {
    console.error('Error in updateCurrent:', err);
  }
}

function showForm() {
  if (contactDisplayTimer) {
    clearTimeout(contactDisplayTimer);
  }
  try {
    document.getElementById('createContactEl').style.display = 'none';
    document.getElementById('modalContainer').style.display = 'block';
  } catch (err) {
    console.error('Error in showForm:', err);
  }
}

function hideForm() {
  try {
    document.getElementById('createContactEl').style.display = 'block';
    document.getElementById('modalContainer').style.display = 'none';
    document.getElementById('newContactForm').reset(); // Clear the form
    isEditMode = false; // Reset edit mode flag
  } catch (err) {
    console.error('Error in hideForm:', err);
  }
  if (contacts.length > 0) {
    displayContact(contacts[currentContactIndex]);
  } else {
    document.getElementById('createContactEl').style.display = 'block';
  }
}

function displayContact(contact) {
  try {
    document.getElementById('contactDisplay').style.display = 'block';
    document.getElementById('profilePictureImage').src = contact.profilePicture || '';
    document.getElementById('contactName').textContent = contact.name || '';
    document.getElementById('contactTitle').textContent = contact.title || '';
    if (contact.companyLogo) {
      document.getElementById('companyLogoCircle').style.display = 'block';
      document.getElementById('companyLogoImage').src = contact.companyLogo;
    } else {
      document.getElementById('companyLogoCircle').style.display = 'none';
    }
    if (contactDisplayTimer) {
      clearTimeout(contactDisplayTimer);
    }
    contactDisplayTimer = setTimeout(function () {
      currentContactIndex = (currentContactIndex + 1) % contacts.length;
      displayContact(contacts[currentContactIndex]);
    }, displayTime);
  } catch (err) {
    console.error('Error in displayContact:', err);
  }
}

function removeCurrent() {
  try {
    // Remove currentContactIndex contact from local storage
    contacts.splice(currentContactIndex, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    // If there are no contacts left, show the create contact form
    if (contacts.length === 0) {
      hideForm();
      location.reload();
    } else {
      // Otherwise, display the next contact
      currentContactIndex = (currentContactIndex + 1) % contacts.length;
      displayContact(contacts[currentContactIndex]);
    }
  } catch (err) {
    console.error('Error in removeCurrent:', err);
  }
}
