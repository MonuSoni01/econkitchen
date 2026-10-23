import { submitLead } from './firebase.js';
    /* =========================================================
   ECON FULL INTERIOR CALCULATOR
========================================================= */


/* =========================================================
   PRICING CONFIGURATION

   IMPORTANT:
   Ye indicative sample pricing structure hai.

   Actual ECON commercial rates ke according
   sirf yahan values update karni hain.
========================================================= */

const PRICING = {

    bhkBase: {

        1: 75000,
        2: 100000,
        3: 130000,
        4: 165000,
        5: 210000

    },


    sizeMultiplier: {

        default: 1,

        small: 1,

        large: 1.16

    },


    rooms: {

        living: 90000,

        kitchen: 180000,

        bedroom: 130000,

        bathroom: 45000,

        dining: 65000,

        study: 60000,

        pooja: 55000

    },


    packageMultiplier: {

        essential: 1,

        premium: 1.28,

        luxury: 1.62

    },


    range: {

        low: 0.93,

        high: 1.10

    }

};



/* =========================================================
   STATE
========================================================= */

const state = {

    step: 1,

    bhk: null,

    size: null,

    sizeLabel: null,

    package: null,

    rooms: {

        living: 1,

        kitchen: 1,

        bedroom: 2,

        bathroom: 2,

        dining: 1,

        study: 0,

        pooja: 0

    }

};



/* =========================================================
   DOM
========================================================= */

const steps =
    document.querySelectorAll(
        ".fi-calc-step"
    );


const stepIndicators =
    document.querySelectorAll(
        ".fi-stepper-item"
    );


const progress =
    document.getElementById(
        "fiStepperProgress"
    );


const nextBtn =
    document.getElementById(
        "fiNextBtn"
    );


const backBtn =
    document.getElementById(
        "fiBackBtn"
    );


const stepCounter =
    document.getElementById(
        "fiStepCounter"
    );


const calculatorSection =
    document.querySelector(
        ".fi-calculator-section"
    );


const resultSection =
    document.getElementById(
        "fiResultSection"
    );


const leadForm =
    document.getElementById(
        "fiLeadForm"
    );



/* =========================================================
   STEP CONTROL
========================================================= */

function showStep(step) {

    state.step =
        Math.min(
            4,
            Math.max(
                1,
                step
            )
        );


    steps.forEach(
        section => {

            section.classList.toggle(

                "active",

                Number(
                    section.dataset.step
                ) === state.step

            );

        }
    );


    updateStepper();

    updateNavigation();

    updateSummary();


    window.scrollTo({

        top:
            calculatorSection.offsetTop - 120,

        behavior:
            "smooth"

    });

}



/* =========================================================
   STEPPER
========================================================= */

function updateStepper() {

    stepIndicators.forEach(
        indicator => {

            const number =
                Number(
                    indicator.dataset.stepIndicator
                );


            indicator.classList.remove(
                "active",
                "completed"
            );


            if (
                number < state.step
            ) {

                indicator.classList.add(
                    "completed"
                );

            }


            if (
                number === state.step
            ) {

                indicator.classList.add(
                    "active"
                );

            }

        }
    );


    const percentages = {

        1: 0,

        2: 33.333,

        3: 66.666,

        4: 100

    };


    if (progress) {

        progress.style.width =
            `${percentages[state.step]}%`;

    }

}



/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation() {

    if (stepCounter) {

        stepCounter.textContent =
            `Step ${state.step} of 4`;

    }


    if (backBtn) {

        backBtn.style.visibility =
            state.step === 1
                ? "hidden"
                : "visible";

    }


    if (!nextBtn) {
        return;
    }


    if (state.step === 4) {

        nextBtn.querySelector(
            "span"
        ).textContent =
            "VIEW ESTIMATE";

    } else {

        nextBtn.querySelector(
            "span"
        ).textContent =
            "NEXT";

    }


    nextBtn.disabled =
        !canContinue();

}



/* =========================================================
   CAN CONTINUE
========================================================= */

function canContinue() {

    switch (
        state.step
    ) {

        case 1:

            if (!state.bhk) {
                return false;
            }


            /*
             2/3/4 BHK requires
             Small/Large selection.
            */

            if (
                [2, 3, 4]
                    .includes(
                        state.bhk
                    )
            ) {

                return Boolean(
                    state.size
                );

            }


            return true;


        case 2:

            return (
                getTotalRooms() > 0
            );


        case 3:

            return Boolean(
                state.package
            );


        case 4:

            return true;


        default:

            return false;
    }

}



/* =========================================================
   NEXT
========================================================= */

nextBtn?.addEventListener(

    "click",

    () => {

        if (
            !canContinue()
        ) {

            return;
        }


        if (
            state.step < 4
        ) {

            showStep(
                state.step + 1
            );

            return;
        }


        submitLeadForm();

    }

);



/* =========================================================
   BACK
========================================================= */

backBtn?.addEventListener(

    "click",

    () => {

        if (
            state.step > 1
        ) {

            showStep(
                state.step - 1
            );

        }

    }

);



/* =========================================================
   BHK SELECTION
========================================================= */

const bhkCards =
    document.querySelectorAll(
        ".fi-bhk-card"
    );


bhkCards.forEach(
    card => {

        const mainButton =
            card.querySelector(
                ".fi-bhk-main"
            );


        mainButton?.addEventListener(

            "click",

            () => {

                const bhk =
                    Number(
                        card.dataset.bhk
                    );


                selectBhk(
                    bhk,
                    card
                );

            }

        );

    }
);



function selectBhk(
    bhk,
    selectedCard
) {

    state.bhk =
        bhk;


    state.size =
        null;


    state.sizeLabel =
        null;


    bhkCards.forEach(
        card => {

            card.classList.remove(
                "selected",
                "expanded"
            );


            card
                .querySelectorAll(
                    ".fi-size-card"
                )
                .forEach(
                    size => {

                        size.classList.remove(
                            "selected"
                        );

                    }
                );

        }
    );


    selectedCard.classList.add(
        "selected"
    );


    /*
     2, 3, 4 BHK:
     show size options
    */

    if (
        [2, 3, 4]
            .includes(
                bhk
            )
    ) {

        selectedCard.classList.add(
            "expanded"
        );

    } else {

        state.size =
            "default";


        state.sizeLabel =
            bhk === 1
                ? "Standard"
                : "Custom / Large";

    }


    setDefaultRoomsByBhk(
        bhk
    );


    updateNavigation();

}



/* =========================================================
   SIZE
========================================================= */

document
    .querySelectorAll(
        ".fi-size-card"
    )
    .forEach(
        button => {

            button.addEventListener(

                "click",

                event => {

                    event.stopPropagation();


                    const parent =
                        button.closest(
                            ".fi-bhk-card"
                        );


                    if (!parent) {
                        return;
                    }


                    state.bhk =
                        Number(
                            parent.dataset.bhk
                        );


                    state.size =
                        button.dataset.size;


                    state.sizeLabel =
                        button.dataset.label;


                    parent
                        .querySelectorAll(
                            ".fi-size-card"
                        )
                        .forEach(
                            option => {

                                option.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    updateNavigation();

                }

            );

        }
    );



/* =========================================================
   DEFAULT ROOMS BY BHK
========================================================= */

function setDefaultRoomsByBhk(
    bhk
) {

    const defaults = {

        1: {

            living: 1,
            kitchen: 1,
            bedroom: 1,
            bathroom: 1,
            dining: 1,
            study: 0,
            pooja: 0

        },


        2: {

            living: 1,
            kitchen: 1,
            bedroom: 2,
            bathroom: 2,
            dining: 1,
            study: 0,
            pooja: 0

        },


        3: {

            living: 1,
            kitchen: 1,
            bedroom: 3,
            bathroom: 3,
            dining: 1,
            study: 0,
            pooja: 0

        },


        4: {

            living: 1,
            kitchen: 1,
            bedroom: 4,
            bathroom: 4,
            dining: 1,
            study: 1,
            pooja: 0

        },


        5: {

            living: 1,
            kitchen: 1,
            bedroom: 5,
            bathroom: 5,
            dining: 1,
            study: 1,
            pooja: 1

        }

    };


    state.rooms = {

        ...defaults[bhk]

    };


    updateRoomUI();

}



/* =========================================================
   ROOM COUNTERS
========================================================= */

const roomRows =
    document.querySelectorAll(
        ".fi-room-row"
    );


roomRows.forEach(
    row => {

        row.addEventListener(

            "click",

            event => {

                const button =
                    event.target.closest(
                        ".fi-counter-btn"
                    );


                if (!button) {
                    return;
                }


                const room =
                    row.dataset.room;


                const action =
                    button.dataset.action;


                if (
                    !room ||
                    !(room in state.rooms)
                ) {

                    return;
                }


                if (
                    action === "plus"
                ) {

                    state.rooms[room] =
                        Math.min(
                            10,
                            state.rooms[room] + 1
                        );

                }


                if (
                    action === "minus"
                ) {

                    state.rooms[room] =
                        Math.max(
                            0,
                            state.rooms[room] - 1
                        );

                }


                updateRoomUI();

                updateNavigation();

            }

        );

    }
);



/* =========================================================
   UPDATE ROOM UI
========================================================= */

function updateRoomUI() {

    roomRows.forEach(
        row => {

            const room =
                row.dataset.room;


            const count =
                row.querySelector(
                    ".fi-count"
                );


            if (
                count &&
                room in state.rooms
            ) {

                count.textContent =
                    state.rooms[room];

            }

        }
    );

}



/* =========================================================
   TOTAL ROOMS
========================================================= */

function getTotalRooms() {

    return Object
        .values(
            state.rooms
        )
        .reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        );

}



/* =========================================================
   PACKAGE
========================================================= */

const packageCards =
    document.querySelectorAll(
        ".fi-package-card"
    );


packageCards.forEach(
    card => {

        card.addEventListener(

            "click",

            () => {

                packageCards.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                state.package =
                    card.dataset.package;


                updateNavigation();

                updateSummary();

            }

        );

    }
);



/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const bhk =
        document.getElementById(
            "fiSummaryBhk"
        );


    const size =
        document.getElementById(
            "fiSummarySize"
        );


    const rooms =
        document.getElementById(
            "fiSummaryRooms"
        );


    const packageElement =
        document.getElementById(
            "fiSummaryPackage"
        );


    if (bhk) {

        bhk.textContent =
            state.bhk
                ? (
                    state.bhk === 5
                        ? "5 BHK+"
                        : `${state.bhk} BHK`
                )
                : "—";

    }


    if (size) {

        size.textContent =
            state.sizeLabel ||
            "—";

    }


    if (rooms) {

        rooms.textContent =
            `${getTotalRooms()} Spaces`;

    }


    if (packageElement) {

        packageElement.textContent =
            state.package
                ? capitalize(
                    state.package
                )
                : "—";

    }

}



/* =========================================================
   FORM VALIDATION
========================================================= */

function validateForm() {

    if (!leadForm) {
        return false;
    }


    let valid =
        true;


    const name =
        leadForm.elements.name;


    const email =
        leadForm.elements.email;


    const phone =
        leadForm.elements.phone;


    const city =
        leadForm.elements.city;


    /* NAME */

    if (
        !name.value.trim() ||
        name.value.trim().length < 2
    ) {

        showError(
            name,
            "Please enter your full name."
        );

        valid =
            false;

    } else {

        clearError(
            name
        );

    }


    /* EMAIL */

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(
            email.value.trim()
        )
    ) {

        showError(
            email,
            "Please enter a valid email address."
        );

        valid =
            false;

    } else {

        clearError(
            email
        );

    }


    /* PHONE */

    const phoneValue =
        phone.value
            .replace(
                /\D/g,
                ""
            );


    if (
        !/^\d{10}$/
            .test(
                phoneValue
            )
    ) {

        showError(
            phone,
            "Enter a valid 10-digit mobile number."
        );

        valid =
            false;

    } else {

        clearError(
            phone
        );

    }


    /* CITY */

    if (
        !city.value
    ) {

        showError(
            city,
            "Please select your city."
        );

        valid =
            false;

    } else {

        clearError(
            city
        );

    }


    return valid;

}



/* =========================================================
   ERROR
========================================================= */

function showError(
    input,
    message
) {

    const group =
        input.closest(
            ".fi-form-group"
        );


    if (!group) {
        return;
    }


    group.classList.add(
        "invalid"
    );


    const error =
        group.querySelector(
            ".fi-error"
        );


    if (error) {

        error.textContent =
            message;

    }

}



function clearError(
    input
) {

    const group =
        input.closest(
            ".fi-form-group"
        );


    if (!group) {
        return;
    }


    group.classList.remove(
        "invalid"
    );


    const error =
        group.querySelector(
            ".fi-error"
        );


    if (error) {

        error.textContent =
            "";

    }

}



/* =========================================================
   REMOVE ERRORS ON INPUT
========================================================= */

leadForm
    ?.querySelectorAll(
        "input, select"
    )
    .forEach(
        input => {

            input.addEventListener(

                "input",

                () => {

                    clearError(
                        input
                    );

                }

            );


            input.addEventListener(

                "change",

                () => {

                    clearError(
                        input
                    );

                }

            );

        }
    );



/* =========================================================
   PREVENT NORMAL FORM SUBMIT
========================================================= */

leadForm?.addEventListener(

    "submit",

    event => {

        event.preventDefault();

        submitLeadForm();

    }

);



/* =========================================================
   SUBMIT
========================================================= */

async function submitLeadForm() {
    if (leadForm.dataset.saving === "true") return;

    if (
        !validateForm()
    ) {

        return;
    }


    const formData =
        new FormData(
            leadForm
        );


    const estimate =
        calculateEstimate();


    const payload = {

        name:
            formData.get(
                "name"
            ),

        email:
            formData.get(
                "email"
            ),

        phone:
            formData.get(
                "phone"
            ),

        city:
            formData.get(
                "city"
            ),

        whatsappConsent:
            formData.get(
                "whatsappConsent"
            ) === "on",

        bhk:
            state.bhk,

        size:
            state.size,

        sizeLabel:
            state.sizeLabel,

        rooms: {

            ...state.rooms

        },

        package:
            state.package,

        estimateLow:
            estimate.low,

        estimateHigh:
            estimate.high,

        source:
            "Full Interior Calculator",

        page:
            window.location.href

    };


    /*
    =========================================================

    CONNECT YOUR EXISTING FIREBASE /
    GOOGLE SHEET / CRM HERE.

    payload contains complete calculator data.

    Example:
    await addDoc(...payload)

    =========================================================
    */


    console.log(
        "Full Interior Calculator Lead:",
        payload
    );


    leadForm.dataset.saving = 'true';
    try {
        await submitLead({...payload, formId:'interior_calculator', leadType:'calculator', calculatorType:'interior'});
        showResult(estimate);
    } catch(error) { console.error(error); alert('Your estimate could not be saved. Please try again.'); }
    finally { leadForm.dataset.saving = 'false'; }

}



/* =========================================================
   CALCULATE
========================================================= */

function calculateEstimate() {

    let total =
        PRICING.bhkBase[
            state.bhk
        ] || 0;


    /*
     ROOM COST
    */

    Object.entries(
        state.rooms
    )
    .forEach(
        (
            [
                room,
                quantity
            ]
        ) => {

            const roomPrice =
                PRICING.rooms[
                    room
                ] || 0;


            total +=
                roomPrice *
                quantity;

        }
    );


    /*
     SIZE MULTIPLIER
    */

    const sizeMultiplier =
        PRICING.sizeMultiplier[
            state.size
        ] ||
        PRICING.sizeMultiplier.default;


    total *=
        sizeMultiplier;


    /*
     PACKAGE MULTIPLIER
    */

    const packageMultiplier =
        PRICING.packageMultiplier[
            state.package
        ] || 1;


    total *=
        packageMultiplier;


    /*
     RANGE
    */

    const low =
        Math.round(
            (
                total *
                PRICING.range.low
            ) /
            10000
        ) *
        10000;


    const high =
        Math.round(
            (
                total *
                PRICING.range.high
            ) /
            10000
        ) *
        10000;


    return {

        total,

        low,

        high

    };

}



/* =========================================================
   SHOW RESULT
========================================================= */

function showResult(
    estimate
) {

    calculatorSection.style.display =
        "none";


    document
        .querySelector(
            ".fi-stepper-section"
        )
        .style.display =
        "none";


    document
        .querySelector(
            ".fi-hero"
        )
        .style.display =
        "none";


    resultSection.hidden =
        false;


    const price =
        document.getElementById(
            "fiEstimatedPrice"
        );


    if (price) {

        price.textContent =
            `${formatIndianPrice(
                estimate.low
            )} – ${formatIndianPrice(
                estimate.high
            )}*`;

    }


    populateResultSummary();


    window.scrollTo({

        top:
            resultSection.offsetTop - 30,

        behavior:
            "smooth"

    });

}



/* =========================================================
   RESULT SUMMARY
========================================================= */

function populateResultSummary() {

    const property =
        document.getElementById(
            "fiResultProperty"
        );


    const size =
        document.getElementById(
            "fiResultSize"
        );


    const packageElement =
        document.getElementById(
            "fiResultPackage"
        );


    const roomSummary =
        document.getElementById(
            "fiRoomSummary"
        );


    if (property) {

        property.textContent =
            state.bhk === 5
                ? "5 BHK+"
                : `${state.bhk} BHK`;

    }


    if (size) {

        size.textContent =
            state.sizeLabel ||
            "Standard";

    }


    if (packageElement) {

        packageElement.textContent =
            capitalize(
                state.package
            );

    }


    if (roomSummary) {

        roomSummary.innerHTML =
            Object.entries(
                state.rooms
            )
            .filter(
                (
                    [
                        ,
                        quantity
                    ]
                ) =>
                    quantity > 0
            )
            .map(
                (
                    [
                        room,
                        quantity
                    ]
                ) => `

                    <div class="fi-room-summary-item">

                        <span>
                            ${getRoomLabel(room)}
                        </span>

                        <strong>
                            × ${quantity}
                        </strong>

                    </div>

                `
            )
            .join("");

    }

}



/* =========================================================
   DETAILED SUMMARY
========================================================= */

const summaryToggle =
    document.getElementById(
        "fiSummaryToggle"
    );


const detailedSummary =
    document.getElementById(
        "fiDetailedSummary"
    );


summaryToggle?.addEventListener(

    "click",

    () => {

        const open =
            detailedSummary
                .classList
                .toggle(
                    "open"
                );


        summaryToggle
            .classList
            .toggle(
                "open",
                open
            );


        summaryToggle
            .childNodes[0]
            .textContent =
            open
                ? " Hide detailed summary "
                : " View detailed summary ";

    }

);



/* =========================================================
   RECALCULATE
========================================================= */

document
    .getElementById(
        "fiRecalculateBtn"
    )
    ?.addEventListener(

        "click",

        () => {

            resultSection.hidden =
                true;


            calculatorSection.style.display =
                "";


            document
                .querySelector(
                    ".fi-stepper-section"
                )
                .style.display =
                "";


            document
                .querySelector(
                    ".fi-hero"
                )
                .style.display =
                "";


            showStep(
                1
            );

        }

    );



/* =========================================================
   FORMAT PRICE
========================================================= */

function formatIndianPrice(
    value
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return "₹0";

    }


    /*
     1 Crore+
    */

    if (
        value >=
        10000000
    ) {

        const crore =
            value /
            10000000;


        return (
            `₹${trimNumber(
                crore
            )}Cr`
        );

    }


    /*
     Lakhs
    */

    if (
        value >=
        100000
    ) {

        const lakh =
            value /
            100000;


        return (
            `₹${trimNumber(
                lakh
            )}L`
        );

    }


    return (
        "₹" +
        Math.round(
            value
        )
        .toLocaleString(
            "en-IN"
        )
    );

}



/* =========================================================
   TRIM NUMBER
========================================================= */

function trimNumber(
    value
) {

    return Number(
        value.toFixed(
            2
        )
    )
    .toString();

}



/* =========================================================
   ROOM LABEL
========================================================= */

function getRoomLabel(
    room
) {

    const labels = {

        living:
            "Living Room",

        kitchen:
            "Modular Kitchen",

        bedroom:
            "Bedroom",

        bathroom:
            "Bathroom",

        dining:
            "Dining Area",

        study:
            "Study / Office",

        pooja:
            "Pooja Unit"

    };


    return (
        labels[room] ||
        room
    );

}



/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(
    value = ""
) {

    if (!value) {
        return "—";
    }


    return (
        value
            .charAt(0)
            .toUpperCase() +
        value.slice(1)
    );

}



/* =========================================================
   INITIALISE
========================================================= */

updateRoomUI();

updateStepper();

updateNavigation();

updateSummary();