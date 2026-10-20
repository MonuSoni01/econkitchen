/* =========================================================
   ECON KITCHEN — KITCHEN COMPARISON

   Features:
   - Five-step questionnaire
   - Explainable recommendation
   - Session-only questionnaire persistence
   - Existing Firebase submitLead() integration
   - Duplicate submission protection
   - Accessible success dialog

   Uses existing allowed form:
   formId: kitchen_consultation
   leadType: consultation

   Distinguishes this page through:
   enquiryCategory, source and sourcePage
========================================================= */

(() => {
  "use strict";

  const page = document.querySelector(".kc-page");

  if (!page || window.__econComparisonLoaded) return;

  window.__econComparisonLoaded = true;

  const SESSION_KEY = "econKitchenComparison.v1";

  const quizForm = document.getElementById("kcQuizForm");
  const questionHost = document.getElementById("kcQuizQuestion");
  const quizStep = document.getElementById("kcQuizStep");
  const progress = document.getElementById("kcQuizProgress");
  const quizStatus = document.getElementById("kcQuizStatus");
  const backButton = document.getElementById("kcQuizBack");
  const nextButton = document.getElementById("kcQuizNext");
  const resultHost = document.getElementById("kcQuizResult");

  const enquiryForm = document.getElementById("kcEnquiryForm");
  const enquiryStatus = document.getElementById("kcEnquiryStatus");
  const submitButton = document.getElementById("kcSubmitButton");
  const answerNotice = document.getElementById("kcAnswerNotice");

  const successDialog = document.getElementById("kcSuccessDialog");
  const successClose = document.getElementById("kcSuccessClose");
  const successDone = document.getElementById("kcSuccessDone");

  const questions = [
    {
      key: "project",
      title: "Aap kya plan kar rahe hain?",
      options: [
        {
          value: "new",
          label: "New Kitchen",
          description: "Pura naya kitchen banwana hai.",
          icon: "fa-house"
        },
        {
          value: "upgrade",
          label: "Kitchen Upgrade",
          description: "Existing kitchen mein changes.",
          icon: "fa-screwdriver-wrench"
        },
        {
          value: "exploring",
          label: "Still Exploring",
          description: "Abhi options samajh raha hoon.",
          icon: "fa-compass"
        }
      ]
    },
    {
      key: "budget",
      title: "Aapka approximate kitchen budget?",
      options: [
        {
          value: "under_150k",
          label: "Under ₹1.5 Lakh",
          description: "Scope aur specifications discuss karein.",
          icon: "fa-indian-rupee-sign"
        },
        {
          value: "150k_300k",
          label: "₹1.5–3 Lakh",
          description: "Requirements ke hisaab se planning.",
          icon: "fa-wallet"
        },
        {
          value: "above_300k",
          label: "Above ₹3 Lakh",
          description: "Detailed scope aur options explore karein.",
          icon: "fa-layer-group"
        },
        {
          value: "not_decided",
          label: "Not Decided",
          description: "Pehle costing samajhna chahta hoon.",
          icon: "fa-circle-question"
        }
      ]
    },
    {
      key: "priority",
      title: "Aapke liye sabse important kya hai?",
      options: [
        {
          value: "finish",
          label: "Uniform Finish",
          description: "Coordinated look aur neat detailing.",
          icon: "fa-wand-magic-sparkles"
        },
        {
          value: "flexibility",
          label: "Site Flexibility",
          description: "Kaam ke dauran adjustments.",
          icon: "fa-sliders"
        },
        {
          value: "less_site_work",
          label: "Less Site Work",
          description: "Ghar par fabrication kam ho.",
          icon: "fa-house-circle-check"
        }
      ]
    },
    {
      key: "involvement",
      title: "Kaam ka coordination kaise chahenge?",
      options: [
        {
          value: "self",
          label: "Main Supervise Karunga",
          description: "Material aur daily work mein involved.",
          icon: "fa-user-gear"
        },
        {
          value: "team",
          label: "Team Coordinate Kare",
          description: "Planning aur execution ka support.",
          icon: "fa-people-group"
        },
        {
          value: "unsure",
          label: "Need Guidance",
          description: "Dono approaches samajhna chahta hoon.",
          icon: "fa-comments"
        }
      ]
    },
    {
      key: "timeline",
      title: "Aap kab tak kitchen plan kar rahe hain?",
      options: [
        {
          value: "soon",
          label: "As Soon As Possible",
          description: "Feasibility aur availability discuss karein.",
          icon: "fa-clock"
        },
        {
          value: "one_three_months",
          label: "1–3 Months",
          description: "Design aur scope plan kar sakte hain.",
          icon: "fa-calendar-days"
        },
        {
          value: "research",
          label: "Just Researching",
          description: "Abhi information collect kar raha hoon.",
          icon: "fa-magnifying-glass"
        }
      ]
    }
  ];

  let answers = {};
  let currentStep = 0;
  let completed = false;
  let saving = false;
  let firebasePromise = null;
  let previousOverflow = "";

  function validAnswer(key, value) {
    const question = questions.find(item => item.key === key);

    return Boolean(
      question &&
      question.options.some(option => option.value === value)
    );
  }

  function allAnswered() {
    return questions.every(question =>
      validAnswer(question.key, answers[question.key])
    );
  }

  function restoreSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));

      if (!saved || saved.version !== 1) return;

      for (const question of questions) {
        const value = saved.answers?.[question.key];

        if (validAnswer(question.key, value)) {
          answers[question.key] = value;
        }
      }

      currentStep = Number.isInteger(saved.step)
        ? Math.max(0, Math.min(saved.step, questions.length - 1))
        : 0;

      const firstMissing = questions.findIndex(question =>
        !validAnswer(question.key, answers[question.key])
      );

      if (firstMissing !== -1) {
        currentStep = Math.min(currentStep, firstMissing);
      }

      completed = saved.completed === true && allAnswered();

    } catch {
      // The questionnaire still works when storage is unavailable.
    }
  }

  function persistSession() {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          version: 1,
          answers,
          step: currentStep,
          completed
        })
      );
    } catch {
      // Session storage is optional.
    }
  }

  function createIcon(className) {
    const icon = document.createElement("i");
    icon.className = `fa-solid ${className}`;
    icon.setAttribute("aria-hidden", "true");

    return icon;
  }

  function renderQuestion(moveFocus = false) {
    const question = questions[currentStep];

    questionHost.replaceChildren();

    const fieldset = document.createElement("fieldset");
    fieldset.className = "kc-question-fieldset";

    const legend = document.createElement("legend");
    legend.textContent = question.title;
    legend.tabIndex = -1;

    const options = document.createElement("div");
    options.className = "kc-question-options";

    question.options.forEach(option => {
      const label = document.createElement("label");
      label.className = "kc-choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = question.key;
      input.value = option.value;
      input.checked = answers[question.key] === option.value;

      const content = document.createElement("span");
      content.className = "kc-choice-content";

      const title = document.createElement("strong");
      title.textContent = option.label;

      const description = document.createElement("small");
      description.textContent = option.description;

      content.append(createIcon(option.icon), title, description);
      label.append(input, content);
      options.append(label);

      input.addEventListener("change", () => {
        answers[question.key] = option.value;
        quizStatus.textContent = "";
        persistSession();
        updateAnswerNotice();
      });
    });

    fieldset.append(legend, options);
    questionHost.append(fieldset);

    quizStep.textContent = `Step ${currentStep + 1} of ${questions.length}`;
    progress.value = currentStep + 1;

    backButton.hidden = currentStep === 0;

    nextButton.replaceChildren(
      document.createTextNode(
        currentStep === questions.length - 1
          ? "See My Guidance "
          : "Continue "
      ),
      createIcon("fa-arrow-right")
    );

    quizStatus.textContent = "";

    if (moveFocus) legend.focus();
  }

  function getRecommendation() {
    let factoryScore = 0;
    let carpenterScore = 0;

    const factoryReasons = [];
    const carpenterReasons = [];

    if (answers.priority === "finish") {
      factoryScore += 2;
      factoryReasons.push(
        "Aapki priority uniform finish aur coordinated detailing hai."
      );
    }

    if (answers.priority === "less_site_work") {
      factoryScore += 2;
      factoryReasons.push(
        "Aap ghar par fabrication aur site work kam rakhna chahte hain."
      );
    }

    if (answers.priority === "flexibility") {
      carpenterScore += 2;
      carpenterReasons.push(
        "Aap kaam ke dauran site par adjustments ki flexibility chahte hain."
      );
    }

    if (answers.involvement === "team") {
      factoryScore += 1;
      factoryReasons.push(
        "Aap planning aur execution ke liye coordinated team support prefer karte hain."
      );
    }

    if (answers.involvement === "self") {
      carpenterScore += 1;
      carpenterReasons.push(
        "Aap material selection aur daily supervision mein involved reh sakte hain."
      );
    }

    // Budget and deadline inform the enquiry, not a quality assumption.
    // A limited upgrade needs a scope review before recommending a method.
    if (answers.project === "upgrade") {
      return {
        type: "hybrid",
        title: "Carpenter-led ya Hybrid Approach Explore Karein",
        description:
          "Existing kitchen ke changes mein pehle current structure aur required work check karna useful hoga.",
        reasons: [
          "Aap existing kitchen ko upgrade karna chahte hain.",
          "Site adjustments aur factory-made components ka combination bhi suitable ho sakta hai."
        ]
      };
    }

    if (factoryScore > carpenterScore) {
      return {
        type: "factory",
        title: "Factory-Finished Aapke Liye Better Fit Ho Sakta Hai",
        description:
          "Aapke selected answers planned design aur off-site manufacturing ki taraf point karte hain.",
        reasons: factoryReasons
      };
    }

    if (carpenterScore > factoryScore) {
      return {
        type: "carpenter",
        title: "Carpenter-Led Approach Practical Ho Sakti Hai",
        description:
          "Aapki priorities site flexibility aur direct involvement se match karti hain.",
        reasons: carpenterReasons
      };
    }

    return {
      type: "review",
      title: "Dono Approaches Ka Scope Compare Karein",
      description:
        "Aapki requirements mein mixed priorities hain. Detailed discussion ke baad clearer direction mil sakti hai.",
      reasons: [
        "Aapki selected priorities ek hi approach ki taraf clearly point nahi karti.",
        "Measurements, scope aur same-specification quotations compare karna useful hoga."
      ]
    };
  }

  function showResult(moveFocus = true) {
    const recommendation = getRecommendation();

    quizForm.hidden = true;
    resultHost.hidden = false;
    resultHost.replaceChildren();

    quizStep.textContent = "Completed";
    progress.value = questions.length;

    const label = document.createElement("span");
    label.className = "kc-result-label";
    label.textContent = "YOUR KITCHEN GUIDANCE";

    const title = document.createElement("h3");
    title.className = "kc-result-title";
    title.textContent = recommendation.title;
    title.tabIndex = -1;

    const description = document.createElement("p");
    description.textContent = recommendation.description;

    const reasons = document.createElement("ul");
    reasons.className = "kc-result-reasons";

    recommendation.reasons.forEach(reason => {
      const item = document.createElement("li");
      item.textContent = reason;
      reasons.append(item);
    });

    const note = document.createElement("p");
    note.className = "kc-result-note";
    note.textContent =
      "Yeh initial guidance hai. Final suitability site measurements, material, scope aur available services par depend karegi.";

    const actions = document.createElement("div");
    actions.className = "kc-result-actions";

    const enquire = document.createElement("a");
    enquire.className = "kc-btn";
    enquire.href = "#kitchenEnquiry";
    enquire.textContent = "Discuss My Requirements";
    enquire.append(createIcon("fa-arrow-right"));

    enquire.addEventListener("click", () => {
      window.setTimeout(() => {
        document.getElementById("kcName").focus({
          preventScroll: true
        });
      }, 0);
    });

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "kc-text-button";
    restart.textContent = "Retake Questions";

    restart.addEventListener("click", () => {
      answers = {};
      currentStep = 0;
      completed = false;

      persistSession();
      updateAnswerNotice();

      resultHost.hidden = true;
      quizForm.hidden = false;

      renderQuestion(true);
    });

    actions.append(enquire, restart);

    resultHost.append(
      label,
      title,
      description,
      reasons,
      note,
      actions
    );

    updateAnswerNotice();

    if (moveFocus) title.focus();
  }

  function updateAnswerNotice() {
    answerNotice.hidden = Object.keys(answers).length === 0;
  }

  quizForm.addEventListener("submit", event => {
    event.preventDefault();

    const question = questions[currentStep];

    if (!validAnswer(question.key, answers[question.key])) {
      quizStatus.textContent = "Please select an option to continue.";
      questionHost.querySelector("input")?.focus();
      return;
    }

    if (currentStep < questions.length - 1) {
      currentStep++;
      persistSession();
      renderQuestion(true);
      return;
    }

    completed = allAnswered();
    persistSession();
    showResult();
  });

  backButton.addEventListener("click", () => {
    if (currentStep === 0) return;

    currentStep--;
    persistSession();
    renderQuestion(true);
  });

  function labelledAnswers() {
    const values = {};

    questions.forEach(question => {
      const option = question.options.find(
        item => item.value === answers[question.key]
      );

      if (option) {
        values[question.key] = option.label;
      }
    });

    return values;
  }

  function normalisePhone(value) {
    let digits = String(value || "").replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    return digits;
  }

  async function loadFirebase() {
    if (!firebasePromise) {
      firebasePromise = import("./firebase.js").catch(error => {
        firebasePromise = null;
        throw error;
      });
    }

    return firebasePromise;
  }

  function setEnquiryStatus(message, state = "") {
    enquiryStatus.textContent = message;
    enquiryStatus.dataset.state = state;
  }

  function openSuccess() {
    if (typeof successDialog.showModal !== "function") return;

    previousOverflow = document.body.style.overflow;
    successDialog.showModal();
    document.body.style.overflow = "hidden";
    successDone.focus();
  }

  function closeSuccess() {
    if (successDialog.open) successDialog.close();
  }

  successClose.addEventListener("click", closeSuccess);
  successDone.addEventListener("click", closeSuccess);

  successDialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    submitButton.focus({ preventScroll: true });
  });

  enquiryForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (saving || !enquiryForm.reportValidity()) return;

    setEnquiryStatus("");

    const name = enquiryForm.elements.name.value.trim();
    const phone = normalisePhone(enquiryForm.elements.phone.value);
    const city = enquiryForm.elements.city.value.trim();

    if (name.length < 2) {
      setEnquiryStatus("Please enter your name.", "error");
      enquiryForm.elements.name.focus();
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setEnquiryStatus(
        "Please enter a valid 10-digit Indian mobile number.",
        "error"
      );
      enquiryForm.elements.phone.focus();
      return;
    }

    if (city.length < 2) {
      setEnquiryStatus("Please enter your city.", "error");
      enquiryForm.elements.city.focus();
      return;
    }

    const recommendation = completed && allAnswered()
      ? getRecommendation()
      : null;

    const payload = {
      name,
      phone,
      city,

      // Existing consultation ID used for compatibility.
      formId: "kitchen_consultation",
      leadType: "consultation",

      source: "Carpenter vs Factory Kitchen Comparison",
      enquiryCategory: "carpenter_vs_factory",

      questionnaire: {
        version: 1,
        completed: Boolean(recommendation),
        answers: labelledAnswers(),
        answerValues: { ...answers }
      },

      recommendation: recommendation
        ? {
            type: recommendation.type,
            title: recommendation.title,
            reasons: recommendation.reasons
          }
        : {
            type: "not_completed",
            title: "Customer requested guidance without a completed quiz",
            reasons: []
          },

      message:
        "Customer requested kitchen planning guidance from the Carpenter vs Factory comparison page."
    };

    // Store campaign attribution only when present.
    const query = new URLSearchParams(window.location.search);
    const campaign = {};

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term"
    ].forEach(key => {
      const value = query.get(key);

      if (value) campaign[key] = value.slice(0, 200);
    });

    if (Object.keys(campaign).length) {
      payload.campaign = campaign;
    }

    saving = true;
    submitButton.disabled = true;
    enquiryForm.setAttribute("aria-busy", "true");

    const buttonLabel = submitButton.querySelector("span");
    const originalLabel = buttonLabel.textContent;
    const fields = [...enquiryForm.querySelectorAll("input")];
    const originalDisabled = fields.map(field => field.disabled);

    fields.forEach(field => {
      field.disabled = true;
    });

    buttonLabel.textContent = "Submitting…";

    setEnquiryStatus("Please wait while we submit your details.");

    let saved = false;

    try {
      const firebase = await loadFirebase();

      if (typeof firebase.submitLead !== "function") {
        throw new Error("submitLead is not available.");
      }

      const result = await firebase.submitLead(payload);

      if (!result || result.ok !== true) {
        throw new Error("Firebase did not confirm the submission.");
      }

      saved = true;
      enquiryForm.reset();

      setEnquiryStatus(
        "Thank you! Your enquiry has been received.",
        "success"
      );

      openSuccess();

    } catch (error) {
      console.error(
        "Kitchen comparison enquiry:",
        error?.code || error?.message || "Unknown error"
      );

      if (saved) {
        setEnquiryStatus(
          "Thank you! Your enquiry has been received.",
          "success"
        );
      } else {
        setEnquiryStatus(
          "Your enquiry could not be submitted. Please try again. Your details are still in the form.",
          "error"
        );
      }

    } finally {
      saving = false;
      submitButton.disabled = false;
      buttonLabel.textContent = originalLabel;
      enquiryForm.removeAttribute("aria-busy");

      fields.forEach((field, index) => {
        field.disabled = originalDisabled[index];
      });
    }
  });

  restoreSession();

  if (completed) {
    showResult(false);
  } else {
    renderQuestion();
  }

  updateAnswerNotice();
})();