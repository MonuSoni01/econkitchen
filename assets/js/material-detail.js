/* =========================================================
   ECON KITCHEN â€” BUILD YOUR KITCHEN PAGE
   Categories + Products + Cart interaction
========================================================= */

const categories = [
  {
    title: "Plywood & Boards",
    slug: "plywood-boards",
    image: "/assets/images/material/category/Plywood & Boards.webp"
  },
  {
    title: "Laminates",
    slug: "laminates",
    image: "/assets/images/material/category/Laminates.webp"
  },
  {
    title: "Acrylic Panels",
    slug: "acrylic-panels",
    image: "/assets/images/material/category/Acrylic Panels.webp"
  },
  {
    title: "Edge Band",
    slug: "edge-band",
    image: "/assets/images/material/category/Edge Band.webp"
  },
  {
    title: "Adhesives",
    slug: "adhesives",
    image: "/assets/images/material/category/Adhesives.webp"
  },
  {
    title: "Hardware",
    slug: "hardware",
    image: "/assets/images/material/category/Hardware.webp"
  },
  {
    title: "Kitchen Accessories",
    slug: "kitchen-accessories",
    image: "/assets/images/material/category/Kitchen Accessories.webp"
  },
  {
    title: "CNC Components",
    slug: "cnc-components",
    image: "/assets/images/material/category/CNC Components.webp"
  }
];
const products = [
  {
    id: "BYK-BWP-18",
    title: "BWP Plywood 18mm",
    sub: "Commercial / Kitchen Grade",
    price: 2450,
    unit: "Sheet",
    rating: "4.8",
    reviews: 120,
    badge: "Bestseller",
    image: "/assets/images/material/products/BWP Plywood 18mm.webp"
  },
  {
    id: "BYK-HDHMR-18",
    title: "HDHMR Board 18mm",
    sub: "Kitchen Board",
    price: 2950,
    unit: "Sheet",
    rating: "4.7",
    reviews: 95,
    image: "/assets/images/material/products/HDHMR Board 18mm.webp"
  },
  {
    id: "BYK-LAM-8X4",
    title: "Laminate Sheet 1mm",
    sub: "8x4",
    price: 4800,
    unit: "Sheet",
    rating: "4.8",
    reviews: 210,
    badge: "New",
    badgeClass: "new",
    image: "/assets/images/material/products/Laminate Sheet 1mm.webp"
  },
  {
    id: "BYK-ACR-18",
    title: "Acrylic Sheet 18mm",
    sub: "8x4",
    price: 6200,
    unit: "Sheet",
    rating: "4.9",
    reviews: 86,
    image: "/assets/images/material/products/Acrylic Sheet 18mm.webp"
  },
  {
    id: "BYK-EDGE-22",
    title: "PVC Edge Band 22mm",
    sub: "100 Meter",
    price: 650,
    unit: "Roll",
    rating: "4.6",
    reviews: 75,
    image: "/assets/images/material/products/PVC Edge Band 22mm.webp"
  },
  {
    id: "BYK-HINGE-SC",
    title: "Soft Close Hinge",
    sub: "1 Pc",
    price: 320,
    unit: "Pc",
    rating: "4.8",
    reviews: 310,
    badge: "Bestseller",
    image: "/assets/images/material/products/Soft Close Hinge.webp"
  }
];
const categoryGrid = document.querySelector("#bykCategoryGrid");
const productGrid = document.querySelector("#bykProductGrid");
const toast = document.querySelector("#bykToast");

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderCategories() {
  if (!categoryGrid) return;

  categoryGrid.innerHTML = categories.map(category => `
    <a class="byk-category-card" href="#">
      <div class="byk-category-image">
        <img src="${category.image}" alt="${category.title}" loading="lazy">
      </div>
      <h3>${category.title}</h3>
    </a>
  `).join("");
}

function renderProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = products.map(product => `
    <article class="byk-product-card">
      <a href="/e-com/product-detail.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.title}">
        <div class="byk-product-media">
          ${product.badge ? `<span class="byk-product-badge ${product.badgeClass || ""}">${product.badge}</span>` : ""}
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
      </a>
      <div class="byk-product-content">
        <h3 class="byk-product-title">${product.title}<br><small>${product.sub}</small></h3>
        <div class="byk-product-price">${money(product.price)} <small>/ ${product.unit}</small></div>
        <div class="byk-rating">
          <span><i class="fa-solid fa-star"></i> ${product.rating}</span>
          <span>(${product.reviews} reviews)</span>
        </div>
        <button class="byk-add-cart" type="button" data-product-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>
  `).join("");
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("econCart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) existing.qty += 1;
  else cart.push({
    id: product.id,
    title: product.title,
    price: product.price,
    unit: product.unit,
    image: product.image,
    qty: 1
  });

  localStorage.setItem("econCart", JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("econ:cart-updated", { detail: { cart } }));
  showToast(`${product.title} added to cart.`);
}

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>${message}`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function bindEvents() {
  document.addEventListener("click", event => {
    const btn = event.target.closest(".byk-add-cart");
    if (!btn) return;
    addToCart(btn.dataset.productId);
  });
}

renderCategories();
renderProducts();
bindEvents();