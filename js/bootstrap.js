  const slides = document.querySelectorAll('#slides img');
  let current = 0;
  const total = slides.length;

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

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
  setInterval(() => {
    current = (current + 1) % total;
    showSlide(current);
  }, 6000);

  showSlide(current);