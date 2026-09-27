// ===== Preloader (min 2 seconds) =====
window.addEventListener('load', function () {
  var start = Date.now();
  var minTime = 2000;
  var elapsed = Date.now() - start;
  var wait = Math.max(minTime - elapsed, minTime);
  setTimeout(function () {
    var pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hide');
  }, wait);
});
// Fallback in case 'load' already fired
setTimeout(function () {
  var pre = document.getElementById('preloader');
  if (pre && !pre.classList.contains('hide')) pre.classList.add('hide');
}, 4000);

// ===== Navbar: fix to top once scrolled past the topbar, never hide =====
(function () {
  var navEl = document.getElementById('mainNavbar');
  var spacerEl = document.getElementById('navbarSpacer');
  var topbarEl = document.querySelector('.topbar');
  if (!navEl || !spacerEl) return;

  function updateNavbarFixed() {
    var topbarH = topbarEl ? topbarEl.offsetHeight : 0;
    if (window.scrollY > topbarH) {
      if (!navEl.classList.contains('navbar-fixed')) {
        spacerEl.style.height = navEl.offsetHeight + 'px';
        navEl.classList.add('navbar-fixed');
      }
    } else if (navEl.classList.contains('navbar-fixed')) {
      navEl.classList.remove('navbar-fixed');
      spacerEl.style.height = '0px';
    }
  }
  window.addEventListener('scroll', updateNavbarFixed);
  window.addEventListener('resize', updateNavbarFixed);
  window.addEventListener('load', updateNavbarFixed);
  updateNavbarFixed();
})();

// ===== Mobile menu: auto-close on link click or outside click =====
document.addEventListener('DOMContentLoaded', function () {
  var navMenuEl = document.getElementById('navMenu');
  var navToggler = document.querySelector('.navbar-toggler');
  if (navMenuEl && navToggler && window.bootstrap) {
    var bsCollapse = new bootstrap.Collapse(navMenuEl, { toggle: false });

    navMenuEl.querySelectorAll('a.nav-link, #langToggleBtn').forEach(function (el) {
      el.addEventListener('click', function () {
        if (navMenuEl.classList.contains('show')) bsCollapse.hide();
      });
    });

    document.addEventListener('click', function (e) {
      if (!navMenuEl.classList.contains('show')) return;
      if (navMenuEl.contains(e.target) || navToggler.contains(e.target)) return;
      bsCollapse.hide();
    });
  }
});

// ===== Language toggle (Arabic <> English) =====
function setLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('.i18n-ar').forEach(function (el) {
    el.classList.toggle('d-none', lang !== 'ar');
  });
  document.querySelectorAll('.i18n-en').forEach(function (el) {
    el.classList.toggle('d-none', lang !== 'en');
  });
  var label = document.getElementById('langToggleLabel');
  if (label) label.textContent = lang === 'ar' ? 'English' : 'العربية';
  try { localStorage.setItem('kidsskills-lang', lang); } catch (e) {}
}
document.addEventListener('DOMContentLoaded', function () {
  var saved = 'ar';
  try { saved = localStorage.getItem('kidsskills-lang') || 'ar'; } catch (e) {}
  setLang(saved);

  var toggleBtn = document.getElementById('langToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('lang') || 'ar';
      setLang(current === 'ar' ? 'en' : 'ar');
    });
  }

  // ===== Animated counters =====
  var counters = document.querySelectorAll('.counter-num');
  var counted = false;
  function runCounters() {
    if (counted) return;
    var box = document.querySelector('.counters');
    if (!box) return;
    var rect = box.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counted = true;
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var current = 0;
        var step = Math.max(target / 60, 1);
        var timer = setInterval(function () {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, 25);
      });
    }
  }
  window.addEventListener('scroll', runCounters);
  runCounters();

  // ===== Scroll reveal animations (alternating right/left) =====
  var revealSelector = '.feature-card, .program-card, .gallery-item, .team-card, .testimonial-card, .contact-card, .counter-item, .about-img-wrap, #about .col-lg-6, .cta-section, .section-tag, .hero-stats > div';
  var revealEls = document.querySelectorAll(revealSelector);
  revealEls.forEach(function (el, i) {
    el.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
  });
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ===== Back to top button visibility =====
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);
  });
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Sticky navbar shadow on scroll =====
  var nav = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  });

  // ===== Contact form (demo, no backend) =====
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      var lang = document.documentElement.getAttribute('lang');
      msg.textContent = lang === 'ar'
        ? 'تم إرسال رسالتك بنجاح، سنتواصل معكم قريبًا.'
        : 'Your message has been sent. We will contact you soon.';
      msg.classList.remove('d-none');
      form.reset();
    });
  }
});
