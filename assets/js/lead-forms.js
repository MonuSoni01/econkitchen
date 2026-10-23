/* =========================================================
   ECON KITCHEN — SHARED ENQUIRY FORMS
   File: /assets/js/lead-forms.js

   Requires:
   /assets/js/firebase.js → exported submitLead()

   Handles:
   1. Contact
   2. Modular Kitchen Consultation
   3. Full Interior Consultation
   4. Wardrobe Consultation
   5. ECON BOX Partner Enquiry
   6. Shutters Partner Enquiry

   Calculators retain their separate submission handlers.
========================================================= */

(() => {
    "use strict";

    // Avoid duplicate handlers if this script is included twice.
    if (window.__econLeadFormsLoaded) return;

    window.__econLeadFormsLoaded = true;

    const MIN_LOADING_TIME = 3000;

    const FORM_CONFIG = {
        leadForm: {
            formId: "contact_consultation",
            leadType: "consultation",
            source: "Contact Consultation"
        },

        mkConsultationForm: {
            formId: "kitchen_consultation",
            leadType: "consultation",
            source: "Modular Kitchen Consultation"
        },

        fullInteriorConsultationForm: {
            formId: "interior_consultation",
            leadType: "consultation",
            source: "Full Interior Consultation"
        },

        wardrobeConsultationForm: {
            formId: "wardrobe_consultation",
            leadType: "consultation",
            source: "Wardrobe Consultation"
        },

        econBoxDealerForm: {
            formId: "box_partner",
            leadType: "business",
            source: "ECON BOX Partner Enquiry"
        },

        econShutterForm: {
            formId: "shutter_partner",
            leadType: "business",
            source: "Shutters Business Enquiry"
        }
    };

    let submissionInProgress = false;
    let firebaseModulePromise = null;
    let returnFocusTarget = null;

    /* =====================================================
       LOAD FIREBASE ONLY WHEN SUBMITTING

       The event handler is installed before Firebase loads.
       An import error therefore shows an error message
       instead of allowing a normal GET form submission.
    ===================================================== */

    async function saveLead(payload) {
        if (!firebaseModulePromise) {
            firebaseModulePromise = import("./firebase.js").catch(error => {
                firebaseModulePromise = null;
                throw error;
            });
        }

        const firebaseModule = await firebaseModulePromise;

        if (typeof firebaseModule.submitLead !== "function") {
            throw new Error(
                "firebase.js must export a submitLead function."
            );
        }

        const result = await firebaseModule.submitLead(payload);

        if (!result || result.ok !== true) {
            throw new Error(
                "Firebase did not confirm that the enquiry was saved."
            );
        }

        return result;
    }

    /* =====================================================
       HELPERS
    ===================================================== */

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

    function wait(milliseconds) {
        return new Promise(resolve => {
            window.setTimeout(resolve, milliseconds);
        });
    }

    function getStatusElement(form) {
        let status = form.querySelector("[data-lead-status]");

        if (!status) {
            status = document.createElement("p");
            status.dataset.leadStatus = "";

            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");

            status.style.cssText = `
                margin: 14px 0 0;
                font-size: 13px;
                line-height: 1.7;
            `;

            form.appendChild(status);
        }

        return status;
    }

    function showFormError(form, message) {
        const status = getStatusElement(form);

        status.style.color = "#b04437";
        status.textContent = message;
    }

    function readFormData(form) {
        const data = {};

        for (const [key, value] of new FormData(form).entries()) {
            // These enquiry forms contain text fields.
            if (typeof value !== "string") continue;

            const cleanValue = value.trim();

            if (Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = Array.isArray(data[key])
                    ? [...data[key], cleanValue]
                    : [data[key], cleanValue];
            } else {
                data[key] = cleanValue;
            }
        }

        // Include false as well as true for individual checkboxes.
        form.querySelectorAll(
            'input[type="checkbox"][name]'
        ).forEach(checkbox => {
            const matchingFields = Array.from(form.elements).filter(
                element => element.name === checkbox.name
            );

            if (matchingFields.length === 1) {
                data[checkbox.name] = checkbox.checked;
            }
        });

        return data;
    }

    function validateForm(form, data) {
        if (!form.reportValidity()) {
            return false;
        }

        const name = String(data.name || "").trim();
        const phone = normalisePhone(data.phone);
        const email = String(data.email || "").trim();

        if (name.length < 2) {
            showFormError(
                form,
                "Please enter your full name."
            );

            form.querySelector('[name="name"]')?.focus();
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            showFormError(
                form,
                "Please enter a valid 10-digit Indian mobile number."
            );

            form.querySelector('[name="phone"]')?.focus();
            return false;
        }

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            showFormError(
                form,
                "Please enter a valid email address."
            );

            form.querySelector('[name="email"]')?.focus();
            return false;
        }

        data.name = name;
        data.phone = phone;

        if ("email" in data) {
            data.email = email;
        }

        return true;
    }

    /* =====================================================
       POPUP STYLES
    ===================================================== */

    function installPopupStyles() {
        if (document.getElementById("econLeadPopupStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "econLeadPopupStyles";

        style.textContent = `
            #leadThankYouPopup {
                position: fixed;
                inset: 0;
                margin: auto;

                box-sizing: border-box;
                width: min(430px, calc(100% - 32px));

                max-height: calc(100vh - 40px);
                max-height: calc(100dvh - 40px);

                padding: 0;
                overflow: auto;

                background: #fffdf9;
                border: 1px solid #eadfc9;
                border-radius: 24px;

                color: #202721;
                text-align: center;

                font-family: "Segoe UI", Arial, sans-serif;

                box-shadow:
                    0 30px 100px rgba(0, 0, 0, .25);
            }

            #leadThankYouPopup,
            #leadThankYouPopup * {
                box-sizing: border-box;
            }

            #leadThankYouPopup::backdrop {
                background: rgba(15, 21, 17, .68);
                backdrop-filter: blur(5px);
            }

            #leadThankYouPopup .lp-topline {
                height: 5px;
                background: linear-gradient(
                    90deg,
                    #d9c294,
                    #a77e3c,
                    #e6d4b0
                );
            }

            #leadThankYouPopup .lp-content {
                padding: 32px 30px 30px;
            }

            #leadThankYouPopup .lp-brand {
                margin: 0 0 26px;
                padding: 0;

                color: #98743b;
                font-size: 10px;
                font-weight: 700;
                line-height: 1.5;
                letter-spacing: 3px;
            }

            #leadThankYouPopup .lp-icon {
                display: grid;
                place-items: center;

                width: 78px;
                height: 78px;
                margin: 0 auto 24px;

                background: #f6efdf;
                border: 1px solid #e8d8b8;
                border-radius: 50%;

                color: #98743b;
                box-shadow: 0 0 0 8px #fbf7ef;
            }

            #leadThankYouPopup .lp-spinner {
                display: block;

                width: 31px;
                height: 31px;

                border: 3px solid #e7d8bb;
                border-top-color: #98743b;
                border-radius: 50%;

                animation: econLeadSpin .8s linear infinite;
            }

            #leadThankYouPopup h2 {
                margin: 0 0 13px;
                padding: 0;

                color: #202721;

                font-family: inherit;
                font-size: 29px;
                font-weight: 650;

                letter-spacing: -.8px;
                line-height: 1.25;

                text-transform: none;
            }

            #leadThankYouPopup .lp-description {
                max-width: 320px;
                margin: 0 auto;
                padding: 0;

                color: #73796f;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.85;
                letter-spacing: normal;
            }

            #leadThankYouPopup .lp-footer {
                margin-top: 27px;
                padding-top: 18px;

                border-top: 1px solid #eee5d6;

                color: #93978c;
                font-size: 11px;
                line-height: 1.6;
            }

            #leadThankYouPopup .lp-close {
                display: block;

                width: 100%;
                min-height: 48px;
                margin: 25px 0 0;
                padding: 13px 20px;

                background: #202b22;
                border: 0;
                border-radius: 12px;

                color: #fff;

                font-family: inherit;
                font-size: 13px;
                font-weight: 600;
                line-height: 1.5;

                cursor: pointer;
                transition: background .2s ease;
            }

            #leadThankYouPopup .lp-close:hover {
                background: #344436;
            }

            #leadThankYouPopup .lp-close:focus-visible {
                outline: 3px solid #bc9650;
                outline-offset: 4px;
            }

            @keyframes econLeadSpin {
                to {
                    transform: rotate(360deg);
                }
            }

            @media (max-width: 480px) {
                #leadThankYouPopup {
                    border-radius: 20px;
                }

                #leadThankYouPopup .lp-content {
                    padding: 29px 23px 25px;
                }

                #leadThankYouPopup h2 {
                    font-size: 25px;
                }

                #leadThankYouPopup .lp-description {
                    font-size: 13px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #leadThankYouPopup .lp-spinner {
                    animation: none;
                }

                #leadThankYouPopup .lp-close {
                    transition: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* =====================================================
       CREATE POPUP
    ===================================================== */

    function getLeadPopup() {
        installPopupStyles();

        let popup = document.getElementById(
            "leadThankYouPopup"
        );

        if (popup) return popup;

        popup = document.createElement("dialog");

        popup.id = "leadThankYouPopup";

        popup.setAttribute(
            "aria-labelledby",
            "econLeadPopupTitle"
        );

        popup.setAttribute(
            "aria-describedby",
            "econLeadPopupDescription"
        );

        popup.addEventListener("cancel", event => {
            if (popup.dataset.loading === "true") {
                event.preventDefault();
            }
        });

        popup.addEventListener("close", () => {
            if (returnFocusTarget?.isConnected) {
                returnFocusTarget.focus();
            }
        });

        document.body.appendChild(popup);

        return popup;
    }

    /* =====================================================
       LOADING / SUCCESS POPUP
    ===================================================== */

    function showLeadPopup(mode) {
        const popup = getLeadPopup();
        const loading = mode === "loading";

        popup.dataset.loading = String(loading);

        popup.setAttribute(
            "aria-busy",
            String(loading)
        );

        popup.innerHTML = `
            <div class="lp-topline" aria-hidden="true"></div>

            <div class="lp-content">

                <p class="lp-brand">ECON KITCHEN</p>

                <div class="lp-icon" aria-hidden="true">
                    ${
                        loading
                            ? `
                                <span class="lp-spinner"></span>
                            `
                            : `
                                <svg
                                    width="35"
                                    height="35"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m5 12 4 4L19 6"></path>
                                </svg>
                            `
                    }
                </div>

                <div role="status" aria-live="polite">

                    <h2
                        id="econLeadPopupTitle"
                        tabindex="-1"
                    >
                        ${
                            loading
                                ? "Sending your enquiry"
                                : "Thank you!"
                        }
                    </h2>

                    <p
                        class="lp-description"
                        id="econLeadPopupDescription"
                    >
                        ${
                            loading
                                ? "Please wait while we submit your details."
                                : "We’ve received your enquiry. Our team will contact you soon to discuss your requirements."
                        }
                    </p>

                </div>

                ${
                    loading
                        ? `
                            <div class="lp-footer">
                                Please keep this page open.
                            </div>
                        `
                        : `
                            <button
                                class="lp-close"
                                type="button"
                            >
                                Done
                            </button>
                        `
                }

            </div>
        `;

        if (!popup.open) {
            popup.showModal();
        }

        const closeButton = popup.querySelector(
            ".lp-close"
        );

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                popup.close();
            });

            closeButton.focus();
        } else {
            popup.querySelector(
                "#econLeadPopupTitle"
            )?.focus();
        }
    }

    function closeLeadPopup() {
        const popup = document.getElementById(
            "leadThankYouPopup"
        );

        if (popup?.open) {
            popup.dataset.loading = "false";
            popup.close();
        }
    }

    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    async function handleSubmission(event) {
        const form = event.target;

        if (!(form instanceof HTMLFormElement)) {
            return;
        }

        const config = FORM_CONFIG[form.id];

        if (!config) return;

        // Stop normal GET submission and legacy demo handlers.
        event.preventDefault();
        event.stopImmediatePropagation();

        if (
            submissionInProgress ||
            form.dataset.saving === "true"
        ) {
            return;
        }

        const status = getStatusElement(form);
        status.textContent = "";

        const data = readFormData(form);

        if (!validateForm(form, data)) {
            return;
        }

        const buttons = Array.from(
            form.querySelectorAll(
                'button[type="submit"], button:not([type]), input[type="submit"]'
            )
        );

        const originalDisabledStates = buttons.map(
            button => button.disabled
        );

        returnFocusTarget =
            event.submitter ||
            buttons[0] ||
            form.querySelector("input, select, textarea");

        submissionInProgress = true;
        form.dataset.saving = "true";
        form.setAttribute("aria-busy", "true");

        buttons.forEach(button => {
            button.disabled = true;
        });

        const startedAt = Date.now();
        let saved = false;

        try {
            showLeadPopup("loading");

            await saveLead({
                ...data,
                formId: config.formId,
                leadType: config.leadType,
                source: config.source
            });

            saved = true;

            // Minimum loading time: 3 seconds.
            // A slower Firebase save is allowed to finish first.
            const remainingTime = Math.max(
                0,
                MIN_LOADING_TIME - (Date.now() - startedAt)
            );

            if (remainingTime > 0) {
                await wait(remainingTime);
            }

            form.reset();
            status.textContent = "";

            showLeadPopup("success");

        } catch (error) {
            console.error(
                "ECON enquiry submission:",
                error?.code || error?.message || "Unknown error"
            );

            closeLeadPopup();

            if (saved) {
                // A UI error after a successful save must not
                // tell the customer that the database save failed.
                status.style.color = "#48663c";

                status.textContent =
                    "Thank you! Your enquiry has been submitted successfully. Our team will contact you soon.";
            } else {
                showFormError(
                    form,
                    "Your enquiry could not be submitted. Please try again. Your details are still in the form."
                );
            }

        } finally {
            submissionInProgress = false;

            form.dataset.saving = "false";
            form.removeAttribute("aria-busy");

            buttons.forEach((button, index) => {
                button.disabled =
                    originalDisabledStates[index];
            });
        }
    }

    // Capture phase intercepts existing form-level demo handlers.
    document.addEventListener(
        "submit",
        handleSubmission,
        true
    );

})();