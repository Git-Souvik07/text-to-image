// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const sunIcon = themeToggle.querySelector('.fa-sun');
const moonIcon = themeToggle.querySelector('.fa-moon');

function setTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  sunIcon.classList.toggle('hidden', isDark);
  moonIcon.classList.toggle('hidden', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// User Menu Dropdown
const userMenuButton = document.getElementById('user-menu-button');
const userDropdown = document.getElementById('user-dropdown');

userMenuButton.addEventListener('click', (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle('active');
});

document.addEventListener('click', () => {
  userDropdown.classList.remove('active');
});

// Prompt Character Counter
const promptInput = document.getElementById('prompt-input');
const charCount = document.getElementById('char-count');

promptInput.addEventListener('input', () => {
  charCount.textContent = promptInput.value.length;
});

// Example Prompts
const examplePrompts = document.querySelectorAll('.example-prompt');
examplePrompts.forEach(prompt => {
  prompt.addEventListener('click', () => {
    promptInput.value = prompt.textContent;
    charCount.textContent = promptInput.value.length;
    promptInput.focus();
  });
});

// Style Buttons
const styleButtons = document.querySelectorAll('.style-btn');
styleButtons.forEach(button => {
  button.addEventListener('click', () => {
    styleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

// Generation Form
const generationForm = document.getElementById('generation-form');
generationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Show loading state
  const masonryGrid = document.querySelector('.masonry-grid');
  const loadingCard = document.createElement('article');
  loadingCard.className = 'creation-card loading';
  loadingCard.innerHTML = `
    <div class="generation-status">
      <div class="loader"></div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
    </div>
  `;
  masonryGrid.insertBefore(loadingCard, masonryGrid.firstChild);
  
  // Simulate progress
  const progressFill = loadingCard.querySelector('.progress-fill');
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 5;
    progressFill.style.width = `${Math.min(progress, 90)}%`;
  }, 200);
  
  // Simulate API call (replace with actual API integration)
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create result card
    const resultCard = document.createElement('article');
    resultCard.className = 'creation-card';
    resultCard.innerHTML = `
      <img src="https://source.unsplash.com/random/800x600" alt="Generated image" loading="lazy">
      <div class="card-overlay">
        <p class="prompt-preview">${promptInput.value}</p>
        <div class="card-actions">
          <button class="action-btn favorite-btn">
            <i class="far fa-heart"></i>
          </button>
          <button class="action-btn download-btn">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="action-btn share-btn">
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
    `;
    
    // Replace loading card with result
    masonryGrid.replaceChild(resultCard, loadingCard);
  } catch (error) {
    console.error('Generation failed:', error);
    loadingCard.innerHTML = `
      <div class="generation-status">
        <p>Generation failed. Please try again.</p>
      </div>
    `;
  } finally {
    clearInterval(progressInterval);
  }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to generate
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    generationForm.dispatchEvent(new Event('submit'));
  }
});

// Voice Input
const micButton = document.querySelector('.mic-btn');
let isRecording = false;

micButton.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        promptInput.value = transcript;
        charCount.textContent = transcript.length;
      };
      
      recognition.onend = () => {
        isRecording = false;
        micButton.querySelector('i').classList.remove('fa-stop');
        micButton.querySelector('i').classList.add('fa-microphone');
      };
      
      recognition.start();
      isRecording = true;
      micButton.querySelector('i').classList.remove('fa-microphone');
      micButton.querySelector('i').classList.add('fa-stop');
    } catch (error) {
      console.error('Speech recognition failed:', error);
      alert('Speech recognition is not supported in your browser.');
    }
  } else {
    isRecording = false;
    micButton.querySelector('i').classList.remove('fa-stop');
    micButton.querySelector('i').classList.add('fa-microphone');
  }
});

// Random Prompt Generator
const randomPrompts = [
  "A cyberpunk city at sunset with flying cars and neon signs",
  "A magical forest with glowing mushrooms and fairy lights",
  "An underwater city with bioluminescent buildings",
  "A steampunk airship floating through clouds at golden hour",
  "A crystal palace on a floating island in the sky",
  "A futuristic space station orbiting a purple gas giant"
];

const randomizeButton = document.querySelector('.randomize-btn');
randomizeButton.addEventListener('click', () => {
  const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
  promptInput.value = randomPrompt;
  charCount.textContent = randomPrompt.length;
  promptInput.focus();
});