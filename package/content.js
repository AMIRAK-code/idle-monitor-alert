// Global AudioContext variable
let audioCtx = null;

// 1. Function to "Unlock" Audio on first user interaction
const unlockAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // If it was created but suspended, resume it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  // Clean up: We only need to do this once
  ['click', 'keydown'].forEach(event => {
    document.removeEventListener(event, unlockAudio);
  });
};

// Listen for the first real interaction to unlock audio
['click', 'keydown'].forEach(event => {
  document.addEventListener(event, unlockAudio);
});

chrome.storage.local.get(['isEnabled', 'minutes', 'soundEnabled'], (data) => {
  if (!data.isEnabled) return;

  const TIMEOUT_MS = (data.minutes || 5) * 60 * 1000;
  let idleTimer;

  // 2. Updated Play Function (Uses the unlocked context)
  const playChime = () => {
    // If user never interacted, we can't play sound (Browser Policy).
    // But if they were working, audioCtx should be ready.
    if (!audioCtx || data.soundEnabled === false) return;

    try {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Sound Design: C5 to A5 slide
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

      // Volume Envelope
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const triggerAlert = () => {
    if (document.getElementById('back-to-work-host')) return;

    // Play sound if enabled
    if (data.soundEnabled) {
      playChime();
    }

    const host = document.createElement('div');
    host.id = 'back-to-work-host';
    host.style.position = 'fixed';
    host.style.zIndex = '2147483647';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '100vw';
    host.style.height = '100vh';
    host.style.pointerEvents = 'auto';

    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .overlay {
          display: flex; justify-content: center; align-items: center;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px);
          animation: fadeIn 0.5s ease;
        }
        .msg-box {
          background: #ff4757; color: white; padding: 40px;
          border-radius: 12px; font-family: sans-serif; text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transform: scale(0.8);
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        h1 { margin: 0 0 10px 0; font-size: 3rem; text-transform: uppercase; }
        p { font-size: 1.2rem; margin-bottom: 20px; }
        button {
          padding: 10px 20px; font-size: 1rem;
          border: none; background: white; color: #ff4757;
          font-weight: bold; cursor: pointer; border-radius: 5px;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popUp { to { transform: scale(1); } }
      </style>
      <div class="overlay">
        <div class="msg-box">
          <h1>COME BACK TO WORK</h1>
          <p>You have been idle for ${data.minutes} minute(s).</p>
          <button id="dismiss">I'm back!</button>
        </div>
      </div>
    `;

    shadow.getElementById('dismiss').addEventListener('click', () => {
      host.remove();
      resetTimer();
    });
  };

  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerAlert, TIMEOUT_MS);
  };

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
    window.addEventListener(event, resetTimer);
  });

  resetTimer();
});