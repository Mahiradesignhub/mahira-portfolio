document.addEventListener('DOMContentLoaded', () => {
  /* =============================
       Initialize Services Swiper
  ============================== */
  const servicesSwiper = new Swiper('.servicesSwiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.services-pagination',
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  /* =============================
       Initialize Portfolio Swiper
  ============================== */
  const portfolioSwiper = new Swiper('.portfolioSwiper', {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    speed: 900,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      init() {
        animateActiveSlide(this);
      },
      slideChangeTransitionStart() {
        resetAllSlideVideos(this);
      },
      slideChangeTransitionEnd() {
        animateActiveSlide(this);
      },
    },
  });

  /* =============================
       Utility Functions
  ============================== */

  // Pause and reset all videos except active slide
  function resetAllSlideVideos(swiperInstance) {
    swiperInstance.slides.forEach((slide) => {
      const video = slide.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  // Play video on active slide if present
  function animateActiveSlide(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;

    const video = activeSlide.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {
        // Autoplay might be blocked; ignore errors
      });
    }
  }

  // Re-animate active slide on window resize for proper layout
  window.addEventListener('resize', () => {
    animateActiveSlide(portfolioSwiper);
  });

  /* =============================
       Image Zoom Modal (Portfolio)
  ============================== */
  const modal = document.getElementById('imageModal');
  const modalImg = modal?.querySelector('img');

  if (modal && modalImg) {
    document.querySelectorAll('.portfolioSwiper img').forEach((img) => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('show');
      });
    });

    modal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
});
