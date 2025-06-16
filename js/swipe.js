document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.portfolioSwiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
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
        playActiveSlideMedia(this);
      },
      slideChangeTransitionStart() {
        resetAllSlideMedia(this);
      },
      slideChangeTransitionEnd() {
        playActiveSlideMedia(this);
      }
    }
  });

  function resetAllSlideMedia(swiperInstance) {
    swiperInstance.slides.forEach(slide => {
      const video = slide.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    document.querySelectorAll('.caption').forEach(caption => caption.classList.remove('show'));
  }

  function playActiveSlideMedia(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const video = activeSlide.querySelector('video');
    const caption = activeSlide.querySelector('.caption');

    if (video) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {});
    }

    if (caption) {
      caption.classList.add('show');
    }
  }
});
