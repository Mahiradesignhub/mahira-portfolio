document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.portfolioSwiper', {
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
        initializeSlides();
        animateActiveSlide(this);
      },
      slideChangeTransitionStart() {
        resetAllSlideVideos(this);
      },
      slideChangeTransitionEnd() {
        animateActiveSlide(this);
      }
    }
  });

  function initializeSlides() {
    document.querySelectorAll('.swiper-slide').forEach(slide => {
      if (!slide.querySelector('.media-wrapper')) {
        const media = slide.querySelector('img, video, iframe');
        if (media) {
          const mediaWrapper = document.createElement('div');
          mediaWrapper.classList.add('media-wrapper');

          const overlay = document.createElement('div');
          overlay.classList.add('overlay-content');

          const heading = slide.querySelector('.portfolio-heading');
          const caption = slide.querySelector('.caption');
          if (heading) overlay.appendChild(heading);
          if (caption) overlay.appendChild(caption);

          mediaWrapper.appendChild(media);
          mediaWrapper.appendChild(overlay);
          slide.insertBefore(mediaWrapper, slide.firstChild);
        }
      }
    });
  }

  function resetAllSlideVideos(swiperInstance) {
    swiperInstance.slides.forEach(slide => {
      const video = slide.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function animateActiveSlide(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const media = activeSlide.querySelector('img, video, iframe');

    if (media) {
      media.style.animation = 'none'; // Reset animation
      void media.offsetWidth;         // Trigger reflow
      media.style.animation = 'zoomInBoom 0.8s ease forwards'; // Restart animation
    }

    const video = activeSlide.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {}); // Avoids unhandled promise rejections
    }
  }

  window.addEventListener('resize', () => {
    animateActiveSlide(swiper);
  });
});
