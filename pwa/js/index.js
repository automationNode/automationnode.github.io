if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('./service-worker.js', {scope: './'}).then(function(registration) {
      console.log('Service worker registration succeeded:', registration);
    }, /*catch*/ function(error) {
      console.log('Service worker registration failed:', error);
    });
  } else {
    console.log('Service workers are not supported.');
  }
  
  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

// buttonInstall.addEventListener('click', async () => {
//   // Hide the app provided install promotion
//   hideInstallPromotion();
//   // Show the install prompt
//   deferredPrompt.prompt();
//   // Wait for the user to respond to the prompt
//   const { outcome } = await deferredPrompt.userChoice;
//   // Optionally, send analytics event with outcome of user choice
//   console.log(`User response to the install prompt: ${outcome}`);
//   // We've used the prompt, and can't use it again, throw it away
//   deferredPrompt = null;
// });

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});

function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}

getPWADisplayMode()

window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});