/* ECON — Layout -> Measurements -> Making preference -> Contact -> Save.
   Reuses your EXISTING firebase.js, calculator-config.js and Apps Script.
   No package rates, amount calculation, PDF or new admin panel is added. */
import { submitLead } from './firebase.js';
import calculatorConfig from './calculator-config.js';

const SHEET_URL = window.ECON_FINISH_SHEET_URL ||
  'https://script.google.com/macros/s/AKfycbynNr5q4BC3JCiZu8nChTDG7r5ZyWrzDV8uIeYRBtmZ2EEQ6gUwzVqtYQ4pgd0zyMk/exec';
const FINISHES = { carpenter: 'Carpenter Made', factory: 'Factory Finish' };

function init() {
  const $ = id => document.getElementById(id);
  const panels = [...document.querySelectorAll('.estimator-step')];
  const layoutCards = [...document.querySelectorAll('[data-layout]')];
  const finishCards = [...document.querySelectorAll('[data-finish]')];
  const form = $('estimatorLeadForm');
  $('customerPhone').addEventListener('input', function () {
    let number = this.value.replace(/\D/g, '');

    // Browser autofill में country code आए तो हटाएँ।
    if (number.length === 12 && number.startsWith('91')) {
      number = number.slice(2);
    }

    this.value = number.slice(0, 10);
  });
  const state = { step: 1, layout: null, finish: null, saving: false, sheetBusy: false, saved: null };

  async function loadWhatsAppPrefill() {
  const token = new URLSearchParams(
    window.location.search
  ).get("ref");

  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return;

  const nameInput = $("customerName");
  const phoneInput = $("customerPhone");

  let nameEdited = false;
  let phoneEdited = false;

  nameInput.addEventListener("input", () => {
    nameEdited = true;
  });

  phoneInput.addEventListener("input", () => {
    phoneEdited = true;
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "resolve_estimate_session",
        token
      }),
      redirect: "follow",
      signal: controller.signal
    });

    if (!response.ok) return;

    const result = await response.json();

    if (!result.ok || !result.customer) return;

    const phone = String(result.customer.phone || "");
    const name = String(result.customer.name || "").trim();

    if (!/^[6-9]\d{9}$/.test(phone)) return;

    if (!nameEdited && !nameInput.value.trim() && name) {
      nameInput.value = name;
      nameInput.defaultValue = name;
    }

    if (!phoneEdited && !phoneInput.value.trim()) {
      phoneInput.value = phone;
      phoneInput.defaultValue = phone;
    }
  } catch {
    console.warn("Autofill unavailable. Please enter details.");
  } finally {
    clearTimeout(timer);
  }
}

loadWhatsAppPrefill();

  function walls() { return calculatorConfig.layouts[state.layout]?.walls || []; }
  function dimensions() {
    return Object.fromEntries(walls().map(key => [key, Number($('dimension' + key.toUpperCase()).value)]));
  }
  function length() { return Object.values(dimensions()).reduce((sum, value) => sum + value, 0); }
  function measurements() {
    return Object.entries(dimensions()).map(([key, value]) => `${key.toUpperCase()}: ${value} ft`).join(' | ');
  }
  function validDimensions(report = false) {
    if (!state.layout) return false;
    for (const key of walls()) {
      const input = $('dimension' + key.toUpperCase());
      const raw = input.value.trim();
      const value = Number(raw);
      input.setCustomValidity(raw && Number.isFinite(value) && value >= 3 && value <= 30
        ? '' : 'Enter a measurement from 3 to 30 feet.');
      if (!input.checkValidity()) { if (report) input.reportValidity(); return false; }
    }
    return true;
  }
  function updateSummary() {
    const values = {
      finalLayout: calculatorConfig.layouts[state.layout]?.name || '—',
      finalMeasurements: measurements() || '—',
      finalRunningFeet: state.layout ? `${length().toFixed(2)} Running Ft.` : '—',
      finalFinish: FINISHES[state.finish] || '—'
    };
    for (const [id, value] of Object.entries(values)) $(id).textContent = value;
  }
  function refreshDimensions() {
    const activeWalls = walls();
    for (const key of ['a', 'b', 'c']) {
      const used = activeWalls.includes(key);
      $('dimension' + key.toUpperCase() + 'Field').classList.toggle('hidden', !used);
      $('dimension' + key.toUpperCase()).disabled = !used;
      $('diagram' + key.toUpperCase() + 'Value').textContent =
        `${$('dimension' + key.toUpperCase()).value || '—'} FT`;
    }
    $('measurementLayoutName').textContent = calculatorConfig.layouts[state.layout]?.name || 'Choose a layout';
    const diagram = $('diagramL');
    diagram.classList.remove('diagram-straight', 'diagram-l-shaped', 'diagram-u-shaped', 'diagram-parallel');
    if (state.layout) diagram.classList.add('diagram-' + state.layout);
    $('runningFeet').textContent = state.layout && validDimensions() ? length().toFixed(2) : '—';
    updateSummary();
    updateMobile();
  }
  function updateMobile() {
    $('mobileStepCount').textContent = `STEP ${state.step} OF 4`;
    $('mobileBack').style.visibility = state.step === 1 ? 'hidden' : 'visible';
    $('mobileNext').style.visibility = state.step === 4 ? 'hidden' : 'visible';
    $('mobileNext').disabled = state.saving || (state.step === 1 && !state.layout) ||
      (state.step === 2 && !validDimensions()) || (state.step === 3 && !state.finish);
    $('mobileNext').textContent = state.step === 3 ? 'YOUR DETAILS →' : 'NEXT →';
  }
  function showStep(step, scroll = true) {
    state.step = step;
    $('estimateLoader').classList.remove('active');
    $('estimateResult').classList.remove('active');
    panels.forEach(panel => panel.classList.toggle('active', Number(panel.dataset.step) === step));
    document.querySelectorAll('.progress-step').forEach(el => {
      const number = Number(el.dataset.progress);
      el.classList.toggle('active', number === step);
      el.classList.toggle('completed', number < step);
    });
    document.querySelectorAll('.progress-line').forEach((el, index) => el.classList.toggle('completed', index + 1 < step));
    $('mobileEstimatorBar').style.removeProperty('display');
    updateSummary(); updateMobile();
    if (scroll) {
      requestAnimationFrame(() => {
        const activeStep = document.querySelector(
          '.estimator-step.active'
        );

        if (!activeStep) return;

        // Allow space for the visible fixed/sticky website header.
        let headerBottom = 0;

        document.querySelectorAll(
          '#header-slot, #header-slot *'
        ).forEach(element => {
          const style = getComputedStyle(element);

          if (
            style.position !== 'fixed' &&
            style.position !== 'sticky'
          ) return;

          const rect = element.getBoundingClientRect();

          if (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top <= 1 &&
            rect.bottom > 0
          ) {
            headerBottom = Math.max(
              headerBottom,
              rect.bottom
            );
          }
        });

        const top =
          window.scrollY +
          activeStep.getBoundingClientRect().top -
          headerBottom -
          16;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches ? 'auto' : 'smooth'
        });
      });
    }
  }
  function next() {
    if (state.saving) return;
    if (state.step === 1 && !state.layout) return;
    if (state.step === 2 && !validDimensions(true)) return;
    if (state.step === 3 && !state.finish) return;
    if (state.step < 4) showStep(state.step + 1);
  }
  layoutCards.forEach(card => card.addEventListener('click', () => {
    if (state.saving || !calculatorConfig.layouts[card.dataset.layout]) return;
    state.layout = card.dataset.layout;
    layoutCards.forEach(item => { const selected = item === card; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    $('layoutSelection').textContent = calculatorConfig.layouts[state.layout].name;
    $('layoutNext').disabled = false;
    refreshDimensions();
  }));
  finishCards.forEach(card => card.addEventListener('click', () => {
    if (state.saving || !FINISHES[card.dataset.finish]) return;
    state.finish = card.dataset.finish;
    finishCards.forEach(item => { const selected = item === card; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    $('finishSelection').textContent = FINISHES[state.finish];
    $('finishNext').disabled = false;
    updateSummary(); updateMobile();
  }));
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', next));
  document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => { if (!state.saving) showStep(Number(button.dataset.back)); }));
  $('mobileNext').addEventListener('click', next);
  $('mobileBack').addEventListener('click', () => { if (!state.saving && state.step > 1) showStep(state.step - 1); });
  for (const key of ['A', 'B', 'C']) $('dimension' + key).addEventListener('input', refreshDimensions);
  document.querySelectorAll('.dimension-plus,.dimension-minus').forEach(button => button.addEventListener('click', () => {
    if (state.saving) return;
    const input = $(button.dataset.target);
    const direction = button.classList.contains('dimension-plus') ? 1 : -1;
    const value = Number(input.value);
    input.value = String(Math.min(30, Math.max(3, (Number.isFinite(value) ? value : 3) + direction)));
    refreshDimensions();
  }));

  function displaySaved() {
    const saved = state.saved;
    if (!saved?.id) return;
    const data = saved.data;


    panels.forEach(panel => panel.classList.remove('active'));
    $('estimateLoader').classList.remove('active');
    $('estimateResult').classList.add('active');
    $('resultId').textContent = saved.id;
    $('resultLayout').textContent = data.layout;
    $('resultMeasurements').textContent = data.measurements;
    $('resultRunning').textContent = `${data.runningFeet.toFixed(2)} Running Ft.`;
    $('resultFinish').textContent = data.finish;
    $('resultMeta').textContent = `${data.finish} • ${data.layout}`;
    $('sheetStatus').textContent = saved.sheetSynced
      ? ''
      : 'Saved in Firebase. Google Sheet sync is not yet confirmed.';
    $('retrySheet').hidden = saved.sheetSynced;
    $('retrySheet').disabled = state.sheetBusy;
    $('mobileEstimatorBar').style.display = 'none';
  }
  async function syncSheet() {
    if (!state.saved || state.sheetBusy) return;
    state.sheetBusy = true;
    $('retrySheet').disabled = true;
    $('sheetStatus').textContent = 'Saved in Firebase. Syncing Google Sheet…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(SHEET_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...state.saved.data, leadId: state.saved.id }),
        signal: controller.signal, redirect: 'follow'
      });
      if (!response.ok) throw new Error('Sheet request failed');
      const receipt = await response.json();
      if (!receipt.ok) throw new Error('Sheet save was not confirmed');
      state.saved.sheetSynced = true;
    } catch {
      // A browser/CORS timeout can happen after the server saved the row.
      // Never claim success or create another Firebase lead. Retry the SAME ID.
      state.saved.sheetSynced = false;
    } finally {
      clearTimeout(timer); state.sheetBusy = false; displaySaved();
    }
  }
  $('retrySheet').addEventListener('click', syncSheet);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (state.saving) return;
    $('formMessage').textContent = '';
    if (!state.layout) return showStep(1);
    if (!validDimensions(true)) return showStep(2);
    if (!state.finish) return showStep(3);
    if (!form.reportValidity()) return;
    let phone = $('customerPhone').value.replace(/\D/g, '');

    if (phone.length === 12 && phone.startsWith('91')) {
      phone = phone.slice(2);
    }

    $('customerPhone').value = phone;
    if (!/^[6-9]\d{9}$/.test(phone)) { $('formMessage').textContent = 'Enter a valid 10-digit Indian mobile number.'; $('customerPhone').focus(); return; }
    const email = $('customerEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  $("formMessage").textContent = "Enter a valid email address.";
  $("customerEmail").focus();
  return;
}
    const name = $('customerName').value.trim(), city = $('customerCity').value.trim();
    if (!name || !city) { $('formMessage').textContent = 'Enter your name and city.'; return; }
    const data = {
  formId: "kitchen_making_requirement",
  leadType: "calculator",
  calculatorType: "kitchen",
  source: "Kitchen Making Preference Form",

  name,
  phone,
  email,
  city,

  whatsapp: form.elements.whatsapp.checked,

  layoutKey: state.layout,
  layout: calculatorConfig.layouts[state.layout].name,

  dimensions: dimensions(),
  measurements: measurements(),
  runningFeet: length(),

  finishKey: state.finish,
  finish: FINISHES[state.finish],
  making: state.finish,

  package: FINISHES[state.finish]
};
    const fingerprint = JSON.stringify(data);
    state.saving = true;
    panels.forEach(panel => panel.classList.remove('active'));
    $('estimateLoader').classList.add('active');
    $('mobileEstimatorBar').style.display = 'none';
    document.querySelector('.estimator-main').scrollIntoView({ behavior: 'smooth' });
    try {
      if (!state.saved || state.saved.fingerprint !== fingerprint) {
        const result = await submitLead(data);
        if (!result?.ok || !result.id) throw new Error('Firebase save could not be confirmed.');
        state.saved = { id: result.id, data, fingerprint, sheetSynced: false };
      }
      displaySaved();
      if (!state.saved.sheetSynced) await syncSheet();
    } catch (error) {
      console.error(
        "Get Estimate Firebase error:",
        error?.code || "NO_ERROR_CODE",
        error?.message || "Unknown error"
      );

      showStep(4, false);

      $('formMessage').textContent =
        "Your details could not be saved. Please try again.";
    } finally {
      state.saving = false;
    }
  });
  $('startAgain').addEventListener('click', () => {
    if (state.saving || state.sheetBusy) return;
    if (state.saved && !state.saved.sheetSynced && !window.confirm('Google Sheet sync is unconfirmed. Start a new requirement anyway?')) return;
    state.saved = null; state.layout = null; state.finish = null;
    form.reset();
    layoutCards.forEach(el => { el.classList.remove('selected'); el.setAttribute('aria-pressed', 'false'); });
    finishCards.forEach(el => { el.classList.remove('selected'); el.setAttribute('aria-pressed', 'false'); });
    $('layoutNext').disabled = true; $('finishNext').disabled = true;
    $('layoutSelection').textContent = 'Select a kitchen layout';
    $('finishSelection').textContent = 'Select your making preference';
    $('formMessage').textContent = '';
    refreshDimensions(); showStep(1);
  });
  showStep(1, false); refreshDimensions();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
