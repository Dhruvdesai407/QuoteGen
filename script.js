const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const whatsappBtn = document.getElementById('whatsapp');
const linkedinBtn = document.getElementById('linkedin');
const copyBtn = document.getElementById('copy');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const githubBtn = document.getElementById('github');
const fontSelect = document.getElementById('font-select');
const categorySelect = document.getElementById('category-select');
const copyMessage = document.getElementById('copy-message');


let apiQuotes = [];
let filteredQuotes = [];
let loadStartTime;

const availableCategories = [
    "All",
    "attitude",
    "beauty",
    "general",
    "medical",
    "men",
    "motivational",
    "movies",
    "patriotism",
    "peace"
];


function loading() {
  loader.hidden = false;
  quoteContainer.classList.remove('visible');
  loadStartTime = Date.now();
}

function complete() {
  quoteContainer.classList.add('visible');
  loader.hidden = true;
}

function displayQuoteContent() {
  if (filteredQuotes.length === 0) {
      quoteText.textContent = 'No quotes found for this category.';
      authorText.textContent = 'Please try another category.';
      quoteContainer.classList.add('visible');
      return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

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
  quoteContainer.classList.add('visible');
}

function transitionQuoteDisplay() {
  loading();
  setTimeout(() => {
    displayQuoteContent();
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
    
    filteredQuotes = [...apiQuotes]; 

    const actualLoadTime = Date.now() - loadStartTime;
    const minimumLoaderDuration = 1500;
    const remainingDelay = Math.max(0, minimumLoaderDuration - actualLoadTime);

    setTimeout(() => {
        displayQuoteContent();
        complete();
    }, remainingDelay);

  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    quoteText.textContent = 'An error occurred while loading quotes. Please try again later.';
    authorText.textContent = 'System';
    complete();
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)} - ${encodeURIComponent(author)}`;
  window.open(twitterUrl, '_blank');
}

function shareWhatsapp() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${quote} - ${author}`)}`;
    window.open(whatsappUrl, '_blank');
}

function shareLinkedIn() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const pageUrl = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent('Inspirational Quote')}&summary=${encodeURIComponent(`${quote} - ${author}`)}&source=${encodeURIComponent('Quote Generator App')}`;
    window.open(linkedInUrl, '_blank');
}

function copyQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const fullQuote = `${quote} - ${author}`;

    navigator.clipboard.writeText(fullQuote).then(() => {
        copyMessage.textContent = 'Copied!';
        copyMessage.classList.add('show');
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        copyMessage.textContent = 'Failed to copy!';
        copyMessage.classList.add('show');
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
    });
}


function goToGitHub() {
    window.open('https://github.com/Dhruvdesai407/QuoteGen', '_blank'); 
}

function changeFont(event) {
    const selectedFont = event.target.value;
    document.body.style.fontFamily = `'${selectedFont}', sans-serif`;
}

function filterQuotesByCategory(event) {
    const selectedCategory = event.target.value;

    if (selectedCategory === "All") {
        filteredQuotes = [...apiQuotes];
    } else {
        filteredQuotes = apiQuotes.filter(quote => {
            return typeof quote.tag === 'string' && quote.tag.length > 0 && quote.tag.toLowerCase() === selectedCategory.toLowerCase();
        });
    }
    transitionQuoteDisplay();
}

function populateCategoryDropdown() {
    availableCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
}


newQuoteBtn.addEventListener('click', transitionQuoteDisplay);
twitterBtn.addEventListener('click', tweetQuote);
whatsappBtn.addEventListener('click', shareWhatsapp);
linkedinBtn.addEventListener('click', shareLinkedIn);
copyBtn.addEventListener('click', copyQuote);
githubBtn.addEventListener('click', goToGitHub);
fontSelect.addEventListener('change', changeFont);
categorySelect.addEventListener('change', filterQuotesByCategory);

getQuotes();
populateCategoryDropdown();
