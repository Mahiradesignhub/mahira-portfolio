document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('#slides img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
  
    // Check if elements exist before proceeding
    if (!slides.length || !prevBtn || !nextBtn) {
      console.warn('Required elements for slider not found. Make sure #slides, #prev, and #next exist.');
      return;
    }
  
    let current = 0;
    const total = slides.length;
  
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
  
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + total) % total;
      showSlide(current);
    });
  
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % total;
      showSlide(current);
    });
  
    // Auto slide every 6 sec
    const autoSlideInterval = setInterval(() => {
      current = (current + 1) % total;
      showSlide(current);
    }, 6000);
  
    // Clear interval when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(autoSlideInterval);
      }
    });
  
    showSlide(current);
  });
