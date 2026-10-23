import { submitLead } from './firebase.js';
/* =========================================================
   ECON KITCHEN — COST ESTIMATOR
========================================================= */
import calculatorConfig from "./calculator-config.js";
document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STATE
    ===================================================== */
    const state = {


        step: 1,


        layout: null,


        dimensions: {


            a: 0,

            b: 0,

            c: 0


        },


        package: null,


        totalWallLength: 0,


        approximateArea: 0,


        packageRate: 0,


        approximateEstimate: 0,
        leadSubmitted: false,
        estimateId: null



    };


    /* ==========================================
       ECON KITCHEN — WHATSAPP QUOTE REQUEST
    ========================================== */

    const quoteWhatsAppButton = document.getElementById(
        "getDetailedQuoteWhatsApp"
    );

    // Enter official ECON Kitchen WhatsApp number
    const ECON_WHATSAPP_NUMBER = "917900300456";

    if (quoteWhatsAppButton) {

        quoteWhatsAppButton.addEventListener("click", (event) => {

            event.preventDefault();

            // Only allow after successful lead submission
            if (!state.leadSubmitted) {
                alert("Please submit your contact details first.");
                return;
            }

            if (!state.estimateId) {
    alert("Estimate ID is missing. Please try again.");
    return;
}

const estimateId = state.estimateId;

            const layout =
                state.layoutName || "Not Selected";

            const { a = 0, b = 0, c = 0 } =
                state.dimensions || {};

            const measurements = [
                `A: ${a} ft`,
                ...(state.layout !== "straight" ? [`B: ${b} ft`] : []),
                ...(state.layout === "u-shaped" ? [`C: ${c} ft`] : [])
            ].join(" | ");

            const selectedPackage =
                calculatorConfig.packages[state.package]?.name ||
                "Not Selected";

            const estimateAmount = Number(
                state.approximateEstimate || 0
            ).toLocaleString("en-IN");

            const message = `Hello ECON Kitchen Team! 👋

I have completed my Kitchen Cost Estimate and would like to receive a detailed quotation.

*Estimate ID:* ${estimateId}

*Kitchen Details*
Layout: ${layout}
Measurements: ${measurements}
Running Feet: ${state.runningFeet || 0}
Package: ${selectedPackage}
Estimated Cost: ₹${estimateAmount}

Please guide me through the next steps.`;

            const url =
                `https://wa.me/${ECON_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank", "noopener,noreferrer");

        });

    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const steps =
        document.querySelectorAll(".estimator-step");

    const progressSteps =
        document.querySelectorAll(".progress-step");

    const progressLines =
        document.querySelectorAll(".progress-line");

    const layoutOptions =
        document.querySelectorAll(".layout-option");

    const packageCards =
        document.querySelectorAll(".package-card");


    const layoutNext =
        document.getElementById("layoutNext");

    const packageNext =
        document.getElementById("packageNext");


    const layoutSelection =
        document.getElementById("layoutSelection");

    const packageSummary =
        document.getElementById("packageSummary");

    const liveEstimate =
        document.getElementById("liveEstimate");


    const dimensionA =
        document.getElementById("dimensionA");

    const dimensionB =
        document.getElementById("dimensionB");

    const dimensionC =
        document.getElementById("dimensionC");


    const dimensionBField =
        document.getElementById("dimensionBField");

    const dimensionCField =
        document.getElementById("dimensionCField");


    const measurementLayoutName =
        document.getElementById("measurementLayoutName");

    const diagramAValue =
        document.getElementById("diagramAValue");

    const diagramBValue =
        document.getElementById("diagramBValue");

    const runningFeet =
        document.getElementById("runningFeet");


    /* MOBILE */

    const mobileBar =
        document.getElementById("mobileEstimatorBar");

    const mobileBack =
        document.getElementById("mobileBack");

    const mobileNext =
        document.getElementById("mobileNext");

    const mobileStepCount =
        document.getElementById("mobileStepCount");


    /* =====================================================
       MONEY FORMAT
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


    /* =====================================================
       SHOW STEP
    ===================================================== */

    function showStep(stepNumber) {

        state.step = stepNumber;


        steps.forEach(step => {

            const number =
                Number(step.dataset.step);

            step.classList.toggle(
                "active",
                number === stepNumber
            );

        });


        updateProgress();

        updateMobileBar();


        window.scrollTo({
            top:
                document.querySelector(
                    ".estimator-progress-wrapper"
                ).offsetTop,
            behavior: "smooth"
        });

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function updateProgress() {

        progressSteps.forEach(step => {

            const number =
                Number(step.dataset.progress);

            step.classList.remove(
                "active",
                "completed"
            );


            if (number < state.step) {

                step.classList.add(
                    "completed"
                );

            }

            else if (number === state.step) {

                step.classList.add(
                    "active"
                );

            }

        });


        progressLines.forEach(
            (line, index) => {

                line.classList.toggle(
                    "completed",
                    index + 1 < state.step
                );

            }
        );

    }


    /* =====================================================
       SELECT LAYOUT
    ===================================================== */

    layoutOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                layoutOptions.forEach(item =>
                    item.classList.remove(
                        "selected"
                    )
                );


                option.classList.add(
                    "selected"
                );
                state.layout =
                    option.dataset.layout;


                const layoutData =
                    calculatorConfig.layouts[state.layout];


                state.layoutName =
                    layoutData.name;


                layoutSelection.textContent =
                    state.layoutName;


                layoutNext.disabled = false;


                configureMeasurements(); 

                updateMobileBar();

            }
        );

    });


    /* =====================================================
       CONFIGURE MEASUREMENT FIELDS
    ===================================================== */


    function configureMeasurements() {

        // Selected layout name
        measurementLayoutName.textContent = state.layoutName;

        // Update diagram according to selected layout
        const diagram = document.getElementById("diagramL");

        if (diagram) {

            diagram.classList.remove(
                "diagram-straight",
                "diagram-l-shaped",
                "diagram-u-shaped",
                "diagram-parallel"
            );

            if (state.layout) {
                diagram.classList.add(`diagram-${state.layout}`);
            }
        }

        // Show/hide measurement fields
        dimensionBField.classList.remove("hidden");
        dimensionCField.classList.add("hidden");

        if (state.layout === "straight") {
            dimensionBField.classList.add("hidden");
        }

        if (state.layout === "u-shaped") {
            dimensionCField.classList.remove("hidden");
        }

        // Refresh measurements and diagram values
        readDimensions();
    }




    /* =====================================================
       DIMENSIONS
    ===================================================== */

    function readDimensions() {

        state.dimensions.a =
            Number(dimensionA.value) || 0;

        state.dimensions.b =
            Number(dimensionB.value) || 0;

        state.dimensions.c =
            Number(dimensionC.value) || 0;


        calculateRunningFeet();

    }


    [
        dimensionA,
        dimensionB,
        dimensionC
    ].forEach(input => {

        input.addEventListener(
            "input",
            readDimensions
        );

        input.addEventListener(
            "change",
            readDimensions
        );

    });


    /* PLUS */

    document
        .querySelectorAll(".dimension-plus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const input =
                        document.getElementById(
                            button.dataset.target
                        );

                    const max =
                        Number(input.max) || 30;

                    const current =
                        Number(input.value) || 0;


                    input.value =
                        Math.min(
                            current + 1,
                            max
                        );


                    input.dispatchEvent(
                        new Event(
                            "input",
                            { bubbles: true }
                        )
                    );

                }
            );

        });


    /* MINUS */

    document
        .querySelectorAll(".dimension-minus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const input =
                        document.getElementById(
                            button.dataset.target
                        );

                    const min =
                        Number(input.min) || 3;

                    const current =
                        Number(input.value) || min;


                    input.value =
                        Math.max(
                            current - 1,
                            min
                        );


                    input.dispatchEvent(
                        new Event(
                            "input",
                            { bubbles: true }
                        )
                    );

                }
            );

        });


    /* =====================================================
       RUNNING FEET
    ===================================================== */

    function calculateRunningFeet() {

        const {
            a,
            b,
            c
        } = state.dimensions;


        switch (state.layout) {

            case "straight":

                state.runningFeet = a;

                break;


            case "u-shaped":

                state.runningFeet =
                    a + b + c;

                break;


            case "parallel":

                state.runningFeet =
                    a + b;

                break;


            case "l-shaped":

            default:

                state.runningFeet =
                    a + b;

                break;

        }


        runningFeet.textContent =
            state.runningFeet;



        diagramAValue.textContent = `${a} FT`;

        diagramBValue.textContent = `${b} FT`;

        const diagramCValue =
            document.getElementById("diagramCValue");

        if (diagramCValue) {
            diagramCValue.textContent = `${c} FT`;
        }


        calculateEstimate();

    }


    /* =====================================================
       PACKAGE
    ===================================================== */

    packageCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                packageCards.forEach(item =>
                    item.classList.remove(
                        "selected"
                    )
                );


                card.classList.add(
                    "selected"
                );


                state.package =
                    card.dataset.package;

                const packageData =
                    calculatorConfig.packages[state.package];


                state.packageName =
                    packageData.name;


                state.packageRate =
                    packageData.rate;

                packageSummary.textContent =
                    `${state.packageName} Package`;


                packageNext.disabled =
                    false;


                calculateEstimate();

                updateMobileBar();

            }
        );

    });


    /* =====================================================
       CALCULATE ESTIMATE
    ===================================================== */

    function calculateEstimate() {

        if (
            !state.runningFeet ||
            !state.packageRate
        ) {

            liveEstimate.textContent = "—";

            return;

        }


        state.totalWallLength =
            state.runningFeet;


        state.approximateArea =
            state.totalWallLength *
            calculatorConfig.height;


        state.approximateEstimate =
            state.approximateArea *
            state.packageRate;


        liveEstimate.textContent =
            money(state.approximateEstimate);


        updateFinalSummary();

    }


    /* =====================================================
       FINAL SUMMARY
    ===================================================== */

    function measurementText() {

        const {
            a,
            b,
            c
        } = state.dimensions;


        if (state.layout === "straight") {

            return `${a} ft`;

        }


        if (state.layout === "u-shaped") {

            return `${a} ft + ${b} ft + ${c} ft`;

        }


        return `${a} ft + ${b} ft`;

    }


    function updateFinalSummary() {

        const values = {

            finalLayout:
                state.layoutName,

            finalMeasurements:
                measurementText(),

            finalRunningFeet:
                `${state.runningFeet} Running Ft.`,

            finalPackage:
                state.packageName,

            finalPreviewEstimate:
                money(state.approximateEstimate),


            resultEstimate:
                money(state.approximateEstimate),
            resultLayout:
                state.layoutName,

            resultMeasurements:
                measurementText(),

            resultRunning:
                `${state.runningFeet} Running Ft.`,

            resultPackage:
                state.packageName

        };


        Object.entries(values)
            .forEach(([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.textContent =
                        value || "—";
                }

            });


        const resultMeta =
            document.getElementById(
                "resultMeta"
            );


        if (resultMeta) {

            resultMeta.textContent =
                `${state.packageName || ""} • ` +
                `${state.layoutName || ""} • ` +
                `${state.runningFeet || 0} Running Ft.`;

        }

    }


    /* =====================================================
       DESKTOP NEXT
    ===================================================== */

    document
        .querySelectorAll("[data-next]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (button.disabled) {
                        return;
                    }


                    const next =
                        Number(
                            button.dataset.next
                        );


                    if (next === 4) {

                        updateFinalSummary();

                    }


                    showStep(next);

                }
            );

        });


    /* =====================================================
       DESKTOP BACK
    ===================================================== */

    document
        .querySelectorAll("[data-back]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showStep(
                        Number(
                            button.dataset.back
                        )
                    );

                }
            );

        });


    /* =====================================================
       MOBILE BAR
    ===================================================== */

    function updateMobileBar() {

        if (!mobileStepCount) return;


        mobileStepCount.textContent =
            `STEP ${state.step} OF 4`;


        mobileBack.style.visibility =
            state.step === 1
                ? "hidden"
                : "visible";


        if (state.step === 1) {

            mobileNext.disabled =
                !state.layout;

            mobileNext.innerHTML =
                `NEXT
                 <i class="fa-solid fa-arrow-right"></i>`;

        }


        else if (state.step === 2) {

            mobileNext.disabled = false;

            mobileNext.innerHTML =
                `NEXT
                 <i class="fa-solid fa-arrow-right"></i>`;

        }


        else if (state.step === 3) {

            mobileNext.disabled =
                !state.package;

            mobileNext.innerHTML =
                `ESTIMATE
                 <i class="fa-solid fa-arrow-right"></i>`;

        }


        else {

            mobileNext.style.visibility =
                "hidden";

        }


        if (state.step < 4) {

            mobileNext.style.visibility =
                "visible";

        }

    }


    mobileBack?.addEventListener(
        "click",
        () => {

            if (state.step > 1) {

                showStep(
                    state.step - 1
                );

            }

        }
    );


    mobileNext?.addEventListener(
        "click",
        () => {

            if (mobileNext.disabled) {
                return;
            }


            if (state.step < 4) {

                showStep(
                    state.step + 1
                );

            }

        }
    );


    /* =====================================================
       FORM
    ===================================================== */

    const form =
        document.getElementById(
            "estimatorLeadForm"
        );


    form?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "customerEmail"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "customerCity"
                    )
                    .value
                    .trim();


            /* INDIA MOBILE */

            if (!/^[6-9]\d{9}$/.test(phone)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            /* EMAIL */

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            const leadData = {

                name,
                phone,
                email,
                city,

                whatsapp:
                    form.elements.whatsapp
                        ?.checked || false,

                layout:
                    state.layoutName,

                measurements:
                    measurementText(),

                runningFeet:
                    state.runningFeet,

                package:
                    state.packageName,

                packageRate:
                    state.packageRate,

                estimate:
                    state.approximateEstimate,

                source:
                    "Kitchen Cost Estimator"

            };


            console.log(
                "ECON Estimator Lead:",
                leadData
            );


            if (form.dataset.saving === 'true') return;
            form.dataset.saving = 'true';
            const button = form.querySelector('[type="submit"]');
            if (button) button.disabled = true;
          
try {
    const result = await submitLead({
        ...leadData,
        dimensions: { ...state.dimensions },
        formId: "kitchen_estimator",
        leadType: "calculator",
        calculatorType: "kitchen"
    });

    // Requires submitLead() to return { ok: true, id: "..." }
    if (!result?.ok || !result?.id) {
        throw new Error("Lead saved status or Estimate ID missing");
    }

    state.estimateId = result.id;
    state.leadSubmitted = true;

    showLoader();

} catch (error) {
    console.error("Estimator submission error:", error);
    alert("Your estimate could not be confirmed. Please try again.");

} finally {
    form.dataset.saving = "false";

    if (button) {
        button.disabled = false;
    }
}


            /*
            =================================================
            FIREBASE / API SUBMISSION

            Add your existing Firebase/API submission here.

            Example:

            await addDoc(
                collection(db, "websiteLeads"),
                {
                    ...leadData,
                    createdAt: serverTimestamp(),
                    status: "new"
                }
            );

            =================================================
            */

        }
    );


    /* =====================================================
       LOADER → RESULT
    ===================================================== */

    function showLoader() {

        steps.forEach(step =>
            step.classList.remove(
                "active"
            )
        );


        const loader =
            document.getElementById(
                "estimateLoader"
            );

        const result =
            document.getElementById(
                "estimateResult"
            );


        result?.classList.remove(
            "active"
        );


        loader?.classList.add(
            "active"
        );


        if (mobileBar) {

            mobileBar.style.display =
                "none";

        }


        window.scrollTo({
            top:
                document.querySelector(
                    ".estimator-main"
                ).offsetTop,
            behavior: "smooth"
        });


        setTimeout(
            () => {

                loader?.classList.remove(
                    "active"
                );


                updateFinalSummary();


                result?.classList.add(
                    "active"
                );

            },
            1900
        );

    }


    /* =====================================================
       INITIAL
    ===================================================== */

    updateProgress();

    calculateRunningFeet();

    updateMobileBar();

});