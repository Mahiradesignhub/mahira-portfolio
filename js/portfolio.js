document.addEventListener('DOMContentLoaded', () => {
  // Image zoom overlay functionality

  // Create overlay elements dynamically
  const overlay = document.createElement('div');
  overlay.classList.add('image-overlay');
  overlay.id = 'imageOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image preview');

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.id = 'closeOverlay';
  closeBtn.setAttribute('aria-label', 'Close image preview');
  closeBtn.innerHTML = '&times;';

  const overlayImage = document.createElement('img');
  overlayImage.id = 'overlayImage';
  overlayImage.alt = 'Zoomed image';

  overlay.appendChild(closeBtn);
  overlay.appendChild(overlayImage);
  document.body.appendChild(overlay);

  let panzoomInstance;

  // Load Panzoom library dynamically if not already loaded
  function loadPanzoom(callback) {
    if (window.Panzoom) {
      callback();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@panzoom/panzoom@9.4.0/dist/panzoom.min.js';
      script.onload = callback;
      document.head.appendChild(script);
    }
  }

  // Attach event listener to all .image-grid elements
  document.querySelectorAll('.image-grid').forEach(grid => {
    grid.addEventListener('click', e => {
      if (e.target.tagName === 'IMG' && e.target.closest('.image-card')) {
        const src = e.target.src;
        overlayImage.src = src;
        overlay.classList.add('active');

        loadPanzoom(() => {
          if (panzoomInstance) panzoomInstance.destroy();
          panzoomInstance = Panzoom(overlayImage, {
            maxScale: 5,
            contain: 'outside',
            cursor: 'grab'
          });
          overlayImage.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);
        });
      }
    });
  });

  // Close overlay on close button click
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    overlayImage.src = '';
    if (panzoomInstance) panzoomInstance.destroy();
  });

  // Close overlay on clicking outside the image
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeBtn.click();
  });

  // Close overlay on pressing Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeBtn.click();
    }
  });
});
