document.addEventListener('DOMContentLoaded', function() {
  // Extension icon clicked
  chrome.windows.getCurrent(
      {populate: true},
      (w) => {
        chrome.windows.update(
            // 720p = 1280*720
            w.id, {height: 1280, width: 2048},
            () => {

            });
      },
  );
});
