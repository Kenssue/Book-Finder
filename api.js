// Logout function
function logout() {
  // Perform logout actions, e.g., clear session, redirect, etc.
  console.log("User logged out");
  window.location.href = "index.html"; // Redirect to the login page
}

// Add event listener to the logout button
document.getElementById("logoutButton").addEventListener("click", logout);

// Existing code for book search
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    await searchBooks(query);
  }
});

async function searchBooks(query) {
  const apiKey = 'AIzaSyBVvOjbDoIzmEeK2uSfzSM8eoBfNKc6YHI'; // Replace with your API key
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.items);
  } catch (error) {
    console.error('Error fetching books:', error);
    resultsDiv.innerHTML = '<p>Error fetching books. Please try again.</p>';
  }
}

function displayResults(books) {
  resultsDiv.innerHTML = '';

  if (!books || books.length === 0) {
    resultsDiv.innerHTML = '<p>No books found. Try a different search term.</p>';
    return;
  }

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <h3>${book.volumeInfo.title}</h3>
      <p><strong>Author(s):</strong> ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
      <p><strong>Published Date:</strong> ${book.volumeInfo.publishedDate || 'Unknown'}</p>
      <p><strong>Description:</strong> ${book.volumeInfo.description?.substring(0, 150) || 'No description available'}...</p>
      <a href="${book.volumeInfo.previewLink}" target="_blank">Read More</a>
    `;
    resultsDiv.appendChild(bookCard);
  });
}
