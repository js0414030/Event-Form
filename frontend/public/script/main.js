// // DOM Elements
// const form = document.getElementById('eventForm');
// const backBtn = document.getElementById('backBtn');
// const imagePreview = document.getElementById('imagePreview');
// const eventsGrid = document.getElementById('eventsGrid');
// const prevBtn = document.getElementById('prevBtn');
// const nextBtn = document.getElementById('nextBtn');
// const pageInfo = document.getElementById('pageInfo');

// // Global variables
// let currentPage = 1;
// const eventsPerPage = 6;

// // Initialize the app
// document.addEventListener('DOMContentLoaded', () => {
//   // Image preview handler
//   document.getElementById('eventImage').addEventListener('change', (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         imagePreview.src = event.target.result;
//         imagePreview.style.display = 'block';
//       };
//       reader.readAsDataURL(file);
//     } else {
//       imagePreview.style.display = 'none';
//     }
//   });

//   // Form submission handler
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData(form);

//       // Validate required fields
//       const requiredFields = ['eventName', 'eventCategory', 'clubName',
//         'eventDescription', 'startTime', 'endTime',
//         'attendance', 'status', 'eventImage'];

//       let isValid = true;
//       requiredFields.forEach(field => {
//         const value = field === 'eventImage'
//           ? document.getElementById('eventImage').files[0]
//           : formData.get(field);

//         if (!value) {
//           document.getElementById(field).style.borderColor = 'var(--error-color)';
//           isValid = false;
//         } else {
//           document.getElementById(field).style.borderColor = '';
//         }
//       });

//       if (!isValid) {
//         showNotification('Please fill all required fields', true);
//         return;
//       }

//       const response = await fetch('/api/events', {
//         method: 'POST',
//         body: formData
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to create event');
//       }

//       showNotification('Event created successfully!');
//       form.reset();
//       imagePreview.style.display = 'none';
//       loadEvents(); // Refresh events list
//     } catch (error) {
//       showNotification(error.message, true);
//       console.error('Error:', error);
//     }
//   });

//   // Back button handler
//   backBtn.addEventListener('click', () => {
//     window.location.href = '/';
//   });

//   // Pagination handlers
//   prevBtn.addEventListener('click', () => {
//     if (currentPage > 1) {
//       currentPage--;
//       loadEvents();
//     }
//   });

//   nextBtn.addEventListener('click', () => {
//     currentPage++;
//     loadEvents();
//   });

//   // Load initial events
//   loadEvents();
// });

// // Load events with pagination
// async function loadEvents() {
//   try {
//     const response = await fetch(`/api/events?page=${currentPage}&limit=${eventsPerPage}`);
//     const { data: events, total, pages } = await response.json();

//     renderEvents(events, total, pages);
//   } catch (error) {
//     showNotification('Failed to load events', true);
//     console.error('Error loading events:', error);
//   }
// }

// // Render events to the grid
// function renderEvents(events, total, totalPages) {
//   eventsGrid.innerHTML = '';

//   if (events.length === 0) {
//     eventsGrid.innerHTML = '<div class="empty-state">No events found</div>';
//     return;
//   }

//   events.forEach(event => {
//     const eventCard = document.createElement('div');
//     eventCard.className = 'event-card';
//     eventCard.innerHTML = `
//       <img src="${event.eventImage}" alt="${event.eventName}" class="event-image">
//       <div class="event-details">
//         <h3>${event.eventName}</h3>
//         <p><strong>${event.clubName}</strong> • ${event.eventCategory}</p>
//         <p>${new Date(event.startTime).toLocaleDateString()}</p>
//         <span class="event-status">${event.status}</span>
//       </div>
//       <div class="event-actions">
//         <button class="edit-btn" data-id="${event._id}">Edit</button>
//         <button class="delete-btn" data-id="${event._id}">Delete</button>
//       </div>
//     `;
//     eventsGrid.appendChild(eventCard);
//   });

//   // Update pagination controls
//   updatePagination(total, totalPages);
// }

// // Update pagination UI
// function updatePagination(total, totalPages) {
//   pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
//   prevBtn.disabled = currentPage <= 1;
//   nextBtn.disabled = currentPage >= totalPages;
// }

// // Show notification
// function showNotification(message, isError = false) {
//   const notification = document.getElementById('notification');
//   const messageEl = document.getElementById('notification-message');

//   notification.className = isError ? 'notification error' : 'notification';
//   messageEl.textContent = message;

//   notification.style.display = 'flex';
//   setTimeout(() => notification.classList.add('show'), 10);

//   setTimeout(() => {
//     notification.classList.remove('show');
//     setTimeout(() => notification.style.display = 'none', 300);
//   }, 3000);
// }





// DOM Elements
const form = document.getElementById('eventForm');
const backBtn = document.getElementById('backBtn');
const imagePreview = document.getElementById('imagePreview');
const eventsGrid = document.getElementById('eventsGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// Global variables
let currentPage = 1;
const eventsPerPage = 6;
let currentEditId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Image preview handler
  document.getElementById('eventImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = 'none';
    }
  });

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(form);
      const url = currentEditId ? `/api/events/${currentEditId}` : '/api/events';
      const method = currentEditId ? 'PUT' : 'POST';

      // Validate required fields
      const requiredFields = ['eventName', 'eventCategory', 'clubName',
        'eventDescription', 'startTime', 'endTime',
        'attendance', 'status'];

      let isValid = true;
      requiredFields.forEach(field => {
        const value = formData.get(field);
        const element = document.getElementById(field);

        if (!value && field !== 'eventImage') {
          element.style.borderColor = 'var(--error-color)';
          isValid = false;
        } else {
          element.style.borderColor = '';
        }
      });

      // Validate image (only for new events)
      if (!currentEditId && !formData.get('eventImage')) {
        document.getElementById('eventImage').style.borderColor = 'var(--error-color)';
        isValid = false;
      } else {
        document.getElementById('eventImage').style.borderColor = '';
      }

      if (!isValid) {
        showNotification('Please fill all required fields', true);
        return;
      }

      const response = await fetch(url, {
        method,
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save event');
      }

      showNotification(`Event ${currentEditId ? 'updated' : 'created'} successfully!`);
      form.reset();
      imagePreview.style.display = 'none';
      currentEditId = null;
      document.querySelector('button[type="submit"]').textContent = 'Add';
      loadEvents();
    } catch (error) {
      showNotification(error.message, true);
      console.error('Error:', error);
    }
  });

  // Back button handler
  backBtn.addEventListener('click', () => {
    window.location.href = '/';
  });

  // Pagination handlers
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadEvents();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadEvents();
  });

  // Load initial events
  loadEvents();
});

// Load events with pagination
async function loadEvents() {
  try {
    const response = await fetch(`/api/events?page=${currentPage}&limit=${eventsPerPage}`);
    const { data: events, total, pages } = await response.json();

    renderEvents(events, total, pages);
  } catch (error) {
    showNotification('Failed to load events', true);
    console.error('Error loading events:', error);
  }
}

// Render events to the grid
function renderEvents(events, total, totalPages) {
  eventsGrid.innerHTML = '';

  if (events.length === 0) {
    eventsGrid.innerHTML = '<div class="empty-state">No events found</div>';
    return;
  }

  events.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `
      <img src="${event.eventImage}" alt="${event.eventName}" class="event-image">
      <div class="event-details">
        <h3>${event.eventName}</h3>
        <p><strong>${event.clubName}</strong> • ${event.eventCategory}</p>
        <p>${new Date(event.startTime).toLocaleDateString()}</p>
        <span class="event-status">${event.status}</span>
      </div>
      <div class="event-actions">
        <button class="edit-btn" data-id="${event._id}">Edit</button>
        <button class="delete-btn" data-id="${event._id}">Delete</button>
      </div>
    `;
    eventsGrid.appendChild(eventCard);
  });

  // Set up event listeners for edit and delete buttons
  setupEditButtons();
  setupDeleteButtons();

  // Update pagination controls
  updatePagination(total, totalPages);
}

// Set up edit buttons
function setupEditButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      try {
        const eventId = e.target.dataset.id;
        const response = await fetch(`/api/events/${eventId}`);
        const { data: event } = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        // Fill the form with event data
        document.getElementById('eventName').value = event.eventName;
        document.getElementById('eventLocation').value = event.eventLocation || '';
        document.getElementById('eventCategory').value = event.eventCategory;
        document.getElementById('clubName').value = event.clubName;
        document.getElementById('eventDescription').value = event.eventDescription;

        // Convert dates to local datetime format
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        document.getElementById('startTime').value = startTime.toISOString().slice(0, 16);
        document.getElementById('endTime').value = endTime.toISOString().slice(0, 16);

        document.getElementById('attendance').value = event.attendance;
        document.getElementById('targetAudience').value = event.targetAudience || '';
        document.getElementById('expectedAudience').value = event.expectedAudience || '';
        document.getElementById('status').value = event.status;

        // Show current image
        imagePreview.src = event.eventImage;
        imagePreview.style.display = 'block';

        // Change form to update mode
        currentEditId = event._id;
        document.querySelector('button[type="submit"]').textContent = 'Update';

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });

        showNotification('Event loaded for editing');
      } catch (error) {
        showNotification(error.message, true);
        console.error('Edit error:', error);
      }
    });
  });
}


// delete pop up logic update

let deleteEventId = null;

function setupDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteEventId = e.target.dataset.id;
      document.getElementById('confirmDeleteModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}

// Confirm & cancel handlers
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!deleteEventId) return;

  try {
    const response = await fetch(`/api/events/${deleteEventId}`, { method: 'DELETE' });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || 'Failed to delete event');

    showNotification('Event deleted successfully!');
    loadEvents();
  } catch (error) {
    showNotification(error.message, true);
    console.error('Delete error:', error);
  } finally {
    closeDeleteModal();
  }
});

document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

function closeDeleteModal() {
  deleteEventId = null;
  document.getElementById('confirmDeleteModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}


// Update pagination UI
function updatePagination(total, totalPages) {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

// Show notification
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  const messageEl = document.getElementById('notification-message');

  notification.className = isError ? 'notification error' : 'notification';
  messageEl.textContent = message;

  notification.style.display = 'flex';
  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.style.display = 'none', 300);
  }, 3000);
}













// DOM Elements
const editModal = document.getElementById('editModal');
const editEventForm = document.getElementById('editEventForm');
const editImagePreview = document.getElementById('editImagePreview');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Modal close handlers
closeModalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
});

// Edit image preview handler
document.getElementById('editEventImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      editImagePreview.src = event.target.result;
      editImagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Setup edit buttons
function setupEditButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      try {
        const eventId = e.target.dataset.id;
        const response = await fetch(`/api/events/${eventId}`);
        const { data: event } = await response.json();

        if (!response.ok) throw new Error('Failed to fetch event data');

        // Fill the edit form
        document.getElementById('editEventId').value = event._id;
        document.getElementById('editEventName').value = event.eventName;
        document.getElementById('editEventLocation').value = event.eventLocation || '';
        document.getElementById('editEventCategory').value = event.eventCategory;
        document.getElementById('editClubName').value = event.clubName;
        document.getElementById('editEventDescription').value = event.eventDescription;

        // Handle dates
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
        document.getElementById('editStartTime').value = startTime.toISOString().slice(0, 16);
        document.getElementById('editEndTime').value = endTime.toISOString().slice(0, 16);

        // Other fields
        document.getElementById('editAttendance').value = event.attendance;
        document.getElementById('editTargetAudience').value = event.targetAudience || '';
        document.getElementById('editExpectedAudience').value = event.expectedAudience || '';
        document.getElementById('editStatus').value = event.status;

        // Handle image
        editImagePreview.src = event.eventImage;
        editImagePreview.style.display = 'block';
        document.getElementById('currentImagePath').value = event.eventImage;

        // Show modal
        editModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

      } catch (error) {
        showNotification(error.message, true);
        console.error('Edit error:', error);
      }
    });
  });
}

// Edit form submission
editEventForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(editEventForm);
    const eventId = document.getElementById('editEventId').value;

    // If no new image was selected, keep the current one
    if (!formData.get('eventImage')) {
      formData.delete('eventImage');
      formData.append('eventImage', document.getElementById('currentImagePath').value);
    }

    const response = await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || 'Failed to update event');

    showNotification('Event updated successfully!');
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    loadEvents();
  } catch (error) {
    showNotification(error.message, true);
    console.error('Update error:', error);
  }
});

// Don't forget to call setupEditButtons() in your renderEvents function
function renderEvents(events, total, totalPages) {
  eventsGrid.innerHTML = '';

  if (events.length === 0) {
    eventsGrid.innerHTML = '<div class="empty-state">No events found</div>';
    return;
  }

  events.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `
      <img src="${event.eventImage}" alt="${event.eventName}" class="event-image">
      <div class="event-details">
        <h3>${event.eventName}</h3>
        <p><strong>${event.clubName}</strong> • ${event.eventCategory}</p>
        <p>${new Date(event.startTime).toLocaleDateString()}</p>
        <span class="event-status">${event.status}</span>
      </div>
      <div class="event-actions">
        <button class="edit-btn" data-id="${event._id}">Edit</button>
        <button class="delete-btn" data-id="${event._id}">Delete</button>
      </div>
    `;
    eventsGrid.appendChild(eventCard);
  });

  // Set up event listeners for the new buttons
  setupEditButtons();
  setupDeleteButtons();

  updatePagination(total, totalPages);
}