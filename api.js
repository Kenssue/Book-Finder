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
  if (books && books.length > 0) {
    books.forEach(book => {
      const bookInfo = book.volumeInfo;
      const bookElement = document.createElement('div');
      bookElement.classList.add('book');
      bookElement.innerHTML = `
        <h3>${bookInfo.title}</h3>
        <p><strong>Author(s):</strong> ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
        <p><strong>Publisher:</strong> ${bookInfo.publisher || 'Unknown'}</p>
        <p><strong>Published Date:</strong> ${bookInfo.publishedDate || 'Unknown'}</p>
        <p><strong>Description:</strong> ${bookInfo.description || 'No description available.'}</p>
        <a href="${bookInfo.previewLink}" target="_blank">Preview</a>
      `;
      resultsDiv.appendChild(bookElement);
    });
  } else {
    resultsDiv.innerHTML = '<p>No books found. Try a different search.</p>';
  }
}