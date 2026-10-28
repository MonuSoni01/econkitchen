import { kitchenDesigns } from './kitchen-designs.js';
import { filterKitchenDesigns, partitionKitchenDesigns, getKitchenSpecification } from './kitchen-gallery-core.js';

async function getLeadStorage() {
  const [config, firestore] = await Promise.all([
    import('./firebase.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
  ]);
  return { db: config.db, ...firestore };
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}
function displayText(value) {
  return String(value || '').replace(/\b\w/g, letter => letter.toUpperCase());
}
function icon(type) {
  const paths = {
    layout: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 4v16M4 16h16"/>',
    ruler: '<path d="M4 3v17h17v-5H9V3zM4 7h3m-3 4h3m-3 4h3m5 5v-3m4 3v-3"/>',
    collection: '<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
    finish: '<rect x="3" y="3" width="13" height="6" rx="1"/><path d="M16 6h4v7h-9v3"/><rect x="9" y="16" width="4" height="6" rx="1"/>',
    handle: '<path d="M3 15V8h18v7h-4v-3H7v3z"/>',
    calculator: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h1m3 0h1m3 0h0M8 18h1m3 0h1m3 0h0"/>'
  };
  return `<svg class="mk-line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type] || paths.layout}</svg>`;
}

function createKitchenCard(item, index) {
  const url = `/kitchen-design.html?slug=${encodeURIComponent(item.slug)}`;
  const collection = getKitchenSpecification(item, 'series', 'collection');
  const finish = getKitchenSpecification(item, 'finish');
  const handle = getKitchenSpecification(item, 'handle');
  const specifications = [
    ['collection', 'Collection', displayText(collection)],
    ['finish', 'Finish', finish],
    ['handle', 'Handle', handle]
  ].map(([type, label, value]) => `<div class="mk-card-spec">${icon(type)}<dt>${label}</dt><dd title="${escapeHTML(value || 'Ask us')}">${escapeHTML(value || 'Ask us')}</dd></div>`).join('');
  const metadata = [
    item.layout ? `<span>${icon('layout')}${escapeHTML(item.layout)}</span>` : '',
    item.size ? `<span>${icon('ruler')}${escapeHTML(item.size)}</span>` : ''
  ].filter(Boolean).join('<span class="mk-detail-divider" aria-hidden="true"></span>');
  return `<article class="mk-project-card" data-design-id="${escapeHTML(item.id)}" data-url="${url}">
    <div class="mk-project-image-wrap">
      <a href="${url}" class="mk-card-image-link" tabindex="-1" aria-label="View ${escapeHTML(item.title)}">
        <img src="${escapeHTML(item.main_image)}" alt="${escapeHTML(item.title)}" class="mk-project-image" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async" width="1600" height="1100">
        <span class="mk-project-open" aria-hidden="true">↗</span>
      </a>
      <span class="mk-card-number" aria-label="Design ${escapeHTML(item.id)}">${String(item.id).padStart(2, '0')}</span>
      <span class="mk-image-unavailable" hidden>Image unavailable</span>
    </div>
    <div class="mk-project-content">
      <div class="mk-project-info">
        ${item.category ? `<span class="mk-project-category">${escapeHTML(displayText(item.category))}</span>` : '<span class="mk-project-category">KITCHEN DESIGN</span>'}
        <h3 class="mk-project-title"><a href="${url}">${escapeHTML(item.title)}</a></h3>
        ${metadata ? `<div class="mk-project-details">${metadata}</div>` : ''}
        <dl class="mk-card-specs">${specifications}</dl>
      </div>
      <div class="mk-project-actions">
        <a href="/contact.html" class="mk-project-consultation">Book Consultation</a>
        <a href="/calculators/kitchen-estimator.html" class="mk-project-quote">${icon('calculator')}<span>Calculate Cost</span></a>
      </div>
    </div>
  </article>`;
}

function initGallery() {
  const collection = document.getElementById('collection');
  if (!collection || collection.dataset.galleryReady === 'true') return;
  collection.dataset.galleryReady = 'true';
  const state = { layout: 'all', category: 'all', series: 'all' };
  const filters = {
    layout: document.getElementById('layoutFilters'),
    category: document.getElementById('categoryFilters'),
    series: document.getElementById('seriesFilters')
  };
  const grids = ['initialKitchenGrid', 'layoutKitchenGrid', 'categoryKitchenGrid', 'seriesKitchenGrid', 'remainingKitchenGrid'].map(id => document.getElementById(id));
  const resultCount = document.getElementById('mkResultCount');
  const activeFilters = document.getElementById('mkActiveFilters');
  const resultHeading = document.getElementById('kitchenResults');
  const nav = document.getElementById('mkJumpNav');
  const panel = document.getElementById('mkJumpPanel');
  const toggle = document.getElementById('mkJumpToggle');
  const jumpLinks = [...document.querySelectorAll('[data-jump]')];
  const desktop = window.matchMedia('(min-width: 1280px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setMenu(open) {
    if (!panel || !toggle) return;
    panel.hidden = desktop.matches ? false : !open;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
  }
  function scrollTo(element) {
    if (element) element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
  function syncURL() {
    const url = new URL(window.location.href);
    for (const [key, query] of [['layout', 'layout'], ['category', 'style'], ['series', 'series']]) {
      if (state[key] === 'all') url.searchParams.delete(query);
      else url.searchParams.set(query, state[key]);
    }
    if (['all', 'essential', 'premium', 'signature'].includes(url.hash.slice(1).toLowerCase())) url.hash = '';
    window.history.replaceState(null, '', url);
  }
  function readURL() {
    const url = new URL(window.location.href);
    const hash = url.hash.slice(1).toLowerCase();
    const values = { layout: url.searchParams.get('layout'), category: url.searchParams.get('style'), series: url.searchParams.get('series') || (['essential', 'premium', 'signature'].includes(hash) ? hash : '') };
    for (const key of Object.keys(state)) {
      const buttons = [...(filters[key]?.querySelectorAll(`button[data-${key}]`) || [])];
      const requested = String(values[key] || '').toLowerCase();
      state[key] = buttons.find(button => button.dataset[key].toLowerCase() === requested)?.dataset[key] || 'all';
    }
  }
  function render() {
    const items = filterKitchenDesigns(kitchenDesigns, state);
    const groups = partitionKitchenDesigns(items);
    const selected = Object.entries(state).filter(([, value]) => value !== 'all');
    grids.forEach((grid, groupIndex) => {
      if (!grid) return;
      const group = groups[groupIndex];
      grid.parentElement.hidden = groupIndex > 0 && group.length === 0;
      if (groupIndex === 0 && !items.length) {
        grid.innerHTML = '<div class="mk-gallery-empty"><h2>No matching kitchens</h2><p>Try a different combination of layout, style or collection.</p><button type="button" data-gallery-reset>Reset filters</button></div>';
      } else {
        grid.innerHTML = group.map(item => createKitchenCard(item, items.indexOf(item))).join('');
      }
      grid.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
          img.hidden = true;
          img.closest('.mk-project-image-wrap').querySelector('.mk-image-unavailable').hidden = false;
        }, { once: true });
      });
    });
    if (resultCount) resultCount.textContent = selected.length ? `${items.length} of ${kitchenDesigns.length} Designs` : `${kitchenDesigns.length} Designs`;
    const end = document.getElementById('mkGalleryEnd');
    if (end) end.textContent = items.length ? `All ${items.length}${selected.length ? ' matching' : ''} designs shown` : 'No designs match this combination.';
    if (activeFilters) {
      activeFilters.hidden = selected.length === 0;
      activeFilters.innerHTML = selected.map(([key, value]) => `<button type="button" data-clear-filter="${key}" aria-label="Remove ${escapeHTML(displayText(value))} filter">${escapeHTML(displayText(value))}<span aria-hidden="true">×</span></button>`).join('') + (selected.length ? '<button type="button" class="mk-clear-all" data-gallery-reset>Clear all</button>' : '');
    }
    for (const [key, element] of Object.entries(filters)) {
      element?.querySelectorAll(`button[data-${key}]`).forEach(button => {
        const active = button.dataset[key] === state[key];
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
  }
  function reset() {
    for (const key of Object.keys(state)) state[key] = 'all';
    syncURL();
    render();
    setMenu(false);
    scrollTo(resultHeading);
  }
  for (const [key, element] of Object.entries(filters)) {
    element?.addEventListener('click', event => {
      const button = event.target.closest(`button[data-${key}]`);
      if (!button || !element.contains(button)) return;
      state[key] = button.dataset[key];
      syncURL();
      render();
      scrollTo(resultHeading);
    });
  }
  collection.addEventListener('click', event => {
    const clear = event.target.closest('[data-clear-filter]');
    if (clear) {
      state[clear.dataset.clearFilter] = 'all';
      syncURL(); render(); return;
    }
    if (event.target.closest('[data-gallery-reset]')) { reset(); return; }
    if (event.target.closest('a,button,input,select,textarea')) return;
    const card = event.target.closest('.mk-project-card[data-url]');
    if (card && event.button === 0) window.location.assign(card.dataset.url);
  });
  document.getElementById('resetKitchenFilters')?.addEventListener('click', reset);
  jumpLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const target = document.getElementById(link.dataset.jump);
    setMenu(false);
    scrollTo(target);
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }));
  toggle?.addEventListener('click', () => setMenu(panel.hidden));
  document.addEventListener('click', event => {
    if (!desktop.matches && nav && !nav.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel && !panel.hidden && !desktop.matches) { setMenu(false); toggle.focus(); }
  });
  desktop.addEventListener('change', () => setMenu(false));
  let scrollPending = false;
  function highlightSection() {
    scrollPending = false;
    let current = jumpLinks[0]?.dataset.jump;
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mk-header-offset')) || 100;
    jumpLinks.forEach(link => {
      const section = document.getElementById(link.dataset.jump);
      if (section && section.getBoundingClientRect().top <= headerHeight + 100) current = link.dataset.jump;
    });
    jumpLinks.forEach(link => {
      const active = link.dataset.jump === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(highlightSection); }
  }, { passive: true });
  function updateHeaderOffset() {
    const slot = document.getElementById('header-slot');
    const header = slot?.querySelector('header') || slot;
    const height = header?.getBoundingClientRect().height || 80;
    document.documentElement.style.setProperty('--mk-header-offset', `${Math.min(240, Math.ceil(height + 18))}px`);
    highlightSection();
  }
  const headerSlot = document.getElementById('header-slot');
  if (headerSlot && window.ResizeObserver) {
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(headerSlot);
    new MutationObserver(() => {
      const header = headerSlot.querySelector('header');
      if (header) observer.observe(header);
      updateHeaderOffset();
    }).observe(headerSlot, { childList: true, subtree: true });
  }
  window.addEventListener('resize', updateHeaderOffset, { passive: true });
  window.addEventListener('popstate', () => { readURL(); render(); });
  window.addEventListener('hashchange', () => { readURL(); render(); });
  readURL();
  render();
  setMenu(false);
  updateHeaderOffset();
  const initialURL = new URL(window.location.href);
  const hash = initialURL.hash.slice(1).toLowerCase();
  const initialTarget = initialURL.searchParams.has('series') || ['essential', 'premium', 'signature'].includes(hash)
    ? document.getElementById('seriesBrowser')
    : ['layoutBrowser', 'categoryBrowser', 'seriesBrowser', 'kitchenCatalogue'].includes(initialURL.hash.slice(1)) ? document.getElementById(initialURL.hash.slice(1)) : null;
  if (initialTarget) {
    if (document.readyState === 'complete') requestAnimationFrame(() => scrollTo(initialTarget));
    else window.addEventListener('load', () => scrollTo(initialTarget), { once: true });
  }
}

function initExistingPageFeatures() {
        const consultationForm =
            document.getElementById(
                "mkConsultationForm"
            );
        const submitButton =
            document.getElementById(
                "mkSubmitBtn"
            );
        const thankYouPopup =
            document.getElementById(
                "mkThankYouPopup"
            );
        const popupClose =
            document.getElementById(
                "mkPopupClose"
            );
        const popupDone =
            document.getElementById(
                "mkPopupDone"
            );
        const serviceOptions =
            document.querySelectorAll(
                ".mk-service-option"
            );
        /* =====================================================
           SERVICE OPTIONS
        ====================================================== */
        serviceOptions.forEach(
            option => {
                const radio =
                    option.querySelector(
                        "input[type='radio']"
                    );
                if (!radio) {
                    return;
                }
                radio.addEventListener(
                    "change",
                    () => {
                        serviceOptions.forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );
                        if (
                            radio.checked
                        ) {
                            option.classList.add(
                                "active"
                            );
                        }
                    }
                );
            }
        );
        /* =====================================================
           PHONE
        ====================================================== */
        const phoneInput =
            document.getElementById(
                "mkPhone"
            );
        phoneInput
            ?.addEventListener(
                "input",
                function () {
                    this.value =
                        this.value
                            .replace(
                                /\D/g,
                                ""
                            )
                            .slice(
                                0,
                                10
                            );
                }
            );
        /* =====================================================
           FIELD ERRORS
        ====================================================== */
        function setFieldError(
            field,
            message
        ) {
            if (!field) {
                return;
            }
            const wrapper =
                field.closest(
                    ".mk-field"
                );
            if (!wrapper) {
                return;
            }
            wrapper.classList.add(
                "mk-invalid"
            );
            const error =
                wrapper.querySelector(
                    ".mk-error"
                );
            if (
                error
            ) {
                error.textContent =
                    message;
            }
        }
        function clearFieldError(
            field
        ) {
            if (!field) {
                return;
            }
            const wrapper =
                field.closest(
                    ".mk-field"
                );
            if (!wrapper) {
                return;
            }
            wrapper.classList.remove(
                "mk-invalid"
            );
            const error =
                wrapper.querySelector(
                    ".mk-error"
                );
            if (
                error
            ) {
                error.textContent =
                    "";
            }
        }
        /* =====================================================
           VALIDATION
        ====================================================== */
        function validateConsultationForm() {
            let valid =
                true;
            const name =
                document.getElementById(
                    "mkName"
                );
            const phone =
                document.getElementById(
                    "mkPhone"
                );
            const email =
                document.getElementById(
                    "mkEmail"
                );
            const city =
                document.getElementById(
                    "mkCity"
                );
            clearFieldError(
                name
            );
            if (
                !name ||
                name.value
                    .trim()
                    .length < 2
            ) {
                setFieldError(
                    name,
                    "Please enter your name."
                );
                valid =
                    false;
            }
            clearFieldError(
                phone
            );
            if (
                !phone ||
                !/^[6-9]\d{9}$/.test(
                    phone.value.trim()
                )
            ) {
                setFieldError(
                    phone,
                    "Enter a valid 10-digit mobile number."
                );
                valid =
                    false;
            }
            clearFieldError(
                email
            );
           const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (
                !email ||
                !emailPattern.test(
                    email.value.trim()
                )
            ) {
                setFieldError(
                    email,
                    "Please enter a valid email address."
                );
                valid =
                    false;
            }
            clearFieldError(
                city
            );
            if (
                !city ||
                !city.value
            ) {
                setFieldError(
                    city,
                    "Please select your city."
                );
                valid =
                    false;
            }
            return valid;
        }
        /* =====================================================
           CLEAR ERRORS ON INPUT
        ====================================================== */
        consultationForm
            ?.querySelectorAll(
                "input, select, textarea"
            )
            .forEach(
                field => {
                    field.addEventListener(
                        "input",
                        () => {
                            clearFieldError(
                                field
                            );
                        }
                    );
                    field.addEventListener(
                        "change",
                        () => {
                            clearFieldError(
                                field
                            );
                        }
                    );
                }
            );
        /* =====================================================
           THANK YOU POPUP
        ====================================================== */
        function openThankYouPopup() {
            if (
                !thankYouPopup
            ) {
                return;
            }
            thankYouPopup.classList.add(
                "active"
            );
            thankYouPopup.setAttribute(
                "aria-hidden",
                "false"
            );
            document.body.style.overflow =
                "hidden";
        }
        function closeThankYouPopup() {
            if (
                !thankYouPopup
            ) {
                return;
            }
            thankYouPopup.classList.remove(
                "active"
            );
            thankYouPopup.setAttribute(
                "aria-hidden",
                "true"
            );
            document.body.style.overflow =
                "";
        }
        popupClose
            ?.addEventListener(
                "click",
                closeThankYouPopup
            );
        popupDone
            ?.addEventListener(
                "click",
                closeThankYouPopup
            );
        thankYouPopup
            ?.addEventListener(
                "click",
                event => {
                    if (
                        event.target ===
                        thankYouPopup
                    ) {
                        closeThankYouPopup();
                    }
                }
            );
        /* =====================================================
           FIREBASE SUBMIT
        ====================================================== */
        consultationForm
            ?.addEventListener(
                "submit",
                async event => {
                    event.preventDefault();
                    if (
                        !validateConsultationForm()
                    ) {
                        return;
                    }
                    if (
                        submitButton
                    ) {
                        submitButton.classList.add(
                            "loading"
                        );
                        submitButton.disabled =
                            true;
                    }
                    try {
                        const { db, collection, addDoc, serverTimestamp } = await getLeadStorage();
                        const formData =
                            new FormData(
                                consultationForm
                            );
                        const selectedService =
                            consultationForm
                                .querySelector(
                                    "input[name='service']:checked"
                                );
                        const leadData = {
                            name:
                                String(
                                    formData.get(
                                        "name"
                                    ) || ""
                                )
                                    .trim(),
                            phone:
                                String(
                                    formData.get(
                                        "phone"
                                    ) || ""
                                )
                                    .trim(),
                            email:
                                String(
                                    formData.get(
                                        "email"
                                    ) || ""
                                )
                                    .trim(),
                            city:
                                String(
                                    formData.get(
                                        "city"
                                    ) || ""
                                )
                                    .trim(),
                            service:
                                selectedService
                                    ?.value ||
                                "Modular Kitchen",
                            message:
                                String(
                                    formData.get(
                                        "message"
                                    ) || ""
                                )
                                    .trim(),
                            source:
                                "Modular Kitchen Consultation",
                            page:
                                window.location.pathname,
                            status:
                                "new",
                            createdAt:
                                serverTimestamp()
                        };
                        await addDoc(
                            collection(
                                db,
                                "leads"
                            ),
                            leadData
                        );
                        consultationForm.reset();
                        serviceOptions.forEach(
                            option => {
                                option.classList.remove(
                                    "active"
                                );
                            }
                        );
                        const firstService =
                            serviceOptions[0];
                        if (
                            firstService
                        ) {
                            firstService.classList.add(
                                "active"
                            );
                            const radio =
                                firstService.querySelector(
                                    "input[type='radio']"
                                );
                            if (
                                radio
                            ) {
                                radio.checked =
                                    true;
                            }
                        }
                        openThankYouPopup();
                    }
                    catch (
                    error
                    ) {
                        console.error(
                            "ECON Consultation Form Error:",
                            error
                        );
                        alert(
                            "Something went wrong. Please try again or contact us directly."
                        );
                    }
                    finally {
                        if (
                            submitButton
                        ) {
                            submitButton.classList.remove(
                                "loading"
                            );
                            submitButton.disabled =
                                false;
                        }
                    }
                }
            );
        /* =====================================================
           FAQ
        ====================================================== */
        const faqItems =
            document.querySelectorAll(
                ".econ-faq-item"
            );
        faqItems.forEach(
            item => {
                const question =
                    item.querySelector(
                        ".econ-faq-question"
                    );
                if (!question) {
                    return;
                }
                question.setAttribute(
                    "aria-expanded",
                    item.classList.contains(
                        "active"
                    )
                        ? "true"
                        : "false"
                );
                question.addEventListener(
                    "click",
                    () => {
                        const isActive =
                            item.classList.contains(
                                "active"
                            );
                        faqItems.forEach(
                            other => {
                                if (
                                    other ===
                                    item
                                ) {
                                    return;
                                }
                                other.classList.remove(
                                    "active"
                                );
                                other
                                    .querySelector(
                                        ".econ-faq-question"
                                    )
                                    ?.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                            }
                        );
                        if (
                            isActive
                        ) {
                            item.classList.remove(
                                "active"
                            );
                            question.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                        else {
                            item.classList.add(
                                "active"
                            );
                            question.setAttribute(
                                "aria-expanded",
                                "true"
                            );
                        }
                    }
                );
            }
        );
        /* =====================================================
           SMOOTH INTERNAL LINKS
        ====================================================== */
        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                link => {
                    link.addEventListener(
                        "click",
                        event => {
                            if (event.defaultPrevented) return;
                            const href =
                                link.getAttribute(
                                    "href"
                                );
                            if (
                                !href ||
                                href === "#"
                            ) {
                                return;
                            }
                            const target =
                                document.querySelector(
                                    href
                                );
                            if (
                                !target
                            ) {
                                return;
                            }
                            event.preventDefault();
                            target.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "center"
                            });
                        }
                    );
                }
            );
        /* =====================================================
           ESCAPE KEY
        ====================================================== */
        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }
                closeThankYouPopup();
            }
        );
}
function initPage() {
  initGallery();
  initExistingPageFeatures();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPage, { once: true });
else initPage();