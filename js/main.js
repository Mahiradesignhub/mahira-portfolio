document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const submenuParents = document.querySelectorAll('.has-submenu > a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const navbar = document.querySelector('.navbar');
  const stickyClass = 'navbar-sticky';
  const scrollThreshold = 80;
  const submenuStateKey = 'submenuState';

  const isMobile = () => window.innerWidth <= 991;

  // ================================
  // Toggle Main Menu (Mobile)
  // ================================
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('nav-menu-active');
  });

  // ================================
  // Mobile: Toggle Submenus
  // ================================
  submenuParents.forEach(link => {
    link.addEventListener('click', e => {
      if (isMobile()) {
        e.preventDefault();
        const submenu = link.nextElementSibling;
        const isOpen = submenu.classList.contains('submenu-active');
        closeAllSubmenus(); // Pehle saare band karo
        if (!isOpen) {
          submenu.classList.add('submenu-active');
          link.classList.add('rotate-arrow');
        }
      }
    });
  });

  function closeAllSubmenus() {
    document.querySelectorAll('.submenu-active').forEach(sub => sub.classList.remove('submenu-active'));
    document.querySelectorAll('.has-submenu > a.rotate-arrow').forEach(a => a.classList.remove('rotate-arrow'));
  }

  // ================================
  // Close Submenu or Menu on Outside Click (Mobile)
  // ================================
  document.addEventListener('click', e => {
    if (isMobile()) {
      const insideMenu = e.target.closest('#nav-toggle') || e.target.closest('#nav-menu');
      if (!insideMenu) {
        if (document.querySelector('.submenu-active')) {
          closeAllSubmenus(); // Pehle sirf submenu close karo
        } else {
          navMenu.classList.remove('nav-menu-active'); // Agar submenu bhi nahi khula to pura menu close
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // ================================
  // Close Full Menu on Any Link Click (Non-submenu Links)
  // ================================
  navMenu?.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (isMobile() && link && !link.parentElement.classList.contains('has-submenu')) {
      navMenu.classList.remove('nav-menu-active');
      navToggle.setAttribute('aria-expanded', 'false');
      closeAllSubmenus();
    }
  });

  // ================================
  // Desktop: Submenu Toggle
  // ================================
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

  // ================================
  // Close All Desktop Submenus on Outside Click or Scroll
  // ================================
  document.addEventListener('click', e => {
    if (!isMobile() && !e.target.closest('.has-submenu')) {
      submenuParents.forEach(link => toggleSubmenu(link, link.nextElementSibling, true));
    }
  });

  window.addEventListener('scroll', () => {
    if (!isMobile()) {
      submenuParents.forEach(link => toggleSubmenu(link, link.nextElementSibling, true));
    }
  });

  // ================================
  // Scroll-to-Top Button
  // ================================
  if (scrollTopBtn) {
    const toggleScrollTopBtn = () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      toggleScrollTopBtn();
      document.body.classList.add('scrolling');
      clearTimeout(window._scrollTimeout);
      window._scrollTimeout = setTimeout(() => document.body.classList.remove('scrolling'), 250);
    });
    toggleScrollTopBtn();
  }

  // ================================
  // Sticky Navbar
  // ================================
  const handleNavbarSticky = () => {
    navbar?.classList.toggle(stickyClass, window.scrollY > scrollThreshold);
  };
  window.addEventListener('scroll', handleNavbarSticky);
  handleNavbarSticky();

  // ================================
  // Reset Submenus on Resize
  // ================================
  window.addEventListener('resize', () => {
    closeAllSubmenus();
    submenuParents.forEach(link => link.setAttribute('aria-expanded', 'false'));
    saveSubmenuState();
  });

  // ================================
  // Fade-In Sections on Scroll
  // ================================
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

  // ================================
  // Accessibility: Focus Styles
  // ================================
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
});
