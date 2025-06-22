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
const copyMessage = document.getElementById('copy-message'); // New: Copy message element


let apiQuotes = [];
let loadStartTime;

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
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  if (!quote.author) {
    authorText.textContent = 'Unknown';
  } else {
    authorText.textContent = quote.author;
  }

  // Check quote length to change font size
  if (quote.text.length > 120) {
    quoteText.classList.add('long-quote');
  } else {
    quoteText.classList.remove('long-quote');
  }
  
  quoteText.textContent = quote.text;
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

// New: Share on WhatsApp
function shareWhatsapp() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${quote} - ${author}`)}`;
    window.open(whatsappUrl, '_blank');
}

// New: Share on LinkedIn
function shareLinkedIn() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const pageUrl = window.location.href; 
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent('Inspirational Quote')}&summary=${encodeURIComponent(`${quote} - ${author}`)}&source=${encodeURIComponent('Quote Generator App')}`;
    window.open(linkedInUrl, '_blank');
}

// New: Copy Quote to Clipboard
function copyQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const fullQuote = `${quote} - ${author}`;

    navigator.clipboard.writeText(fullQuote).then(() => {
        // Show "Copied!" message
        copyMessage.textContent = 'Copied!';
        copyMessage.classList.add('show');
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000); // Hide after 2 seconds
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
    window.open('https://github.com/Dhruvdesai407/Quote-generator', '_blank');
}

function changeFont(event) {
    const selectedFont = event.target.value;
    document.body.style.fontFamily = `'${selectedFont}', sans-serif`;
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuotes);
twitterBtn.addEventListener('click', tweetQuote);
whatsappBtn.addEventListener('click', shareWhatsapp); // New
linkedinBtn.addEventListener('click', shareLinkedIn); // New
copyBtn.addEventListener('click', copyQuote); // New
githubBtn.addEventListener('click', goToGitHub);
fontSelect.addEventListener('change', changeFont);

// On initial load, fetch quotes
getQuotes();
