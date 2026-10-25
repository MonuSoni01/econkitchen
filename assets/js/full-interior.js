/* ECON — Full Interior page. Firebase is loaded only when submitting a lead. */
import {
  fullInteriorDesigns, interiorSections, interiorCategories,
  fullInteriorPackages
} from "./data/full-interior-designs.js";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value ?? "").replace(/[&<>"']/g, char =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const titleCase = text => text.charAt(0).toUpperCase() + text.slice(1);
const state = {category:"all", series:"all", limit:fullInteriorDesigns.length};
const favouriteKey = "econFullInteriorFavourites";
let favourites = [];
try {
  const stored = JSON.parse(localStorage.getItem(favouriteKey) || "[]");
  if (Array.isArray(stored)) favourites = stored.filter(Number.isInteger);
} catch { /* Storage is optional; designs remain usable. */ }
// Round-robin categories keep the continuous feed visually varied.
const buckets = interiorCategories.filter(c => c[0] !== "all").map(
  ([key]) => fullInteriorDesigns.filter(d => d.category === key)
);
const allDesigns = [];
while (buckets.some(bucket => bucket.length)) {
  buckets.forEach(bucket => {if (bucket.length) allDesigns.push(bucket.shift());});
}
function card(item) {
  const url = `/full-interior-design.html?slug=${encodeURIComponent(item.slug)}`;
  const saved = favourites.includes(item.id);
  return `<article class="fi-project-card" data-url="${esc(url)}">
    <a class="fi-project-image-wrap" href="${esc(url)}" aria-label="View ${esc(item.title)}">
      <img class="fi-project-image" src="${esc(item.image)}" alt="${esc(item.title)} — reference image" loading="lazy" decoding="async">
      <span class="fi-project-badge">${esc(item.badge)}</span><span class="fi-project-open" aria-hidden="true">↗</span>
    </a>
    <div class="fi-project-content">
      <span class="fi-project-category">${esc(item.categoryLabel)}</span>
      <h3 class="fi-project-title"><a href="${esc(url)}">${esc(item.title)}</a></h3>
      <div class="fi-project-details"><span><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i>${esc(item.size)}</span>
        <button class="fi-save ${saved ? "active" : ""}" type="button" data-favourite="${item.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove" : "Save"} ${esc(item.title)}"><i class="fa-${saved ? "solid" : "regular"} fa-heart" aria-hidden="true"></i></button>
      </div>
      <div class="fi-project-actions"><a class="fi-button" href="#consultation" data-enquire="${item.id}">Book Consultation</a>
        <a class="fi-button fi-outline" href="/calculators/interior.html">Get Quote</a></div>
    </div></article>`;
}
const promoOrder = ["kitchen","wardrobe","doors","mandir","tv-unit","pvc-panel","cnc","bedroom","living-room"];
function promoTile(key) {
  const section = interiorSections.find(s => s.key === key);
  return `<aside class="fi-inline-promo" data-promo="${key}">
    <i class="fa-solid ${esc(section.icon)}" aria-hidden="true"></i>
    <span class="fi-eyebrow">PLAN YOUR ${esc(section.label.toUpperCase())}</span>
    <h3>${esc(section.title)}</h3><p>${esc(section.description)}</p>
    <button type="button" class="fi-button" data-promo-category="${key}">Explore ${esc(section.label)} ↗</button>
  </aside>`;
}
function collectionStrip() {
  return `<section class="fi-inline-collection" id="collections" data-discovery="collections">
    <div><span class="fi-eyebrow">CURATED COLLECTIONS</span><h2>Find your <em>Collection.</em></h2></div>
    <div class="fi-pills" id="interiorSeriesFilters">${[
      ["all","All Collections"],["essential","Essential"],["premium","Premium"],["signature","Signature"]
    ].map(([value,label]) => `<button class="fi-pill ${state.series === value ? "active" : ""}" type="button" data-series="${value}" aria-pressed="${state.series === value}">${label}</button>`).join("")}</div>
  </section>`;
}
function catalogueBanner() {
  return `<section class="fi-custom-banner" id="fiCatalogue" data-discovery="collections">
    <a href="/catalogue.html"><picture>
      <source media="(max-width:768px)" srcset="/assets/images/cat-01.png">
      <img src="/assets/images/cat-02.png" alt="Explore the ECON Catalogue" loading="lazy" decoding="async">
    </picture></a></section>`;
}
function trendingStrip(items) {
  return `<section class="fi-trending" id="fiTrending" data-discovery="materials">
    <header><div><span class="fi-eyebrow">DESIGN INSPIRATION</span><h2>Trending Interior <em>Ideas.</em></h2><p>Selected concepts to help you plan your home.</p></div>
      <div class="fi-trending-arrows"><button type="button" data-trend-direction="-1" aria-label="Previous design">←</button><button type="button" data-trend-direction="1" aria-label="Next design">→</button></div></header>
    <div class="fi-trending-track">${items.slice(0,3).map(item => `<article>
      <a href="/full-interior-design.html?slug=${encodeURIComponent(item.slug)}"><img src="${esc(item.image)}" alt="${esc(item.title)} — reference image" loading="lazy"><h3>${esc(item.title)}</h3></a>
      <a class="fi-button fi-outline" href="#consultation" data-enquire="${item.id}">Book Consultation</a>
    </article>`).join("")}</div></section>`;
}
function activate(buttons, selected) {
  buttons.forEach(button => {
    const active = button === selected;
    button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));
  });
}
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth",block:"start"});
}
function renderOpening() {
  const matches = allDesigns.filter(d =>
    (state.category === "all" || d.category === state.category) &&
    (state.series === "all" || d.series === state.series));
  const visible = matches.slice(0,state.limit);
  let markup = "";
  for (let start = 0; start < visible.length; start += 9) {
    const batch = visible.slice(start,start+9);
    const run = start / 9;
    markup += '<div class="fi-editorial-run" data-discovery="spaces">';
    batch.forEach((item,index) => {
      markup += card(item);
      if (index === 2 || index === 6) {
        markup += promoTile(promoOrder[(run*2+(index === 6 ? 1 : 0)) % promoOrder.length]);
      }
    });
    markup += '</div>';
    if (run === 0) markup += trendingStrip(matches);
    if (run === 1) markup += catalogueBanner() + collectionStrip();
  }
  if (!visible.length) markup = '<div class="fi-empty">No designs found. Choose another category or collection.</div>';
  if (visible.length <= 9) markup += catalogueBanner() + collectionStrip();
  $("#fullInteriorProjectGrid").innerHTML = markup;
  $("#interiorResultTitle").textContent = state.category === "all" ? "Explore Interior Designs" :
    `${interiorCategories.find(c => c[0] === state.category)?.[1]} Designs`;
  $("#interiorResultCount").textContent = `${visible.length} of ${matches.length} Designs`;
  $("#fullInteriorLoadMore").hidden = visible.length >= matches.length;
  observeSections();
}
$("#interiorFilters").innerHTML = interiorCategories.map(([key,label]) =>
  `<button type="button" class="fi-pill ${key === "all" ? "active" : ""}" data-category="${key}" aria-pressed="${key === "all"}">${label}</button>`).join("");
$("#fiService").innerHTML = interiorCategories.filter(c => c[0] !== "all").map(([key,label]) => `<option value="${key}">${label}</option>`).join(""); let observer;
function observeSections() {
  if (!("IntersectionObserver" in window)) return;
  observer?.disconnect();
  const visible = new Map();
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.set(entry.target,entry.intersectionRatio) : visible.delete(entry.target));
    const current = [...visible].sort((a,b) => b[1]-a[1])[0]?.[0];
    if (current) $$("[data-nav]").forEach(button => {
      const active = button.dataset.nav === current.dataset.discovery;
      button.classList.toggle("active",active);
      if (active) button.setAttribute("aria-current","location");else button.removeAttribute("aria-current");
    });
  },{rootMargin:"-15% 0px -45% 0px",threshold:[0,.1,.3,.5]});
  $$("[data-discovery]").forEach(section => observer.observe(section));
}
renderOpening();
$("#fullInteriorLoadMore").addEventListener("click",() => {state.limit += 9; renderOpening();});
function updateSavedButtons() {
  $$("[data-favourite]").forEach(button => {
    const id = Number(button.dataset.favourite);const saved = favourites.includes(id);
    const design = fullInteriorDesigns.find(d => d.id === id);
    button.classList.toggle("active",saved);button.setAttribute("aria-pressed",String(saved));
    button.setAttribute("aria-label",`${saved ? "Remove" : "Save"} ${design.title}`);
    button.querySelector("i").className = `fa-${saved ? "solid" : "regular"} fa-heart`;
  });
}
function chooseCategory(key) {
  state.category = key;state.limit = fullInteriorDesigns.length;
  activate($$("#interiorFilters button"),$(`[data-category="${key}"]`));
  renderOpening();scrollToId("interiorResultTitle");
}
document.addEventListener("click",event => {
  const category = event.target.closest("[data-category],[data-promo-category]");
  if (category) {chooseCategory(category.dataset.category || category.dataset.promoCategory);return;}
  const series = event.target.closest("[data-series]");
  if (series) {state.series = series.dataset.series;state.limit = fullInteriorDesigns.length;renderOpening();scrollToId("interiorResultTitle");return;}
  const arrow = event.target.closest("[data-trend-direction]");
  if (arrow) {
    const track = arrow.closest(".fi-trending").querySelector(".fi-trending-track");
    track.scrollBy({left:track.clientWidth * Number(arrow.dataset.trendDirection),behavior:matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth"});return;
  }
  const save = event.target.closest("[data-favourite]");
  if (save) {
    const id = Number(save.dataset.favourite);
    favourites = favourites.includes(id) ? favourites.filter(item => item !== id) : [...favourites,id];
    try {localStorage.setItem(favouriteKey,JSON.stringify(favourites));} catch {}
    updateSavedButtons();return;
  }
  const enquiry = event.target.closest("[data-enquire]");
  if (enquiry) {
    const design = fullInteriorDesigns.find(d => d.id === Number(enquiry.dataset.enquire));
    if (design) {$("#fiService").value = design.category;if (!$("#fiMessage").value.trim()) $("#fiMessage").value = `I am interested in ${design.title}.`;}
  }
  const nav = event.target.closest("[data-scroll]");
  if (nav) {scrollToId(nav.dataset.scroll);return;}
  const link = event.target.closest('a[href^="#"]');
  if (link && link.hash.length > 1 && document.getElementById(link.hash.slice(1))) {
    event.preventDefault();scrollToId(link.hash.slice(1));return;
  }
  const project = event.target.closest(".fi-project-card");
  if (project && !event.target.closest("a,button")) window.location.href = project.dataset.url;
});
$("#resetInteriorFilters").addEventListener("click",() => {
  Object.assign(state,{category:"all",series:"all",limit:fullInteriorDesigns.length});
  activate($$("#interiorFilters button"),$('[data-category="all"]'));
  renderOpening();scrollToId("collection");
});

// A failed reference image gets a stable placeholder, never a repeating error loop.
const placeholder = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700"><rect width="1000" height="700" fill="#eee9df"/><text x="500" y="350" text-anchor="middle" fill="#7a6842" font-family="Arial" font-size="36">ECON Interior Preview</text></svg>');
document.addEventListener("error", event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.closest("main") || image.dataset.fallback) return;
  image.dataset.fallback = "true";
  if (image.closest(".fi-custom-banner")) {
    const link = image.closest("a"); link.className = "fi-banner-fallback";
    link.textContent = "Explore the ECON Catalogue ↗";
  } else image.src = placeholder;
}, true);
const form = $("#fullInteriorConsultationForm");
const submit = $("#fullInteriorSubmitBtn");
const status = $("#fiFormStatus");
const popup = $("#fullInteriorThankYouPopup");
let sending = false;
let firebasePromise;
function getFirebase() {
  if (!firebasePromise) firebasePromise = Promise.all([
    import("./firebase.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
  ]).catch(error => {firebasePromise = undefined; throw error;});
  return firebasePromise;
}
function phoneNumber(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}
function fieldError(input, message) {
  const field = input.closest(".fi-field");
  field.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  const error = field.querySelector(".fi-error");
  if (error) {error.textContent = message; input.setAttribute("aria-describedby", error.id);}
}
form.addEventListener("input", event => {
  if (event.target.closest(".fi-field")) fieldError(event.target, "");
});
$("#fiPhone").addEventListener("blur", event => {event.target.value = phoneNumber(event.target.value);});
form.addEventListener("submit", async event => {
  event.preventDefault(); if (sending) return;
  status.textContent = "";
  $("#fiPhone").value = phoneNumber($("#fiPhone").value);
  const checks = [
    [$("#fiName"), $("#fiName").value.trim().length >= 2, "Please enter your name."],
    [$("#fiPhone"), /^[6-9]\d{9}$/.test($("#fiPhone").value), "Enter a valid 10-digit Indian mobile number."],
    [$("#fiEmail"), Boolean($("#fiEmail").value.trim()) && $("#fiEmail").checkValidity(), "Enter a valid email address."],
    [$("#fiCity"), $("#fiCity").value.trim().length >= 2, "Please enter your city."]
  ];
  checks.forEach(([input, valid, message]) => fieldError(input, valid ? "" : message));
  const invalid = checks.find(check => !check[1]);
  if (invalid) {invalid[0].focus(); return;}
  sending = true; submit.disabled = true; submit.setAttribute("aria-busy","true");
  submit.querySelector("span").textContent = "SAVING YOUR ENQUIRY...";
  try {
    const [{db},{addDoc,collection,serverTimestamp}] = await getFirebase();
    if (!db) throw new Error("Firebase db export is unavailable.");
    const values = new FormData(form);
    const payload = Object.fromEntries(["name","phone","email","city","message"].map(key => [key,String(values.get(key) || "").trim()]));
    payload.service = interiorCategories.find(c => c[0] === values.get("service"))?.[1] || "Full Home";
    Object.assign(payload,{source:"Full Interior Consultation",page:window.location.pathname,status:"new",createdAt:serverTimestamp()});
    await addDoc(collection(db,"leads"),payload);
    form.reset(); popup.showModal();
  } catch (error) {
    console.error("Interior enquiry could not be saved:",error);
    status.textContent = "Your enquiry could not be saved. Please try again or contact us directly.";
  } finally {
    sending = false; submit.disabled = false; submit.removeAttribute("aria-busy");
    submit.querySelector("span").textContent = "GET FREE CONSULTATION";
  }
});
$$("[data-close-dialog]").forEach(button => button.addEventListener("click", () => popup.close()));
popup.addEventListener("click", event => {if (event.target === popup) popup.close();});
popup.addEventListener("close", () => submit.focus());