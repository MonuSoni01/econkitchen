/* =========================================================
   ECON KITCHEN — WARDROBE ESTIMATOR
   File: /assets/js/wardrobe-estimator.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const TOTAL_STEPS = 6;

    /*
     * Indicative calculation values.
     * Aap baad me actual ECON pricing ke according
     * in values ko change kar sakte ho.
     */
   const PRICE_CONFIG = {

    baseRatePerSqFt: 1450,

    type: {
        "Sliding Wardrobe": 1.15,
        "Hinged Wardrobe": 1
    },

    finish: {
        "Essential Laminate": 1,
        "Premium Membrane": 1.25,
        "Luxury Acrylic": 1.55
    },

    material: {
        "MDF": 1,
        "HDF-HMR": 1.18,
        "Plywood": 1.35
    }

};


    /* =====================================================
       STATE
    ===================================================== */

    const state = {

        currentStep: 1,

        length: "",
        height: "",

        type: "",
        finish: "",
        material: "",

        accessories: [],

        customer: {
            name: "",
            email: "",
            phone: "",
            city: "",
            whatsapp: true
        },

        estimate: 0

    };


    /* =====================================================
       DOM
    ===================================================== */

    const steps = Array.from(
        document.querySelectorAll(".we-step")
    );

    const progressItems = Array.from(
        document.querySelectorAll(".we-progress-item")
    );

    const progressLines = Array.from(
        document.querySelectorAll(".we-progress-line")
    );


    /* Desktop navigation */

    const backButton =
        document.querySelector(".we-back");

    const nextButton =
        document.querySelector(".we-next");

    const navCurrentStep =
        document.querySelector(
            ".we-nav-step strong"
        );


    /* Mobile navigation */

    const mobileBack =
        document.querySelector(".we-mobile-back");

    const mobileNext =
        document.querySelector(".we-mobile-next");

    const mobileCurrentStep =
        document.querySelector(
            ".we-mobile-step strong"
        );

    const mobileProgress =
        document.querySelector(
            ".we-mobile-progress span"
        );


    /* Inputs */

    const lengthInput =
        document.querySelector(
            'input[name="wardrobeLength"]'
        );

    const heightInput =
        document.querySelector(
            'input[name="wardrobeHeight"]'
        );


    /* Form */

    const leadForm =
        document.querySelector(
            "#wardrobeLeadForm"
        );


    /* Modal */

    const resultModal =
        document.querySelector(
            ".we-result-modal"
        );

    const resultClose =
        document.querySelector(
            ".we-result-close"
        );

    const resultBackdrop =
        document.querySelector(
            ".we-result-backdrop"
        );

    const resultPrice =
        document.querySelector(
           "#wardrobeEstimatePrice"
        );


    /* =====================================================
       UTILITY
    ===================================================== */

    function money(value) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(value);

    }


    function scrollEstimatorTop() {

        const shell =
            document.querySelector(
                ".we-estimator-shell"
            );

        if (!shell) return;

        const offset = 90;

        const top =
            shell.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

        window.scrollTo({
            top,
            behavior: "smooth"
        });

    }


    /* =====================================================
       SHOW STEP
    ===================================================== */

    function showStep(stepNumber, scroll = true) {

        if (
            stepNumber < 1 ||
            stepNumber > TOTAL_STEPS
        ) {
            return;
        }

        state.currentStep = stepNumber;


        /* -----------------------------------------
           Content
        ----------------------------------------- */

        steps.forEach((step, index) => {

            const isActive =
                index === stepNumber - 1;

            step.classList.toggle(
                "active",
                isActive
            );

            step.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );

        });


        /* -----------------------------------------
           Desktop Progress
        ----------------------------------------- */

        progressItems.forEach(
            (item, index) => {

                const number =
                    index + 1;

                item.classList.remove(
                    "active",
                    "completed"
                );

                if (number < stepNumber) {

                    item.classList.add(
                        "completed"
                    );

                } else if (
                    number === stepNumber
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );


        progressLines.forEach(
            (line, index) => {

                line.classList.toggle(
                    "completed",
                    index < stepNumber - 1
                );

            }
        );


        /* -----------------------------------------
           Desktop Step Counter
        ----------------------------------------- */

        if (navCurrentStep) {

            navCurrentStep.textContent =
                stepNumber;

        }


        /* -----------------------------------------
           Mobile Counter
        ----------------------------------------- */

        if (mobileCurrentStep) {

            mobileCurrentStep.textContent =
                stepNumber;

        }


        /* -----------------------------------------
           Mobile Progress
        ----------------------------------------- */

        if (mobileProgress) {

            mobileProgress.style.width =
                `${(stepNumber / TOTAL_STEPS) * 100}%`;

        }


        /* -----------------------------------------
           Back Buttons
        ----------------------------------------- */

        if (backButton) {

            backButton.disabled =
                stepNumber === 1;

        }

        if (mobileBack) {

            mobileBack.disabled =
                stepNumber === 1;

        }


        /* -----------------------------------------
           Last Step
        ----------------------------------------- */

        if (nextButton) {

            nextButton.style.display =
                stepNumber === TOTAL_STEPS
                    ? "none"
                    : "";

        }

        if (mobileNext) {

            mobileNext.style.display =
                stepNumber === TOTAL_STEPS
                    ? "none"
                    : "";

        }


        /* -----------------------------------------
           Generate Summary
        ----------------------------------------- */

        if (stepNumber === TOTAL_STEPS) {

            calculateEstimate();

            updateSummary();

        }


        if (scroll) {

            scrollEstimatorTop();

        }

    }


    /* =====================================================
       SINGLE SELECT CARDS
    ===================================================== */

    document.querySelectorAll(
        ".we-option-card"
    ).forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const group =
                    card.dataset.group;

                const value =
                    card.dataset.value;

                if (
                    !group ||
                    !value
                ) {
                    return;
                }


                /* Remove selected from same group */

                document.querySelectorAll(
                    `.we-option-card[data-group="${group}"]`
                ).forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                    item.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                });


                /* Select current */

                card.classList.add(
                    "selected"
                );

                card.setAttribute(
                    "aria-pressed",
                    "true"
                );


                /* Save state */

                if (group === "type") {

                    state.type = value;

                }

                if (group === "finish") {

                    state.finish = value;

                }

                if (group === "material") {

                    state.material = value;

                }


                clearStepError(
                    state.currentStep
                );

            }
        );

    });


    /* =====================================================
       ACCESSORIES — MULTI SELECT
    ===================================================== */
document.querySelectorAll(
    ".we-accessory-card"
).forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const name = card.dataset.accessory;
            const price = Number(card.dataset.price || 0);

            if (!name) return;

            const existingIndex =
                state.accessories.findIndex(
                    item => item.name === name
                );

            if (existingIndex !== -1) {

                state.accessories.splice(existingIndex, 1);

                card.classList.remove("selected");
                card.setAttribute("aria-pressed", "false");

            } else {

                state.accessories.push({
                    name,
                    price
                });

                card.classList.add("selected");
                card.setAttribute("aria-pressed", "true");

            }

        }
    );

});

    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    if (lengthInput) {

        lengthInput.addEventListener(
            "input",
            () => {

                state.length =
                    lengthInput.value.trim();

                removeFieldError(
                    lengthInput
                );

            }
        );

    }


    if (heightInput) {

        heightInput.addEventListener(
            "input",
            () => {

                state.height =
                    heightInput.value.trim();

                removeFieldError(
                    heightInput
                );

            }
        );

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateCurrentStep() {

        switch (
            state.currentStep
        ) {

            /* -------------------------------------
               STEP 1
            ------------------------------------- */

            case 1: {

                let valid = true;

                const length =
                    parseFloat(
                        lengthInput?.value
                    );

                const height =
                    parseFloat(
                        heightInput?.value
                    );


                if (
                    !length ||
                    length <= 0
                ) {

                    showFieldError(
                        lengthInput,
                        "Please enter wardrobe length."
                    );

                    valid = false;

                }


                if (
                    !height ||
                    height <= 0
                ) {

                    showFieldError(
                        heightInput,
                        "Please enter wardrobe height."
                    );

                    valid = false;

                }


                if (valid) {

                    state.length =
                        length;

                    state.height =
                        height;

                }

                return valid;

            }


            /* -------------------------------------
               STEP 2
            ------------------------------------- */

            case 2:

                if (!state.type) {

                    showStepError(
                        2,
                        "Please select a wardrobe type."
                    );

                    return false;

                }

                return true;


            /* -------------------------------------
               STEP 3
            ------------------------------------- */

            case 3:

                if (!state.finish) {

                    showStepError(
                        3,
                        "Please select a finish."
                    );

                    return false;

                }

                return true;


            /* -------------------------------------
               STEP 4
            ------------------------------------- */

            case 4:

                if (!state.material) {

                    showStepError(
                        4,
                        "Please select a core material."
                    );

                    return false;

                }

                return true;


            /* -------------------------------------
               STEP 5
               Accessories optional
            ------------------------------------- */

            case 5:

                return true;


            default:

                return true;

        }

    }


    /* =====================================================
       ERROR HANDLING
    ===================================================== */

    function showFieldError(
        input,
        message
    ) {

        if (!input) return;

        const field =
            input.closest(
                ".we-field"
            );

        if (!field) return;


        field.classList.add(
            "error"
        );


        let error =
            field.querySelector(
                ".we-error-message"
            );


        if (!error) {

            error =
                document.createElement(
                    "div"
                );

            error.className =
                "we-error-message";

            field.appendChild(
                error
            );

        }


        error.textContent =
            message;

    }


    function removeFieldError(
        input
    ) {

        if (!input) return;

        const field =
            input.closest(
                ".we-field"
            );

        if (!field) return;

        field.classList.remove(
            "error"
        );

        field.querySelector(
            ".we-error-message"
        )?.remove();

    }


    function showStepError(
        stepNumber,
        message
    ) {

        const step =
            steps[
                stepNumber - 1
            ];

        if (!step) return;


        let error =
            step.querySelector(
                ".we-step-error"
            );


        if (!error) {

            error =
                document.createElement(
                    "div"
                );

            error.className =
                "we-info-strip we-step-error";


            const header =
                step.querySelector(
                    ".we-step-header"
                );


            if (header) {

                header.insertAdjacentElement(
                    "afterend",
                    error
                );

            } else {

                step.prepend(
                    error
                );

            }

        }


        error.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>${message}</span>
        `;

    }


    function clearStepError(
        stepNumber
    ) {

        steps[
            stepNumber - 1
        ]
        ?.querySelector(
            ".we-step-error"
        )
        ?.remove();

    }


    /* =====================================================
       NEXT
    ===================================================== */

    function goNext() {

        if (
            !validateCurrentStep()
        ) {
            return;
        }


        if (
            state.currentStep <
            TOTAL_STEPS
        ) {

            showStep(
                state.currentStep + 1
            );

        }

    }


    /* =====================================================
       BACK
    ===================================================== */

    function goBack() {

        if (
            state.currentStep > 1
        ) {

            showStep(
                state.currentStep - 1
            );

        }

    }


    nextButton?.addEventListener(
        "click",
        goNext
    );

    mobileNext?.addEventListener(
        "click",
        goNext
    );

    backButton?.addEventListener(
        "click",
        goBack
    );

    mobileBack?.addEventListener(
        "click",
        goBack
    );


    /* =====================================================
       CALCULATION
    ===================================================== */

    function calculateEstimate() {

        const length =
            Number(state.length) || 0;

        const height =
            Number(state.height) || 0;


        /*
         * Wardrobe area
         */

        const area =
            length * height;


        /*
         * Base price
         */

        let amount =
            area *
            PRICE_CONFIG.baseRatePerSqFt;


        /*
         * Type multiplier
         */

        amount *=
            PRICE_CONFIG.type[
                state.type
            ] || 1;


        /*
         * Finish multiplier
         */

        amount *=
            PRICE_CONFIG.finish[
                state.finish
            ] || 1;


        /*
         * Material multiplier
         */

        amount *=
            PRICE_CONFIG.material[
                state.material
            ] || 1;


        /*
         * Accessories
         */

      state.accessories.forEach(accessory => {

    amount += Number(accessory.price || 0);

});

        /*
         * Round price
         */

        state.estimate =
            Math.round(
                amount / 100
            ) * 100;


        return state.estimate;

    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateSummary() {

        setText(
            "#summarySize",
            `${state.length} ft × ${state.height} ft`
        );

        setText(
            "#summaryType",
            state.type || "—"
        );

        setText(
            "#summaryFinish",
            state.finish || "—"
        );

        setText(
            "#summaryMaterial",
            state.material || "—"
        );

        setText(
            "#summaryAccessories",
            state.accessories.length
    ? state.accessories.map(item => item.name).join(", ")
    : "No additional accessories"
        );


        const estimate =
            document.querySelector(
                "#summaryEstimate"
            );

        if (estimate) {

            estimate.textContent =
                money(
                    state.estimate
                );

        }

    }


    function setText(
        selector,
        value
    ) {

        const element =
            document.querySelector(
                selector
            );

        if (element) {

            element.textContent =
                value;

        }

    }


    /* =====================================================
       LEAD FORM
    ===================================================== */

    if (leadForm) {

        leadForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                clearFormErrors();


                const formData =
                    new FormData(
                        leadForm
                    );


                const name =
                    String(
                        formData.get(
                            "name"
                        ) || ""
                    ).trim();


                const email =
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    ).trim();


                const phone =
                    String(
                        formData.get(
                            "phone"
                        ) || ""
                    )
                    .replace(/\D/g, "")
                    .slice(-10);


                const city =
                    String(
                        formData.get(
                            "city"
                        ) || ""
                    ).trim();


                const whatsapp =
    formData.get(
        "whatsappConsent"
    ) !== null;


                /* -----------------------------------------
                   Validate
                ----------------------------------------- */

                let valid = true;


                if (
                    name.length < 2
                ) {

                    showFormError(
                        leadForm.elements.name,
                        "Please enter your name."
                    );

                    valid = false;

                }


                if (
                    email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        email
                    )
                ) {

                    showFormError(
                        leadForm.elements.email,
                        "Please enter a valid email."
                    );

                    valid = false;

                }


                if (
                    !/^[6-9]\d{9}$/.test(
                        phone
                    )
                ) {

                    showFormError(
                        leadForm.elements.phone,
                        "Enter a valid 10-digit mobile number."
                    );

                    valid = false;

                }


                if (
                    city.length < 2
                ) {

                    showFormError(
                        leadForm.elements.city,
                        "Please enter your city."
                    );

                    valid = false;

                }


                if (!valid) {

                    return;

                }


                /* -----------------------------------------
                   Save Customer
                ----------------------------------------- */

                state.customer = {

                    name,
                    email,
                    phone,
                    city,
                    whatsapp

                };


                calculateEstimate();


                /* -----------------------------------------
                   Loading
                ----------------------------------------- */

                const submitButton =
                    leadForm.querySelector(
                        ".we-submit"
                    );


                const originalHTML =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.classList.add(
                        "loading"
                    );

                    submitButton.innerHTML = `
                        <span>Preparing Estimate...</span>
                        <i class="fa-solid fa-spinner"></i>
                    `;

                }


                try {

                    /*
                     * =================================================
                     * SAVE LEAD HERE
                     * =================================================
                     *
                     * Yahan Firebase / Apps Script API connect
                     * kar sakte ho.
                     *
                     * Example payload:
                     */

                    const payload = {

                        source:
                            "Wardrobe Cost Calculator",

                        customer:
                            state.customer,

                        wardrobe: {

                            length:
                                state.length,

                            height:
                                state.height,

                            type:
                                state.type,

                            finish:
                                state.finish,

                            material:
                                state.material,

                            accessories:
                                state.accessories

                        },

                        estimatedPrice:
                            state.estimate,

                        createdAt:
                            new Date()
                                .toISOString()

                    };


                    console.log(
                        "ECON Wardrobe Lead:",
                        payload
                    );


                    /*
                     * Temporary delay.
                     * Firebase connect karne ke baad
                     * isko remove kar dena.
                     */

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                600
                            )
                    );


                    openResultModal();


                } catch (error) {

                    console.error(
                        "Wardrobe estimator error:",
                        error
                    );

                    alert(
                        "Something went wrong. Please try again."
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.classList.remove(
                            "loading"
                        );

                        submitButton.innerHTML =
                            originalHTML;

                    }

                }

            }
        );

    }


    /* =====================================================
       FORM ERRORS
    ===================================================== */

    function showFormError(
        input,
        message
    ) {

        if (!input) return;

        const field =
            input.closest(
                ".we-form-field"
            );

        if (!field) return;


        field.classList.add(
            "error"
        );


        let error =
            field.querySelector(
                ".we-error-message"
            );


        if (!error) {

            error =
                document.createElement(
                    "div"
                );

            error.className =
                "we-error-message";

            field.appendChild(
                error
            );

        }


        error.textContent =
            message;

    }


    function clearFormErrors() {

        document.querySelectorAll(
            ".we-form-field.error"
        ).forEach(field => {

            field.classList.remove(
                "error"
            );

        });


        document.querySelectorAll(
            ".we-form-field .we-error-message"
        ).forEach(error => {

            error.remove();

        });

    }


    /* =====================================================
       RESULT MODAL
    ===================================================== */

    function openResultModal() {

        if (!resultModal) return;


        if (resultPrice) {

            resultPrice.textContent =
                money(
                    state.estimate
                );

        }


        resultModal.classList.add(
            "open"
        );

        resultModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeResultModal() {

        if (!resultModal) return;


        resultModal.classList.remove(
            "open"
        );

        resultModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    resultClose?.addEventListener(
        "click",
        closeResultModal
    );


    resultBackdrop?.addEventListener(
        "click",
        closeResultModal
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                resultModal?.classList.contains(
                    "open"
                )
            ) {

                closeResultModal();

            }

        }
    );


    /* =====================================================
       KEYBOARD SUPPORT FOR CARDS
    ===================================================== */

    document.querySelectorAll(
        ".we-option-card, .we-accessory-card"
    ).forEach(card => {

        if (
            card.tagName.toLowerCase() ===
            "button"
        ) {
            return;
        }


        card.setAttribute(
            "tabindex",
            "0"
        );


        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    card.click();

                }

            }
        );

    });


    /* =====================================================
       PREVENT ENTER SUBMIT BEFORE FINAL FORM
    ===================================================== */

    document.querySelectorAll(
        ".we-step input"
    ).forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    state.currentStep <
                    TOTAL_STEPS
                ) {

                    event.preventDefault();

                    goNext();

                }

            }
        );

    });


    /* =====================================================
       RESTORE UI FROM STATE
    ===================================================== */

    function restoreSelections() {

        const values = {

            type:
                state.type,

            finish:
                state.finish,

            material:
                state.material

        };


        Object.entries(
            values
        ).forEach(
            ([group, value]) => {

                if (!value) return;


                const card =
                    document.querySelector(
                        `.we-option-card[data-group="${group}"][data-value="${CSS.escape(value)}"]`
                    );


                if (card) {

                    card.classList.add(
                        "selected"
                    );

                }

            }
        );


    state.accessories.forEach(item => {

    const card = document.querySelector(
        `.we-accessory-card[data-accessory="${CSS.escape(item.name)}"]`
    );

    if (card) {
        card.classList.add("selected");
        card.setAttribute("aria-pressed", "true");
    }

});

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    restoreSelections();

    showStep(
        1,
        false
    );


    console.log(
        "ECON Wardrobe Estimator Ready"
    );

});