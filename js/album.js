document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const totalImages = 100;

  const albums = document.querySelectorAll(".slides");

  albums.forEach((slidesContainer) => {
    const folder = slidesContainer.dataset.folder;
    const id = slidesContainer.id;
    const images = [];

    let loadedImages = 0;

    for (let i = 1; i <= totalImages; i++) {
      const img = new Image();
      img.src = `../images/wedding_design/${folder}/${i}.jpg`;
      img.alt = `Wedding Photo ${i}`;

      img.onload = () => {
        img.classList.add("slider-img");
        img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain"; // ✅ Fully fit image, maintain aspect ratio, no crop
        img.style.transition = "opacity 0.6s ease-in-out";
        img.style.opacity = "0";
        img.style.zIndex = "0";

        slidesContainer.appendChild(img);
        images.push(img);

        // Click-to-zoom for modal
        img.addEventListener("click", () => {
          modalImg.src = img.src;
          modal.classList.add("show");

          // ✅ Fit modal image perfectly
          modalImg.style.maxWidth = "90vw";
          modalImg.style.maxHeight = "90vh";
          modalImg.style.objectFit = "contain";
        });

        if (images.length === 1) updateSlide();
      };

      img.onerror = () => {
        loadedImages++;
        if (loadedImages === totalImages && images.length === 0) {
          const section = slidesContainer.closest("section");
          if (section) section.style.display = "none"; // Hide empty section if no images
        }
      };
    }

    let current = 0;

    const updateSlide = () => {
      images.forEach((img, i) => {
        img.style.opacity = i === current ? "1" : "0";
        img.style.zIndex = i === current ? "5" : "0";
      });
    };

    const container = slidesContainer.parentElement;
    const prevBtn = container.querySelector(`.prev[data-target="${id}"]`);
    const nextBtn = container.querySelector(`.next[data-target="${id}"]`);

    prevBtn?.addEventListener("click", () => {
      current = (current - 1 + images.length) % images.length;
      updateSlide();
    });

    nextBtn?.addEventListener("click", () => {
      current = (current + 1) % images.length;
      updateSlide();
    });

    setInterval(() => {
      if (images.length > 1) {
        current = (current + 1) % images.length;
        updateSlide();
      }
    }, 6000);
  });

  modal.addEventListener("click", () => {
    modal.classList.remove("show");
    modalImg.src = "";
  });
});
