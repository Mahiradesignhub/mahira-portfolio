document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const submenuParents = document.querySelectorAll('.has-submenu > a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const navbar = document.querySelector('.navbar');
  const stickyClass = 'navbar-sticky';
  const scrollThreshold = 80;

  // --- Mobile nav toggle ---
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('nav-menu-active');
  });

  // --- Close mobile nav on normal link click ---
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const parentLi = link.closest('li');
      const isInsideSubmenu = link.closest('.submenu');
      const isSubmenuParent = parentLi && parentLi.classList.contains('has-submenu');

      if (!isSubmenuParent && !isInsideSubmenu && navMenu.classList.contains('nav-menu-active')) {
        navMenu.classList.remove('nav-menu-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Submenu toggle for mobile & desktop ---
  submenuParents.forEach(link => {
    const parentLi = link.parentElement;
    const submenu = link.nextElementSibling;

    const toggleSubmenu = () => {
      const isOpen = parentLi.classList.contains('open') || submenu.classList.contains('submenu-active');

      if (window.innerWidth <= 991) {
        if (isOpen) {
          parentLi.classList.remove('open');
          link.classList.remove('rotate-arrow');
        } else {
          parentLi.classList.add('open');
          link.classList.add('rotate-arrow');
        }
      } else {
        if (isOpen) {
          submenu.classList.remove('submenu-active');
          link.classList.remove('rotate-arrow');
        } else {
          submenu.classList.add('submenu-active');
          link.classList.add('rotate-arrow');
        }
      }
      link.setAttribute('aria-expanded', String(!isOpen));
    };

    link.addEventListener('click', e => {
      e.preventDefault();
      toggleSubmenu();
    });

    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSubmenu();
      }
    });

    link.addEventListener('touchstart', e => {
      if (window.innerWidth > 991) {
        e.preventDefault();
        toggleSubmenu();
      }
    });
  });

  // --- Close desktop submenus on outside click ---
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-submenu') && window.innerWidth > 991) {
      submenuParents.forEach(link => {
        link.setAttribute('aria-expanded', 'false');
        link.nextElementSibling?.classList.remove('submenu-active');
        link.classList.remove('rotate-arrow');
      });
    }
  });

  // --- Scroll-to-top button ---
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Sticky navbar ---
  function handleNavbarSticky() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add(stickyClass);
    } else {
      navbar.classList.remove(stickyClass);
    }
  }
  window.addEventListener('scroll', handleNavbarSticky);
  handleNavbarSticky();

  // --- Reset submenus on window resize ---
  window.addEventListener('resize', () => {
    document.querySelectorAll('.has-submenu').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.submenu-active').forEach(sub => sub.classList.remove('submenu-active'));
    document.querySelectorAll('.rotate-arrow').forEach(el => el.classList.remove('rotate-arrow'));
  });

  // --- Section fade-in animation on scroll ---
  const sections = document.querySelectorAll('.section-container, .hero-section');
  const fadeInOptions = { threshold: 0.2 };

  const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, fadeInOptions);

  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInOnScroll.observe(section);
  });

  // --- Accessibility: focus styles for keyboard users ---
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
});
