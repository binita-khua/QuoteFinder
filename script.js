document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const searchResults = document.getElementById('searchResults');
    let pinnedQuotes = [];
  
    // Load a random quote
    fetchRandomQuote();
  
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) {
        alert('Please enter an author name');
        return;
      }
      quoteDisplay.style.display = 'none'; // Hide the random quote
      await fetchQuotesByAuthor(searchTerm);
    });
  
    async function fetchRandomQuote() {
      try {
        const response = await fetch('https://usu-quotes-mimic.vercel.app/api/random');
        const data = await response.json();
        displayQuote(data, quoteDisplay);
      } catch (error) {
        console.error('Error fetching random quote:', error);
      }
    }
  
    async function fetchQuotesByAuthor(author) {
      try {
        const response = await fetch(`https://usu-quotes-mimic.vercel.app/api/search?query=${author}`);
        const data = await response.json();
        displayQuotes(data.results, searchResults);
      } catch (error) {
        console.error('Error fetching quotes by author:', error);
      }
    }
  
    function displayQuote(quoteData, container) {
      container.innerHTML = `<div class="quote" data-id="${quoteData._id}">${quoteData.content} - ${quoteData.author}</div>`;
      container.style.display = 'block'; // Show the quote
    }
  
    function displayQuotes(quotes, container) {
      container.innerHTML = ''; // Clear previous quotes
      quotes.forEach(q => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.setAttribute('data-id', q._id);
        quoteDiv.innerHTML = `${q.content} - ${q.author}`;
        container.appendChild(quoteDiv);
      });
      addQuoteClickHandlers();
      updatePinnedQuotes(); // Refresh pinned quotes at the top
    }
  
    function addQuoteClickHandlers() {
      document.querySelectorAll('.quote').forEach(quote => {
        quote.addEventListener('click', function() {
          const quoteId = this.getAttribute('data-id');
          togglePinQuote(quoteId, this);
        });
      });
    }
  
    function togglePinQuote(quoteId, quoteElement) {
      const isPinned = pinnedQuotes.some(q => q._id === quoteId);
      if (isPinned) {
        pinnedQuotes = pinnedQuotes.filter(q => q._id !== quoteId);
      } else {
        if (!pinnedQuotes.find(q => q._id === quoteId)) {
          pinnedQuotes.push({ _id: quoteId, content: quoteElement.innerHTML });
        }
      }
      updatePinnedQuotes();
    }
  
    function updatePinnedQuotes() {
      const pinnedContainer = document.createElement('div');
      pinnedContainer.setAttribute('id', 'pinnedQuotes');
      pinnedQuotes.forEach(q => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote pinned';
        quoteDiv.setAttribute('data-id', q._id);
        quoteDiv.innerHTML = q.content;
        quoteDiv.addEventListener('click', function() {
          togglePinQuote(q._id, this);
        });
        pinnedContainer.appendChild(quoteDiv);
      });
      const existingPinnedContainer = document.getElementById('pinnedQuotes');
      if (existingPinnedContainer) {
        searchResults.replaceChild(pinnedContainer, existingPinnedContainer);
      } else {
        searchResults.insertBefore(pinnedContainer, searchResults.firstChild);
      }
    }
  });
  