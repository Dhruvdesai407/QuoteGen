const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const githubBtn = document.getElementById('github');

let apiQuotes = [];

function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function complete() {
  quoteContainer.hidden = false;
  loader.hidden = true;
}

function newQuote() {
  loading();
  
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  if (!quote.author) {
    authorText.textContent = 'Unknown';
  } else {
    authorText.textContent = quote.author;
  }

  if (quote.text.length > 120) {
    quoteText.classList.add('long-quote');
  } else {
    quoteText.classList.remove('long-quote');
  }
  
  quoteText.textContent = quote.text;
  
  setTimeout(() => {
    complete();
  }, 1500);
}

async function getQuotes() {
  loading(); 
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    quoteText.textContent = 'An error occurred while loading quotes. Please try again later.';
    authorText.textContent = 'System';
    complete();
  }
}

function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${authorText.innerText}`;
  window.open(twitterUrl, '_blank');
}

function goToGitHub() {
    window.open('https://github.com/Dhruvdesai407/Quote-generator', '_blank');
}

newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);
githubBtn.addEventListener('click', goToGitHub);

getQuotes();