const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const bookModal = document.getElementById('book-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');
const modalClose = document.getElementById('modal-close');
const logoutButton = document.getElementById('logout-btn');

// Fetch local books.json data
async function fetchLocalBooks() {
  try {
    const response = await fetch('books.json');
    if (!response.ok) throw new Error('Failed to load local books.');
    const data = await response.json();
    return data.items || []; // Ensure we return an array
  } catch (error) {
    console.error('Error loading local books:', error);
    return [];
  }
}

// Search books (both local and Google Books API)
async function searchBooks(query) {
  const apiKey = 'AIzaSyBVvOjbDoIzmEeK2uSfzSM8eoBfNKc6YHI'; // My API key
  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    resultsDiv.innerHTML = '<p>Loading...</p>'; // Show loading message

    // Fetch data from both sources
    const [localBooks, googleBooksResponse] = await Promise.all([
      fetchLocalBooks(),
      fetch(googleBooksUrl).then(res => res.ok ? res.json() : Promise.reject('Failed to fetch Google Books')),
    ]);

    // Combine results
    const googleBooks = googleBooksResponse.items || [];
    const allBooks = [...localBooks, ...googleBooks];

    displayResults(allBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    resultsDiv.innerHTML = '<p>Error fetching books. Please try again.</p>';
  }
}

// Display results
function displayResults(books) {
  resultsDiv.innerHTML = '';
  if (books.length > 0) {
    books.forEach(book => {
      const bookInfo = book.volumeInfo || book; // Handle both Google Books and local JSON structure
      const bookElement = document.createElement('div');
      bookElement.classList.add('book');
      bookElement.innerHTML = `
        <h3>${bookInfo.title}</h3>
        <p><strong>Author(s):</strong> ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
        <p><strong>Publisher:</strong> ${bookInfo.publisher || 'Unknown'}</p>
        <p><strong>Published Date:</strong> ${bookInfo.publishedDate || 'Unknown'}</p>
        <p><strong>Description:</strong> ${bookInfo.description ? bookInfo.description.slice(0, 150) + '...' : 'No description available.'}</p>
        ${bookInfo.previewLink ? `<button class="preview-btn" data-link="${bookInfo.previewLink}">Preview</button>` : '<p>No preview available.</p>'}
      `;
      resultsDiv.appendChild(bookElement);
    });

    // Add event listeners to Preview buttons
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const previewLink = e.target.getAttribute('data-link');
        if (previewLink) {
          // Open the preview link directly in a new tab
          window.open(previewLink, '_blank');
        } else {
          console.error("No preview link found.");
        }
      });
    });
  } else {
    resultsDiv.innerHTML = '<p>No books found. Try a different search.</p>';
  }
}

// Open modal with book preview details
function openModal(bookTitle, previewLink) {
  console.log("Opening modal for:", bookTitle, previewLink); // Debugging log
  modalTitle.textContent = bookTitle;
  modalDescription.textContent = 'Click the link below to view more details:';

  // Display the link in the modal (without opening the preview link inside the modal itself)
  modalLink.href = previewLink;
  modalLink.textContent = 'Go to Preview';

  // Show the modal with the preview link
  if (previewLink) {
    modalLink.style.display = 'block'; // Ensure preview link is shown
  } else {
    modalLink.style.display = 'none'; // Hide if no link
  }

  bookModal.style.display = 'block'; // Show the modal
}

// Close modal
modalClose.addEventListener('click', () => {
  bookModal.style.display = 'none'; // Hide modal when close button is clicked
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
  if (e.target === bookModal) {
    bookModal.style.display = 'none';
  }
});

// Event listener for search form
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    await searchBooks(query);
  }
});

// Logout functionality
logoutButton.addEventListener('click', function() {
  alert("Logged out!");
  window.location.href = "index.html"; // Redirecting to the index page or wherever you want
});
