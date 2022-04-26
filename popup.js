document.addEventListener('DOMContentLoaded', function() {
  // Extension icon clicked
  chrome.windows.getCurrent(
      {populate: true},
      (w) => {
        chrome.windows.update(
            w.id, {height: 768, width: 1024},
            () => {

            });
      },
  );
});
