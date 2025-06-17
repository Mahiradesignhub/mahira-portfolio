document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // Global Variables & Constants
  // ===============================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const submenuParents = document.querySelectorAll('.has-submenu > a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const navbar = document.querySelector('.navbar');
  const stickyClass = 'navbar-sticky';
  const scrollThreshold = 80;
  const submenuStateKey = 'submenuState';

  let lastScrollY = window.scrollY;
  let ticking = false;

  const isMobile = () => window.innerWidth <= 991;

  // ===============================
  // Navigation Menu Functions
  // ===============================
  function openMenu() {
    navMenu.classList.add('nav-menu-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navMenu.classList.remove('nav-menu-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open', 'submenu-open');
    closeAllMobileSubmenus();
  }

  function closeAllMobileSubmenus() {
    document.querySelectorAll('.submenu-active').forEach(sub => sub.classList.remove('submenu-active'));
    document.querySelectorAll('.has-submenu > a.rotate-arrow').forEach(a => a.classList.remove('rotate-arrow'));
    document.body.classList.remove('submenu-open');
  }

  navToggle?.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  submenuParents.forEach(link => {
    link.addEventListener('click', e => {
      if (isMobile()) {
        e.preventDefault();
        const submenu = link.nextElementSibling;
        const isOpen = submenu.classList.contains('submenu-active');
        closeAllMobileSubmenus();
        if (!isOpen) {
          submenu.classList.add('submenu-active');
          link.classList.add('rotate-arrow');
          document.body.classList.add('submenu-open');
        }
      }
    });
  });

  submenuParents.forEach(link => {
    const submenu = link.nextElementSibling;
    submenu.querySelectorAll('a').forEach(subLink => {
      subLink.addEventListener('click', () => closeMenu());
    });
  });

  document.addEventListener('click', e => {
    if (isMobile()) {
      const clickedInside = e.target.closest('#nav-toggle') || e.target.closest('#nav-menu') || e.target.closest('.has-submenu > a') || e.target.closest('.submenu');
      if (!clickedInside) {
        document.querySelector('.submenu-active') ? closeAllMobileSubmenus() : closeMenu();
      }
    }
  });

  navMenu?.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (isMobile() && link && !link.parentElement.classList.contains('has-submenu')) {
      closeMenu();
    }
  });

  // ===============================
  // Desktop Submenu Toggle with Keyboard Support
  // ===============================
  const toggleSubmenu = (link, submenu, forceClose = false) => {
    if (!isMobile()) {
      const isOpen = submenu.classList.contains('submenu-active');
      submenu.classList.toggle('submenu-active', forceClose ? false : !isOpen);
      link.classList.toggle('rotate-arrow', forceClose ? false : !isOpen);
      link.setAttribute('aria-expanded', String(forceClose ? false : !isOpen));
      saveSubmenuState();
    }
  };

  submenuParents.forEach((link, index) => {
    const submenu = link.nextElementSibling;
    const id = `menu-${index + 1}`;
    link.parentElement.dataset.menuId = id;

    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('role', 'menu');
    submenu.querySelectorAll('a').forEach(item => item.setAttribute('role', 'menuitem'));

    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      link.addEventListener(eventType, e => {
        if (isMobile()) return;
        if (eventType === 'keydown' && !(e.key === 'Enter' || e.key === ' ')) return;
        if (eventType === 'touchstart') e.preventDefault();
        toggleSubmenu(link, submenu);
      });
    });

    link.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && !isMobile()) {
        e.preventDefault();
        submenu.querySelector('a')?.focus();
      }
    });

    submenu.addEventListener('keydown', e => {
      const items = Array.from(submenu.querySelectorAll('a'));
      const index = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(index + 1) % items.length].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        toggleSubmenu(link, submenu, true);
        link.focus();
      }
    });
  });

  function saveSubmenuState() {
    if (isMobile()) return;
    const state = {};
    submenuParents.forEach(link => {
      const id = link.parentElement.dataset.menuId;
      state[id] = link.classList.contains('rotate-arrow');
    });
    localStorage.setItem(submenuStateKey, JSON.stringify(state));
  }

  function loadSubmenuState() {
    if (isMobile()) return;
    const state = JSON.parse(localStorage.getItem(submenuStateKey) || '{}');
    submenuParents.forEach(link => {
      const id = link.parentElement.dataset.menuId;
      if (state[id]) {
        link.nextElementSibling.classList.add('submenu-active');
        link.classList.add('rotate-arrow');
        link.setAttribute('aria-expanded', 'true');
      }
    });
  }
  loadSubmenuState();

  document.addEventListener('click', e => {
    if (!isMobile() && !e.target.closest('.has-submenu')) {
      submenuParents.forEach(link => toggleSubmenu(link, link.nextElementSibling, true));
    }
  });

  // ===============================
  // Scroll to Top Button
  // ===============================
  if (scrollTopBtn) {
    const toggleScrollTopBtn = () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      toggleScrollTopBtn();
    });
    toggleScrollTopBtn();
  }

  // ===============================
  // Smooth Sticky Navbar
  // ===============================
  function updateStickyNavbar() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      navbar?.classList.add(stickyClass);
      navbar.style.transform = currentScroll > lastScrollY ? 'translateY(-100%)' : 'translateY(0)';
      navbar.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    } else {
      navbar?.classList.remove(stickyClass);
      navbar.style.transform = '';
      navbar.style.transition = '';
    }
    lastScrollY = currentScroll;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  updateStickyNavbar();

  // ===============================
  // Handle Resize
  // ===============================
  window.addEventListener('resize', () => {
    closeAllMobileSubmenus();
    submenuParents.forEach(link => link.setAttribute('aria-expanded', 'false'));
    saveSubmenuState();
    document.body.classList.remove('menu-open', 'submenu-open');
  });

  // ===============================
  // Fade-In Sections on Scroll
  // ===============================
  const sections = document.querySelectorAll('.section-container, .hero-section');
  const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInOnScroll.observe(section);
  });

  // ===============================
  // Accessibility: Focus Indicator
  // ===============================
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
});
