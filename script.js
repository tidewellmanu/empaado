(() => {
  const preloader = document.getElementById('preloader');
  const percent = document.getElementById('load-percent');
  let value = 0;
  const startedAt = Date.now();
  const minimumPreloaderTime = 1500;
  const timer = preloader ? setInterval(() => {
    value = Math.min(96, value + 2);
    percent.textContent = String(value).padStart(2, '0') + '%';
    preloader.querySelector('.loader-track span').style.width = value + '%';
  }, 65) : null;
  window.addEventListener('load', () => {
    if (!preloader) return;
    const remaining = Math.max(0, minimumPreloaderTime - (Date.now() - startedAt));
    setTimeout(() => {
      if (timer) clearInterval(timer);
      percent.textContent = '100%';
      preloader.querySelector('.loader-track span').style.width = '100%';
      setTimeout(() => preloader.classList.add('done'), 450);
    }, remaining);
  });

  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menuToggle && nav) menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  if (nav && menuToggle) nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.property-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.type === filter ? '' : 'none';
    });
  }));

  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent('Property enquiry — ' + data.get('service'));
    const body = encodeURIComponent(
      'Name: ' + data.get('name') + '\\nEmail: ' + data.get('email') +
      '\\nService: ' + data.get('service') + '\\n\\nProperty details:\\n' + data.get('message')
    );
    document.getElementById('form-note').textContent = 'Opening your email app with the enquiry details…';
    window.location.href = 'mailto:hello@Empaado Company Ltdproperty.com?subject=' + subject + '&body=' + body;
  });

  // Homepage hero carousel: auto-advance, arrows, dots and pause-on-hover.
  const heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const dots = [...heroSlider.querySelectorAll('.hero-dots button')];
    const counter = heroSlider.querySelector('.hero-counter');
    const caption = heroSlider.querySelector('.hero-slide-caption');
    const captions = ['SPACES THAT WORK FOR YOU', 'HOMES WITH ROOM TO GROW', 'DETAILS THAT MAKE A DIFFERENCE', 'PLACES FOR BUSINESS TO THRIVE'];
    let current = 0;
    let timer;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (caption) caption.textContent = captions[current];
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 5000); };
    heroSlider.querySelector('.hero-prev')?.addEventListener('click', () => { show(current - 1); start(); });
    heroSlider.querySelector('.hero-next')?.addEventListener('click', () => { show(current + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    heroSlider.addEventListener('mouseenter', () => clearInterval(timer));
    heroSlider.addEventListener('mouseleave', start);
    heroSlider.addEventListener('focusin', () => clearInterval(timer));
    heroSlider.addEventListener('focusout', start);
    show(0);
    start();
  }

  // Independent auto-advancing image galleries on property category pages.
  document.querySelectorAll('[data-slider]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('.slide')];
    const dots = [...gallery.querySelectorAll('.gallery-dots button')];
    const counter = gallery.querySelector('.gallery-counter');
    if (slides.length < 2) return;
    let current = 0;
    let interval;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      if (counter) counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    };
    const start = () => { clearInterval(interval); interval = setInterval(() => show(current + 1), Number(gallery.dataset.interval) || 4200); };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    gallery.addEventListener('mouseenter', () => clearInterval(interval));
    gallery.addEventListener('mouseleave', start);
    start();
  });
})();