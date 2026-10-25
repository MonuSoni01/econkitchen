/* =====================================================
   ECONDIY — SERVICE ENQUIRY POPUP

   Uses existing:
   /assets/js/firebase.js → submitLead()

   Saves to:
   Firestore → leads

   This collects enquiries only.
   It does not collect payment or send API templates.
===================================================== */

(() => {
  "use strict";

  if (window.__econDiyFormLoaded) return;

  const dialog = document.getElementById("diyEnquiryDialog");
  const form = document.getElementById("diyEnquiryForm");

  if (!dialog || !form) return;

  window.__econDiyFormLoaded = true;

  const title = document.getElementById("diyEnquiryTitle");
  const description = document.getElementById(
    "diyEnquiryDescription"
  );
  const note = document.getElementById("diyEnquiryNote");
  const content = document.getElementById("diyEnquiryContent");
  const success = document.getElementById("diyEnquirySuccess");
  const status = document.getElementById("diyEnquiryStatus");
  const submit = document.getElementById("diyEnquirySubmit");
  const close = document.getElementById("diyEnquiryClose");
  const done = document.getElementById("diyEnquiryDone");
  const reference = document.getElementById(
    "diyEnquiryReference"
  );
  const successTitle = document.getElementById(
    "diyEnquirySuccessTitle"
  );

  const services = {
    quote: {
      title: "Free Kitchen Quotation Compare",
      description:
        "Share your details for a free review of your kitchen quotation.",
      note:
        "Our team will contact you to collect your quotation and discuss your requirements.",
      formId: "econdiy_quotation_compare",
      source: "ECONDIY Free Quotation Compare",
      service: "Free Quotation Compare"
    },

    blueprint: {
      title: "DIY Kitchen Blueprint — ₹5,000",
      description:
        "Share your details to start planning your kitchen.",
      note:
        "This submits your enquiry. Our team will explain the ₹5,000 package and payment process.",
      formId: "econdiy_blueprint",
      source: "ECONDIY Kitchen Blueprint",
      service: "DIY Kitchen Blueprint"
    }
  };

  let activeService = null;
  let saving = false;
  let trigger = null;
  let firebasePromise = null;
  let previousOverflow = "";

  function normalisePhone(value) {
    let digits = String(value || "").replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    } else if (
      digits.length === 11 &&
      digits.startsWith("0")
    ) {
      digits = digits.slice(1);
    }

    return digits;
  }

  async function getFirebaseModule() {
    if (!firebasePromise) {
      firebasePromise = import("./firebase.js").catch(error => {
        firebasePromise = null;
        throw error;
      });
    }

    return firebasePromise;
  }

  function openForm(serviceKey, button) {
    const config = services[serviceKey];

    if (!config || saving) return;

    activeService = serviceKey;
    trigger = button;

    form.reset();
    form.elements.phone.setCustomValidity("");

    title.textContent = config.title;
    description.textContent = config.description;
    note.textContent = config.note;

    content.hidden = false;
    success.hidden = true;
    status.textContent = "";
    reference.textContent = "";

    submit.disabled = false;
    submit.textContent = "Submit My Request →";
    close.disabled = false;

    if (!dialog.open) {
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }

    form.elements.name.focus();
  }

  function closeForm() {
    if (saving) return;
    dialog.close();
  }

  /*
   * Capture the existing service links before their normal
   * WhatsApp navigation. Works for top and bottom buttons.
   */
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(
      '.diy-page [data-wa="quote"], ' +
      '.diy-page [data-wa="blueprint"]'
    );

    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    openForm(button.dataset.wa, button);
  }, true);

  close.addEventListener("click", closeForm);
  done.addEventListener("click", closeForm);

  dialog.addEventListener("cancel", event => {
    if (saving) event.preventDefault();
  });

  dialog.addEventListener("click", event => {
    if (event.target !== dialog || saving) return;

    const bounds = dialog.getBoundingClientRect();

    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) closeForm();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;

    if (trigger?.isConnected) {
      trigger.focus();
    }
  });

  form.elements.phone.addEventListener("input", () => {
    form.elements.phone.setCustomValidity("");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (saving || !services[activeService]) return;

    status.textContent = "";

    const name = form.elements.name.value.trim();
    const phone = normalisePhone(
      form.elements.phone.value
    );
    const city = form.elements.city.value.trim();

    if (!form.reportValidity()) return;

    if (name.length < 2 || !city) {
      status.textContent =
        "Please enter your full name and city.";
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      form.elements.phone.setCustomValidity(
        "Please enter a valid 10-digit Indian mobile number."
      );
      form.elements.phone.reportValidity();
      return;
    }

    const config = services[activeService];

    const payload = {
      name,
      phone,
      city,

      kitchenSize:
        form.elements.kitchenSize.value.trim(),

      message:
        form.elements.message.value.trim(),

      formId: config.formId,
      leadType: "enquiry",
      source: config.source,
      service: config.service
    };

    if (activeService === "blueprint") {
      payload.packagePrice = 5000;
      payload.currency = "INR";
      payload.paymentStatus = "not_collected";
    }

    saving = true;
    submit.disabled = true;
    close.disabled = true;
    submit.textContent = "Submitting…";
    form.setAttribute("aria-busy", "true");

    let savedId = null;

    try {
      const firebaseModule = await getFirebaseModule();

      if (typeof firebaseModule.submitLead !== "function") {
        throw new Error("submitLead is unavailable.");
      }

      const result = await firebaseModule.submitLead(payload);

      if (!result || result.ok !== true) {
        throw new Error("Firebase did not confirm the save.");
      }

      savedId = result.id || "";

    } catch (error) {
      console.error(
        "ECONDIY enquiry submission:",
        error?.code || error?.message || "Unknown error"
      );

      status.textContent =
        "Your request could not be submitted. " +
        "Please check your connection and try again. " +
        "Your details are still in the form.";

    } finally {
      saving = false;
      submit.disabled = false;
      close.disabled = false;
      submit.textContent = "Submit My Request →";
      form.removeAttribute("aria-busy");
    }

    /*
     * Show success only after Firebase confirms the save.
     * Keep UI changes separate from database error handling.
     */
    if (savedId !== null) {
      form.reset();

      reference.textContent = savedId
        ? "Request ID: " + savedId
        : "";

      content.hidden = true;
      success.hidden = false;
      successTitle.focus();
    }
  });
})();