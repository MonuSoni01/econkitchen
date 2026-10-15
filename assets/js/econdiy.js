/* ECONDIY — WhatsApp CTAs, continuous trust ticker and testimonial slider. */
(() => {
  'use strict';
  const page = document.querySelector('.diy-page');
  if (!page) return;
  const WHATSAPP_NUMBER = '917060966889';
  const messages = {
    quote: 'Namaste ECONDIY! Mujhe apni kitchen quotation ka FREE comparison karwana hai. Main apni quotation aur kitchen details yahan share karunga. Please guide me.',
    blueprint: 'Namaste ECONDIY! Mujhe ₹5,000 DIY Kitchen Blueprint ke baare mein assistance chahiye. Please 2D layout, 3D design, material, hardware aur costing planning ka process samjhaiye.'
  };
  page.querySelectorAll('[data-wa]').forEach(link => {
    const message = messages[link.dataset.wa];
    if (message) link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });

  // Neutral fallback; reference photos can be replaced with project images.
  const fallback = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#eee5cd"/><path d="M310 340V230h280v110M310 270h280M390 270v70M490 270v70" fill="none" stroke="#ac9146" stroke-width="7"/></svg>');
  page.querySelectorAll('img').forEach(img => {
    const fail = () => {
      const picture = img.closest('picture');
      if (picture) picture.querySelectorAll('source').forEach(source => source.remove());
      img.srcset = '';
      img.src = fallback;
    };
    img.addEventListener('error', fail, {once:true});
    if (img.complete && img.naturalWidth === 0) fail();
  });

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const trustTrack = page.querySelector('#diyTrustTrack');
  const trustList = page.querySelector('#diyTrustList');
  const ticker = page.querySelector('.diy-ticker');
  const tickerButton = page.querySelector('#diyTickerToggle');
  let tickerPaused = motion.matches;
  const clone = trustList.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden','true');
  trustTrack.appendChild(clone);
  function sizeTicker() {
    const width = trustList.getBoundingClientRect().width;
    trustTrack.style.setProperty('--ticker-distance', `${width}px`);
    // Add enough repeated content to cover very wide displays without a gap.
    trustTrack.querySelectorAll('[data-extra-copy]').forEach(item => item.remove());
    const copies = Math.min(12, Math.ceil(ticker.clientWidth / Math.max(width,1)));
    for (let i=1; i<copies; i++) {
      const extra = clone.cloneNode(true);
      extra.dataset.extraCopy = 'true';
      trustTrack.appendChild(extra);
    }
  }
  function updateTicker() {
    ticker.classList.toggle('is-paused', tickerPaused || motion.matches);
    tickerButton.setAttribute('aria-pressed', String(tickerPaused));
    tickerButton.setAttribute('aria-label', tickerPaused ? 'Play benefits ticker' : 'Pause benefits ticker');
    tickerButton.innerHTML = `<i class="fa-solid fa-${tickerPaused ? 'play':'pause'}" aria-hidden="true"></i>`;
  }
  tickerButton.addEventListener('click', () => { tickerPaused = !tickerPaused; updateTicker(); });
  sizeTicker(); updateTicker();
  if (document.fonts) document.fonts.ready.then(sizeTicker);
  window.addEventListener('resize', sizeTicker);

  const carousel = page.querySelector('#diyReviews');
  const track = page.querySelector('#diyReviewsTrack');
  const cards = [...track.children];
  const dots = page.querySelector('#diyReviewDots');
  const pauseButton = page.querySelector('#diyReviewPause');
  let index = 0;
  let timer = null;
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let touch = null;
  let settling = false;
  // Copies allow a seamless final-to-first transition even with three cards visible.
  cards.forEach(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden','true');
    copy.inert = true;
    track.appendChild(copy);
  });
  cards.forEach((card,i) => {
    card.setAttribute('role','group');
    card.setAttribute('aria-label',`Testimonial ${i+1} of ${cards.length}`);
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label',`Show testimonial ${i+1}`);
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dots.appendChild(dot);
  });
  function paint(animate = true) {
    const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || '0');
    track.style.transition = animate && !motion.matches ? '' : 'none';
    track.style.transform = `translateX(-${index * step}px)`;
    [...dots.children].forEach((dot,i) => dot.setAttribute('aria-current',String(i === index % cards.length)));
  }
  function goTo(value) {
    if (settling) return;
    index = (value + cards.length) % cards.length;
    paint();
  }
  function next() {
    if (settling) return;
    index++;
    if (index === cards.length && !motion.matches) settling = true;
    else index %= cards.length;
    paint();
  }
  track.addEventListener('transitionend', event => {
    if (event.propertyName !== 'transform' || !settling) return;
    index = 0; settling = false; paint(false);
  });
  function stop() { if (timer !== null) window.clearInterval(timer); timer = null; }
  function restart() {
    stop();
    if (!paused && !motion.matches && !hovered && !focused && !document.hidden)
      timer = window.setInterval(next,4000);
  }
  function updatePause() {
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.setAttribute('aria-label',paused ? 'Play testimonials':'Pause testimonials');
    pauseButton.innerHTML = `<i class="fa-solid fa-${paused ? 'play':'pause'}" aria-hidden="true"></i>`;
    restart();
  }
  page.querySelector('#diyReviewNext').addEventListener('click', () => { next(); restart(); });
  page.querySelector('#diyReviewPrev').addEventListener('click', () => { goTo(index-1); restart(); });
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; stop(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; restart(); });
  carousel.addEventListener('focusin', () => { focused = true; stop(); });
  carousel.addEventListener('focusout', () => {
    requestAnimationFrame(() => { focused = carousel.contains(document.activeElement); restart(); });
  });
  const viewport = page.querySelector('.diy-reviews-window');
  viewport.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { touch = null; return; }
    stop(); touch = {x:event.touches[0].clientX,y:event.touches[0].clientY};
  },{passive:true});
  viewport.addEventListener('touchend', event => {
    if (touch && event.changedTouches.length) {
      const dx = event.changedTouches[0].clientX-touch.x;
      const dy = event.changedTouches[0].clientY-touch.y;
      if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) dx<0 ? next():goTo(index-1);
    }
    touch = null; restart();
  },{passive:true});
  viewport.addEventListener('touchcancel', () => { touch = null; restart(); },{passive:true});
  document.addEventListener('visibilitychange',restart);
  window.addEventListener('resize', () => { index %= cards.length; settling = false; paint(false); });
  if (document.fonts) document.fonts.ready.then(() => paint(false));
  motion.addEventListener('change', () => {
    if (motion.matches) { paused = true; tickerPaused = true; }
    index %= cards.length; settling = false; paint(false); updatePause(); updateTicker();
  });
  paint(false); updatePause();

  const faqButton = page.querySelector('#diyFaqToggle');
  const faqs = [...page.querySelectorAll('.diy-faqs details')];
  function updateFaqButton() {
    const allOpen = faqs.every(item => item.open);
    faqButton.setAttribute('aria-expanded', String(allOpen));
    faqButton.innerHTML = `${allOpen ? 'Close All FAQs' : 'View All FAQs'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;
  }
  faqButton.addEventListener('click', () => {
    const open = !faqs.every(item => item.open);
    faqs.forEach(item => item.open = open);
    updateFaqButton();
  });
  faqs.forEach(item => item.addEventListener('toggle',updateFaqButton));
  updateFaqButton();
})();
