// Setup Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};

// Preload sounds into memory (Raw Audio Data)
async function loadSound(key, url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const decodedData = await audioCtx.decodeAudioData(arrayBuffer);
    soundBuffers[key] = decodedData;
  } catch (err) {
    console.error(`Failed to load sound for key: ${key}`, err);
  }
}

// Map keys to file paths
const soundFiles = {
  w: "./tom-1.mp3",
  a: "./tom-2.mp3",
  s: "./tom-3.mp3",
  d: "./tom-4.mp3",
  j: "./snare.mp3",
  k: "./crash.mp3",
  l: "./kick-bass.mp3"
};

// Start loading all sounds immediately
Object.entries(soundFiles).forEach(([key, url]) => loadSound(key, url));

// Optimized Playback Function
function makeSound(key) {
  // Browsers block audio until a user clicks something. This "wakes it up".
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const buffer = soundBuffers[key];

  if (buffer) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0); // Trigger instantly
  }
}

// Event Listeners
const drumButtons = document.querySelectorAll(".drum");

drumButtons.forEach(button => {
  button.addEventListener("click", function() {
    const buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  });
});

document.addEventListener("keydown", function(event) {
  const key = event.key.toLowerCase();
  if (soundFiles[key]) {
    makeSound(key);
    buttonAnimation(key);
  }
});

// Animation Function
function buttonAnimation(currentKey) {
  const activeButton = document.querySelector("." + currentKey);
  
  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(() => {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}
