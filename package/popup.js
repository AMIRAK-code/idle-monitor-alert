document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggleBtn');
  const minutesInput = document.getElementById('timeout');
  const soundInput = document.getElementById('soundToggle');

  // Load saved settings
  chrome.storage.local.get(['isEnabled', 'minutes', 'soundEnabled'], (data) => {
    if (data.isEnabled) {
      btn.textContent = 'Stop Monitoring';
      btn.classList.add('stop');
    }
    if (data.minutes) minutesInput.value = data.minutes;
    if (data.soundEnabled) soundInput.checked = data.soundEnabled;
  });

  btn.addEventListener('click', () => {
    chrome.storage.local.get('isEnabled', (data) => {
      const newState = !data.isEnabled;
      const minutes = parseInt(minutesInput.value) || 5;
      const soundEnabled = soundInput.checked;

      // Save all states
      chrome.storage.local.set({ 
        isEnabled: newState, 
        minutes: minutes,
        soundEnabled: soundEnabled 
      });

      // Update UI
      btn.textContent = newState ? 'Stop Monitoring' : 'Start Monitoring';
      btn.classList.toggle('stop', newState);

      // Reload tab to apply changes immediately
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});