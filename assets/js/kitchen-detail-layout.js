import { kitchenDesigns } from "./kitchen-designs.js";

/* =====================================================
   RESPONSIVE PAGE LAYOUT
===================================================== */

(() => {
  const root = document.documentElement;
  const title = document.querySelector("#designTitle");
  const hero = document.querySelector(".kd-main-image-wrap");
  const cost = document.querySelector(".kd-cost-card");
  const bar = document.querySelector("#stickyActionBar");

  if (!title || !hero || !cost) return;

  let pending = 0;

 function update() {
  pending = 0;

  const mobile = window.matchMedia(
    "(max-width: 700px)"
  ).matches;

  let size = mobile ? 24 : 30;
  const minimum = mobile ? 14 : 18;

  title.style.setProperty(
    "--kd-title-size",
    `${size}px`
  );

  while (
    title.scrollWidth > title.clientWidth + 1 &&
    size > minimum
  ) {
    size -= 0.25;

    title.style.setProperty(
      "--kd-title-size",
      `${size}px`
    );
  }

  title.title = title.textContent.trim();

  // Photo height is now controlled by CSS.
  // Details and calculator will not shrink it.
  root.style.removeProperty("--kd-hero-height");
}
  function schedule() {
    if (!pending) {
      pending = window.requestAnimationFrame(update);
    }
  }

  const resizeObserver = new ResizeObserver(schedule);

 [
  document.querySelector("#header-slot"),
  title.parentElement,
  document.querySelector(".kd-product-details"),
  cost,
  bar
]
    .filter(Boolean)
    .forEach(element => {
      resizeObserver.observe(element);
    });

  const titleObserver = new MutationObserver(schedule);

  titleObserver.observe(title, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener(
    "resize",
    schedule,
    { passive: true }
  );

  window.visualViewport?.addEventListener(
    "resize",
    schedule,
    { passive: true }
  );

  document.fonts?.ready.then(schedule);

  document.fonts?.addEventListener(
    "loadingdone",
    schedule
  );

  window.addEventListener(
    "load",
    schedule,
    { once: true }
  );

  schedule();
})();

/* =====================================================
   PERSONALISED DESIGN SHARING
   Reads the existing data module directly.
===================================================== */

(() => {
  const sendButton = document.querySelector("#sendDesign");

  if (!sendButton) return;

  const designs = Array.isArray(kitchenDesigns)
    ? kitchenDesigns
    : [];

  const slug = new URLSearchParams(
    window.location.search
  ).get("slug");

  const design =
    designs.find(item => item.slug === slug) ||
    designs[0];

  if (!design) {
    sendButton.disabled = true;
    sendButton.title = "Design data unavailable";
    return;
  }

  /* Avoid creating the popup twice. */
  if (document.querySelector("#econSendPopup")) return;

  const popup = document.createElement("dialog");

  popup.id = "econSendPopup";
  popup.className = "econ-send-popup";

  popup.setAttribute(
    "aria-labelledby",
    "econSendHeading"
  );

  popup.innerHTML = `
    <form method="dialog" class="econ-send-box">

      <button
        type="submit"
        class="econ-send-close"
        value="close"
        aria-label="Close sharing popup"
      >×</button>

      <h2 id="econSendHeading">
        Share Kitchen Design
      </h2>

      <label for="econClientName">
        Client name <small>(optional)</small>
      </label>

      <input
        id="econClientName"
        type="text"
        maxlength="60"
        placeholder="e.g. Navin"
        autocomplete="off"
      >

      <p class="econ-send-status" role="status">
        Preparing photo…
      </p>

      <button
        type="button"
        class="econ-send-photo"
        disabled
      >
        Share Photo + Details
      </button>

      <button
        type="button"
        class="econ-send-whatsapp"
      >
        WhatsApp: Text + Link
      </button>

      <button
        type="button"
        class="econ-send-copy"
      >
        Copy Message
      </button>

      <p class="econ-send-note">
        Photo sharing opens your phone’s share menu.
        Select WhatsApp and a contact.
      </p>

    </form>
  `;

  document.body.append(popup);

  const nameInput = popup.querySelector("#econClientName");

  const status = popup.querySelector(".econ-send-status");

  const photoButton = popup.querySelector(".econ-send-photo");

  const whatsappButton = popup.querySelector(
    ".econ-send-whatsapp"
  );

  const copyButton = popup.querySelector(".econ-send-copy");

  let photoFile = null;
  let preparingPhoto = false;
  let sharingPhoto = false;

  function getSpec(...keys) {
    const specifications = Array.isArray(
      design.specifications
    )
      ? design.specifications
      : [];

    for (const key of keys) {
      const specification = specifications.find(item => {
        const label = String(item.label || "")
          .replace(/:$/, "")
          .trim()
          .toLowerCase();

        return label === key;
      });

      const value = specification?.value || design[key];

      if (value !== undefined && value !== null) {
        const text = String(value).trim();

        if (text) return text;
      }
    }

    return "";
  }

  function buildMessage() {
    const clientName = nameInput.value
      .trim()
      .replace(/[\r\n*_<>`]/g, "");

    const designURL = new URL(window.location.href);

    designURL.hash = "";

    if (design.slug) {
      designURL.searchParams.set(
        "slug",
        design.slug
      );
    }

    const size = getSpec("size", "dimensions");
    const style = getSpec("style", "category");
    const finish = getSpec("finish");

    const details = [
      `📐 *Design:* ${design.title}`,
      size ? `↔️ *Size:* ${size}` : null,
      style ? `✨ *Style:* ${style}` : null,
      finish ? `🎨 *Finish:* ${finish}` : null
    ].filter(Boolean);

    return [
      `Namaste${clientName ? ` ${clientName} ji` : ""}! 👋`,
      "Aapke liye yeh Modular Kitchen Design select kiya hai. 🏡",
      "",
      ...details,
      "",
      "🔗 *Design dekhein:*",
      designURL.href,
      "",
      "Aapko yeh design kaisa laga? Koi changes ya estimate chahiye ho toh batayein. 😊",
      "",
      "*ECON Kitchen | Mathura • Vrindavan*"
    ].join("\n");
  }

  async function preparePhoto() {
    if (preparingPhoto || photoFile) return;

    preparingPhoto = true;

    status.textContent = "Preparing photo…";

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      if (!navigator.share || !navigator.canShare) {
        throw new Error("File sharing unavailable");
      }

      const imageSource =
        design.main_image ||
        (
          Array.isArray(design.images)
            ? design.images[0]
            : ""
        );

      if (!imageSource) {
        throw new Error("Design image missing");
      }

      const imageURL = new URL(
        imageSource,
        document.baseURI
      );

      const response = await fetch(imageURL, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Could not load image");
      }

      const blob = await response.blob();

      const imageType = blob.type
        .split(";")[0]
        .trim()
        .toLowerCase();

      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
      }[imageType];

      if (!extension) {
        throw new Error("Unsupported image format");
      }

      const file = new File(
        [blob],
        `econ-kitchen.${extension}`,
        { type: imageType }
      );

      if (!navigator.canShare({ files: [file] })) {
        throw new Error("Image sharing unsupported");
      }

      photoFile = file;
      photoButton.disabled = false;

      status.textContent =
        "Photo ready. Add a name, then choose how to share.";

    } catch {
      status.textContent =
        "Photo sharing is unavailable here. Use WhatsApp Text + Link.";

    } finally {
      window.clearTimeout(timer);
      preparingPhoto = false;
    }
  }

  sendButton.addEventListener("click", () => {
    if (!popup.open) {
      popup.showModal();
    }

    nameInput.focus();

    if (photoFile) {
      status.textContent =
        "Photo ready. Add a name, then choose how to share.";
    } else {
      preparePhoto();
    }
  });

  photoButton.addEventListener("click", async () => {
    if (!photoFile || sharingPhoto) return;

    sharingPhoto = true;
    photoButton.disabled = true;

    try {
      /* Called directly from the user's click. */
      await navigator.share({
        files: [photoFile],
        text: buildMessage()
      });

      status.textContent =
        "Returned from sharing. Check WhatsApp to confirm it was sent.";

    } catch (error) {
      if (error.name === "AbortError") {
        status.textContent = "Sharing cancelled.";
      } else {
        status.textContent =
          "Photo sharing failed. Use WhatsApp Text + Link.";
      }

    } finally {
      sharingPhoto = false;
      photoButton.disabled = false;
    }
  });

  whatsappButton.addEventListener("click", () => {
    const whatsappURL =
      "https://wa.me/?text=" +
      encodeURIComponent(buildMessage());

    window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );
  });

  copyButton.addEventListener("click", async () => {
    const message = buildMessage();

    try {
      await navigator.clipboard.writeText(message);

      status.textContent =
        "Message copied. Paste it into WhatsApp.";

    } catch {
      window.prompt(
        "Copy this message:",
        message
      );
    }
  });

  popup.addEventListener("close", () => {
    nameInput.value = "";
    sendButton.focus();
  });
})();