/* =========================================================
   ECON KITCHEN — ADMIN
   Uses existing firebase-config.js and Firestore rules.
========================================================= */

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const $ = selector => document.querySelector(selector);

const UI = {
    loginScreen: $("#loginScreen"),
    loginForm: $("#loginForm"),
    loginStatus: $("#loginStatus"),
    loginButton: $("#loginButton"),
    app: $("#app"),
    sidebar: $("#sidebar"),
    overlay: $("#sidebarOverlay"),
    menu: $("#menuButton"),
    pageTitle: $("#pageTitle"),
    breadcrumb: $("#breadcrumbTitle"),
    description: $("#pageDescription"),
    status: $("#pageStatus"),
    leadSection: $("#leadSection"),
    contentSection: $("#contentSection"),
    rows: $("#leadRows"),
    collection: $("#contentCollection"),
    contentRecords: $("#contentRecords"),
    leadDialog: $("#leadDialog"),
    contentDialog: $("#contentDialog")
};

const STATUSES = {
    new: "New",
    contacted: "Contacted",
    "follow-up": "Follow-up",
    converted: "Converted",
    closed: "Closed"
};

const FORM_LABELS = {
    contact_consultation: "Contact enquiry",
    kitchen_consultation: "Kitchen consultation",
    interior_consultation: "Interior consultation",
    wardrobe_consultation: "Wardrobe consultation",
    box_partner: "BOX partner enquiry",
    shutter_partner: "Shutters enquiry",
    kitchen_estimator: "Kitchen calculator",
    wardrobe_calculator: "Wardrobe calculator",
    interior_calculator: "Interior calculator"
};

const COLLECTIONS = {
    heroSlides: {
        label: "Homepage banners",
        fields: ["title", "subtitle", "image"]
    },
    services: {
        label: "Services",
        fields: ["title", "description", "image", "link"]
    },
    categories: {
        label: "Categories",
        fields: ["title", "description", "image", "slug"]
    },
    gallery: {
        label: "Gallery",
        fields: ["title", "image", "category"]
    },
    why: {
        label: "Why choose us",
        fields: ["number", "title", "description"]
    },
    projects: {
        label: "Projects",
        fields: ["title", "location", "image", "description"]
    },
    testimonials: {
        label: "Testimonials",
        fields: ["quote", "name", "location"]
    },
    blogs: {
        label: "Blogs",
        fields: ["title", "excerpt", "image", "content"]
    },
    faqs: {
        label: "FAQs",
        fields: ["question", "answer"]
    },
    pricing: {
        label: "Pricing",
        fields: ["kitchenBase", "wardrobeBase", "interiorBase"]
    }
};

const LONG_FIELDS = new Set([
    "description", "content", "answer", "quote", "excerpt"
]);

const NUMERIC_FIELDS = new Set([
    "kitchenBase", "wardrobeBase", "interiorBase"
]);

const state = {
    view: "customer",
    leads: [],
    content: [],
    collection: "heroSlides",
    page: 1,
    selectedLead: null,
    editingContent: null,
    loading: false,
    authorised: false,
    session: 0
};

let auth;
let db;
let requestVersion = 0;
let savingLead = false;
let savingContent = false;
let pendingDelete = false;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

function labelFor(key) {
    return String(key)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/^./, letter => letter.toUpperCase());
}

function statusOf(record) {
    return String(record.status || "new").toLowerCase();
}

function sourceOf(record) {
    return FORM_LABELS[record.formId] ||
        record.source ||
        record.formId ||
        "Website enquiry";
}

function isCalculator(record) {
    return record.leadType === "calculator" ||
        Boolean(record.calculatorType || record.calculator) ||
        /calculator|estimator/i.test(
            `${record.formId || ""} ${record.source || ""}`
        );
}

function customerOf(record) {
    const customer = record.customer || {};

    return {
        name: record.name || customer.name || "",
        phone: record.phone || customer.phone || "",
        email: record.email || customer.email || "",
        city: record.city || record.location || customer.city || ""
    };
}

function dateOf(value) {
    if (!value) return null;

    let date;

    if (typeof value.toDate === "function") {
        date = value.toDate();
    } else if (typeof value.seconds === "number") {
        date = new Date(value.seconds * 1000);
    } else {
        date = new Date(value);
    }

    return Number.isNaN(date.getTime()) ? null : date;
}

function displayDate(value) {
    const date = dateOf(value);

    if (!date) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata"
    });
}

function dateKey(value) {
    const date = dateOf(value);

    if (!date) return "";

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const get = type => parts.find(part => part.type === type)?.value;

    return `${get("year")}-${get("month")}-${get("day")}`;
}

function setPageStatus(message = "") {
    UI.status.textContent = message;
}

function friendlyError(error) {
    if (error.code === "permission-denied") {
        return "Access denied. Check the admins/UID document and published Firestore rules.";
    }

    if (error.code === "unavailable") {
        return "Firebase is unavailable. Check your internet connection and try again.";
    }

    return error.message || "Something went wrong. Please try again.";
}

function setSidebar(open) {
    UI.sidebar.classList.toggle("open", open);
    UI.overlay.classList.toggle("hidden", !open);
    UI.menu.setAttribute("aria-expanded", String(open));
}

function baseLeads() {
    return state.leads.filter(record =>
        state.view === "calculator"
            ? isCalculator(record)
            : !isCalculator(record)
    );
}

function filteredLeads() {
    const query = $("#leadSearch").value.trim().toLowerCase();
    const form = $("#formFilter").value;
    const status = $("#statusFilter").value;
    const from = $("#dateFrom").value;
    const to = $("#dateTo").value;

    return baseLeads().filter(record => {
        const customer = customerOf(record);

        const searchText = [
            customer.name,
            customer.phone,
            customer.email,
            customer.city,
            record.business,
            record.message,
            sourceOf(record)
        ].join(" ").toLowerCase();

        const received = dateKey(record.createdAt);

        return (
            (!query || searchText.includes(query)) &&
            (!form || record.formId === form) &&
            (!status || statusOf(record) === status) &&
            (!from || (received && received >= from)) &&
            (!to || (received && received <= to))
        );
    });
}

function rebuildFormFilter() {
    const select = $("#formFilter");
    const previous = select.value;

    const forms = [...new Set(
        baseLeads().map(record => record.formId).filter(Boolean)
    )];

    select.innerHTML =
        '<option value="">All forms</option>' +
        forms.map(id => `
            <option value="${escapeHTML(id)}">
                ${escapeHTML(FORM_LABELS[id] || id)}
            </option>
        `).join("");

    select.value = forms.includes(previous) ? previous : "";
}

function renderLeads() {
    const all = baseLeads();
    const filtered = filteredLeads();

    $("#totalCount").textContent = all.length;

    $("#newCount").textContent = all.filter(
        record => statusOf(record) === "new"
    ).length;

    $("#contactedCount").textContent = all.filter(
        record => statusOf(record) === "contacted"
    ).length;

    const size = Number($("#pageSize").value);
    const pages = Math.max(1, Math.ceil(filtered.length / size));

    state.page = Math.min(state.page, pages);

    const start = (state.page - 1) * size;
    const pageRecords = filtered.slice(start, start + size);

    UI.rows.innerHTML = pageRecords.length
        ? pageRecords.map(record => {
            const customer = customerOf(record);
            const status = statusOf(record);
            const statusClass = Object.hasOwn(STATUSES, status)
                ? `status-${status}`
                : "";

            const phoneLink = String(customer.phone)
                .replace(/[^\d+]/g, "");

            return `
                <tr>
                    <td>
                        <strong>${escapeHTML(customer.name || "—")}</strong>
                        ${
                            record.business
                                ? `<small>${escapeHTML(record.business)}</small>`
                                : ""
                        }
                    </td>

                    <td class="contact-cell">
                        ${
                            phoneLink
                                ? `<a href="tel:${escapeHTML(phoneLink)}">
                                    ${escapeHTML(customer.phone)}
                                   </a>`
                                : "—"
                        }

                        <small>${escapeHTML(customer.email || "—")}</small>
                    </td>

                    <td>${escapeHTML(customer.city || "—")}</td>

                    <td class="source-cell">
                        ${escapeHTML(sourceOf(record))}
                    </td>

                    <td class="date-cell">
                        ${escapeHTML(displayDate(record.createdAt))}
                    </td>

                    <td>
                        <span class="status-badge ${statusClass}">
                            ${escapeHTML(STATUSES[status] || status)}
                        </span>
                    </td>

                    <td>
                        <button type="button" class="view-button"
                            data-lead-id="${escapeHTML(record.id)}">
                            View details →
                        </button>
                    </td>
                </tr>
            `;
        }).join("")
        : `
            <tr>
                <td colspan="7" class="empty-cell">
                    No leads found for this selection.
                </td>
            </tr>
        `;

    $("#resultCount").textContent = filtered.length
        ? `Showing ${start + 1}–${Math.min(start + size, filtered.length)} of ${filtered.length} leads`
        : "Showing 0 leads";

    $("#pageNumber").textContent = `${state.page} / ${pages}`;
    $("#previousPage").disabled = state.page <= 1;
    $("#nextPage").disabled = state.page >= pages;
}

/* READABLE DETAILS — INCLUDING NESTED CALCULATOR FIELDS */

function readableHTML(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value?.toDate === "function") {
        return escapeHTML(displayDate(value));
    }

    if (Array.isArray(value)) {
        if (!value.length) return "None";

        return value.map(item => readableHTML(item)).join("<br>");
    }

    if (typeof value === "object") {
        return `
            <div class="nested-details">
                ${
                    Object.entries(value).map(([key, item]) => `
                        <span class="nested-line">
                            <b>${escapeHTML(labelFor(key))}</b><br>
                            ${readableHTML(item)}
                        </span>
                    `).join("")
                }
            </div>
        `;
    }

    return escapeHTML(value);
}

function detailField(label, value, full = false) {
    return `
        <div class="${full ? "full-width" : ""}">
            <dt>${escapeHTML(label)}</dt>
            <dd>${readableHTML(value)}</dd>
        </div>
    `;
}

function openLead(id) {
    const record = state.leads.find(item => item.id === id);

    if (!record) return;

    state.selectedLead = id;

    const customer = customerOf(record);

    $("#leadMeta").innerHTML = `
        <span class="source-tag">${escapeHTML(sourceOf(record))}</span>
        <span>${escapeHTML(displayDate(record.createdAt))}</span>
    `;

    $("#customerDetails").innerHTML = [
        detailField("Name", customer.name),
        detailField("Phone", customer.phone),
        detailField("Email", customer.email),
        detailField("City / Location", customer.city)
    ].join("");

    const excluded = new Set([
        "id", "name", "phone", "email", "city", "location",
        "customer", "status", "notes", "createdAt", "updatedAt",
        "formId", "source", "leadType", "schemaVersion"
    ]);

    const remaining = Object.entries(record).filter(
        ([key]) => !excluded.has(key)
    );

    // Preserve any additional customer fields, such as consent.
    const extraCustomer = Object.fromEntries(
        Object.entries(record.customer || {}).filter(
            ([key]) => !["name", "phone", "email", "city"].includes(key)
        )
    );

    if (Object.keys(extraCustomer).length) {
        remaining.push(["Customer preferences", extraCustomer]);
    }

    $("#requirementDetails").innerHTML = remaining.length
        ? remaining.map(([key, value]) => detailField(
            labelFor(key),
            value,
            typeof value === "object" ||
            ["message", "page", "sourcePage"].includes(key)
        )).join("")
        : detailField("Requirement", "No additional details supplied.", true);

    const status = statusOf(record);
    const select = $("#detailStatus");

    select.querySelector('[data-legacy-status]')?.remove();

    if (!Object.hasOwn(STATUSES, status)) {
        const option = document.createElement("option");

        option.value = status;
        option.textContent = labelFor(status);
        option.dataset.legacyStatus = "";

        select.appendChild(option);
    }

    select.value = status;
    $("#detailNotes").value = record.notes || "";
    $("#leadSaveStatus").textContent = "";

    UI.leadDialog.showModal();
}

/* CMS */

function updateCollectionOptions() {
    const entries = state.view === "pricing"
        ? [["pricing", COLLECTIONS.pricing]]
        : Object.entries(COLLECTIONS).filter(([key]) => key !== "pricing");

    UI.collection.innerHTML = entries.map(([key, config]) => `
        <option value="${key}">${escapeHTML(config.label)}</option>
    `).join("");

    if (!entries.some(([key]) => key === state.collection)) {
        state.collection = entries[0][0];
    }

    UI.collection.value = state.collection;
}

function renderContent() {
    UI.contentRecords.innerHTML = state.content.length
        ? state.content.map(record => `
            <article class="content-record">
                <div>
                    <strong>
                        ${escapeHTML(
                            record.title ||
                            record.name ||
                            record.question ||
                            COLLECTIONS[state.collection].label
                        )}
                    </strong>
                    <small>${escapeHTML(record.id)}</small>
                </div>

                <div class="content-actions">
                    <button type="button" class="button"
                        data-edit-content="${escapeHTML(record.id)}">
                        Edit
                    </button>

                    <button type="button" class="button danger"
                        data-delete-content="${escapeHTML(record.id)}">
                        Delete
                    </button>
                </div>
            </article>
        `).join("")
        : '<p class="empty-cell">No records yet. Use Add record to create one.</p>';
}

function openContentEditor(record = null) {
    state.editingContent = {
        id: record?.id || null,
        collection: state.collection
    };

    $("#contentDialogTitle").textContent = record
        ? `Edit ${COLLECTIONS[state.collection].label}`
        : `Add ${COLLECTIONS[state.collection].label}`;

    $("#contentSaveStatus").textContent = "";

    $("#contentFields").innerHTML =
        COLLECTIONS[state.collection].fields.map(field => {
            const value = record?.[field] ?? "";

            if (LONG_FIELDS.has(field)) {
                return `
                    <label>
                        ${escapeHTML(labelFor(field))}
                        <textarea name="${field}" rows="4">${escapeHTML(value)}</textarea>
                    </label>
                `;
            }

            return `
                <label>
                    ${escapeHTML(labelFor(field))}
                    <input
                        name="${field}"
                        type="${NUMERIC_FIELDS.has(field) ? "number" : "text"}"
                        ${NUMERIC_FIELDS.has(field) ? 'min="0" step="any"' : ""}
                        value="${escapeHTML(value)}">
                </label>
            `;
        }).join("");

    UI.contentDialog.showModal();
}

/* LOAD DATA */

async function loadData() {
    if (!state.authorised) return;

    const version = ++requestVersion;
    const session = state.session;
    const leadView = ["customer", "calculator"].includes(state.view);
    const collectionName = leadView ? "leads" : state.collection;

    state.loading = true;

    $("#refreshButton").disabled = true;
    setPageStatus("Loading records...");

    try {
        const snapshot = await getDocs(collection(db, collectionName));

        if (
            version !== requestVersion ||
            session !== state.session ||
            !state.authorised
        ) {
            return;
        }

        const data = snapshot.docs.map(item => ({
            ...item.data(),
            id: item.id
        }));

        if (leadView) {
            state.leads = data.sort((a, b) =>
                (dateOf(b.createdAt)?.getTime() || 0) -
                (dateOf(a.createdAt)?.getTime() || 0)
            );

            rebuildFormFilter();
            renderLeads();
        } else {
            state.content = data;
            renderContent();
        }

        $("#lastUpdated").textContent =
            `Updated ${displayDate(new Date())}`;

        setPageStatus(
            state.view === "pricing"
                ? "These settings apply to pages that read the pricing collection. Existing estimator pricing remains in its calculator configuration."
                : ""
        );

    } catch (error) {
        if (version === requestVersion && session === state.session) {
            setPageStatus(friendlyError(error));
        }
    } finally {
        if (version === requestVersion) {
            state.loading = false;
            $("#refreshButton").disabled = false;
        }
    }
}

async function switchView(view) {
    if (!state.authorised) return;

    state.view = view;
    state.page = 1;

    setSidebar(false);

    document.querySelectorAll("[data-view]").forEach(button => {
        button.classList.toggle("active", button.dataset.view === view);
    });

    const config = {
        customer: [
            "Customer Leads",
            "View and manage enquiries from your website."
        ],
        calculator: [
            "Calculator Leads",
            "Review calculator selections, dimensions and estimates."
        ],
        content: [
            "Website Content",
            "Manage content records used by your website."
        ],
        pricing: [
            "Pricing",
            "Manage the Firebase pricing collection."
        ]
    }[view];

    UI.pageTitle.textContent = config[0];
    UI.breadcrumb.textContent = config[0];
    UI.description.textContent = config[1];

    const leadView = ["customer", "calculator"].includes(view);

    UI.leadSection.classList.toggle("hidden", !leadView);
    UI.contentSection.classList.toggle("hidden", leadView);

    $("#exportCsvButton").classList.toggle("hidden", !leadView);
    $("#exportJsonButton").classList.toggle("hidden", !leadView);

    if (leadView) {
        $("#formFilter").value = "";
        rebuildFormFilter();
        renderLeads();
    } else {
        updateCollectionOptions();
        state.content = [];
        renderContent();
    }

    await loadData();
}

/* EXPORT — ALL FILTERED ROWS, NOT ONLY CURRENT PAGE */

function download(text, type, filename) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function flattenRecord(record) {
    const result = {};

    function visit(value, path) {
        if (typeof value?.toDate === "function") {
            result[path] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
            result[path] = JSON.stringify(value);
        } else if (value && typeof value === "object") {
            const entries = Object.entries(value);

            if (!entries.length) result[path] = "";

            entries.forEach(([key, child]) => {
                visit(child, path ? `${path}.${key}` : key);
            });
        } else {
            result[path] = value ?? "";
        }
    }

    Object.entries(record).forEach(([key, value]) => visit(value, key));

    return result;
}

function csvCell(value) {
    let text = String(value ?? "");

    // Prevent spreadsheet formulas from executing on exported text.
    if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) {
        text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
}

function exportLeads(format) {
    if (!state.authorised || state.loading) return;

    const records = filteredLeads();

    if (!records.length) {
        setPageStatus("There are no matching leads to export.");
        return;
    }

    const filename = `econ-${state.view}-leads-${dateKey(new Date())}`;

    if (format === "json") {
        const serialisable = JSON.stringify(records, (key, value) => {
            if (
                value &&
                typeof value === "object" &&
                typeof value.seconds === "number" &&
                typeof value.nanoseconds === "number"
            ) {
                return new Date(value.seconds * 1000).toISOString();
            }

            return value;
        }, 2);

        download(serialisable, "application/json", `${filename}.json`);
        return;
    }

    const flat = records.map(flattenRecord);
    const columns = [...new Set(flat.flatMap(record => Object.keys(record)))];

    const csv = [
        columns.map(csvCell).join(","),
        ...flat.map(record =>
            columns.map(column => csvCell(record[column])).join(",")
        )
    ].join("\r\n");

    download("\uFEFF" + csv, "text/csv;charset=utf-8", `${filename}.csv`);
}

/* EVENTS */

UI.menu.addEventListener("click", () => {
    setSidebar(!UI.sidebar.classList.contains("open"));
});

UI.overlay.addEventListener("click", () => setSidebar(false));

document.addEventListener("keydown", event => {
    if (event.key === "Escape") setSidebar(false);
});

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        if (
            (button.dataset.close === "leadDialog" && savingLead) ||
            (button.dataset.close === "contentDialog" && savingContent)
        ) return;

        document.getElementById(button.dataset.close).close();
    });
});

UI.leadDialog.addEventListener("cancel", event => {
    if (savingLead) event.preventDefault();
});

UI.contentDialog.addEventListener("cancel", event => {
    if (savingContent) event.preventDefault();
});

document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
});

$("#refreshButton").addEventListener("click", loadData);

UI.collection.addEventListener("change", () => {
    state.collection = UI.collection.value;
    state.content = [];
    renderContent();
    loadData();
});

$("#addContentButton").addEventListener("click", () => openContentEditor());

for (const id of [
    "leadSearch", "formFilter", "statusFilter", "dateFrom", "dateTo", "pageSize"
]) {
    document.getElementById(id).addEventListener(
        id === "leadSearch" ? "input" : "change",
        () => {
            state.page = 1;
            renderLeads();
        }
    );
}

$("#clearFilters").addEventListener("click", () => {
    for (const id of [
        "leadSearch", "formFilter", "statusFilter", "dateFrom", "dateTo"
    ]) {
        document.getElementById(id).value = "";
    }

    state.page = 1;
    renderLeads();
});

$("#previousPage").addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderLeads();
});

$("#nextPage").addEventListener("click", () => {
    state.page++;
    renderLeads();
});

UI.rows.addEventListener("click", event => {
    const button = event.target.closest("[data-lead-id]");
    if (button) openLead(button.dataset.leadId);
});

$("#exportCsvButton").addEventListener("click", () => exportLeads("csv"));
$("#exportJsonButton").addEventListener("click", () => exportLeads("json"));

$("#leadDetailsForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (savingLead || !state.authorised || !state.selectedLead) return;

    const id = state.selectedLead;
    const session = state.session;
    const button = $("#saveLeadButton");
    const message = $("#leadSaveStatus");

    const changes = {
        status: $("#detailStatus").value,
        notes: $("#detailNotes").value.trim(),
        updatedAt: serverTimestamp()
    };

    savingLead = true;
    button.disabled = true;
    button.textContent = "Saving...";
    message.textContent = "";

    try {
        await updateDoc(doc(db, "leads", id), changes);

        if (session !== state.session || !state.authorised) return;

        const record = state.leads.find(item => item.id === id);

        if (record) {
            record.status = changes.status;
            record.notes = changes.notes;
        }

        renderLeads();
        UI.leadDialog.close();
        setPageStatus("Lead updated successfully.");

    } catch (error) {
        if (session === state.session) {
            message.textContent = friendlyError(error);
        }
    } finally {
        savingLead = false;
        button.disabled = false;
        button.textContent = "Save changes";
    }
});

UI.contentRecords.addEventListener("click", async event => {
    const editButton = event.target.closest("[data-edit-content]");
    const deleteButton = event.target.closest("[data-delete-content]");

    if (editButton) {
        const record = state.content.find(
            item => item.id === editButton.dataset.editContent
        );

        if (record) openContentEditor(record);
    }

    if (deleteButton && !pendingDelete && state.authorised) {
        const id = deleteButton.dataset.deleteContent;
        const targetCollection = state.collection;

        if (!window.confirm("Permanently delete this content record?")) return;

        pendingDelete = true;
        deleteButton.disabled = true;

        try {
            await deleteDoc(doc(db, targetCollection, id));
            await loadData();
        } catch (error) {
            setPageStatus(friendlyError(error));
        } finally {
            pendingDelete = false;
            deleteButton.disabled = false;
        }
    }
});

$("#contentForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (savingContent || !state.authorised || !state.editingContent) return;

    const editing = { ...state.editingContent };
    const data = Object.fromEntries(new FormData(event.target));

    for (const key of Object.keys(data)) {
        data[key] = String(data[key]).trim();

        if (NUMERIC_FIELDS.has(key)) {
            const number = Number(data[key]);

            if (data[key] === "" || !Number.isFinite(number) || number < 0) {
                $("#contentSaveStatus").textContent =
                    "Enter a valid non-negative number for " + labelFor(key) + ".";
                return;
            }

            data[key] = number;
        }
    }

    if (!Object.values(data).some(value => value !== "")) {
        $("#contentSaveStatus").textContent =
            "Please fill in at least one field.";
        return;
    }

    savingContent = true;
    $("#saveContentButton").disabled = true;
    $("#saveContentButton").textContent = "Saving...";
    $("#contentSaveStatus").textContent = "";

    try {
        if (editing.id) {
            await updateDoc(doc(db, editing.collection, editing.id), data);
        } else {
            await addDoc(collection(db, editing.collection), data);
        }

        UI.contentDialog.close();
        await loadData();

    } catch (error) {
        $("#contentSaveStatus").textContent = friendlyError(error);
    } finally {
        savingContent = false;
        $("#saveContentButton").disabled = false;
        $("#saveContentButton").textContent = "Save record";
    }
});

/* FIREBASE AUTHENTICATION */

UI.loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!auth) return;

    UI.loginButton.disabled = true;
    UI.loginButton.textContent = "Signing in...";
    UI.loginStatus.textContent = "";

    try {
        await signInWithEmailAndPassword(
            auth,
            $("#loginEmail").value.trim(),
            $("#loginPassword").value
        );
    } catch (error) {
        const messages = {
            "auth/invalid-credential": "Email or password is incorrect.",
            "auth/wrong-password": "Email or password is incorrect.",
            "auth/user-not-found": "Email or password is incorrect.",
            "auth/too-many-requests": "Too many attempts. Please try again later.",
            "auth/network-request-failed": "Check your internet connection."
        };

        UI.loginStatus.textContent =
            messages[error.code] || friendlyError(error);

    } finally {
        UI.loginButton.disabled = false;
        UI.loginButton.textContent = "Sign in";
    }
});

$("#logoutButton").addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        setPageStatus(friendlyError(error));
    }
});

function resetSession() {
    state.authorised = false;
    state.leads = [];
    state.content = [];
    state.selectedLead = null;
    state.editingContent = null;
    state.page = 1;
    state.loading = false;

    requestVersion++;

    UI.rows.innerHTML = "";
    UI.contentRecords.innerHTML = "";

    $("#customerDetails").replaceChildren();
    $("#requirementDetails").replaceChildren();
    $("#leadMeta").replaceChildren();
    $("#detailNotes").value = "";
    $("#contentFields").replaceChildren();
    $("#adminIdentity").textContent = "Admin";
    $("#lastUpdated").textContent = "";

    UI.leadDialog.close();
    UI.contentDialog.close();

    UI.app.classList.add("hidden");
    UI.loginScreen.classList.add("hidden");

    setSidebar(false);
}

try {
    if (
        !firebaseConfig?.apiKey ||
        firebaseConfig.apiKey.startsWith("YOUR_") ||
        !firebaseConfig.projectId ||
        firebaseConfig.projectId.startsWith("YOUR_")
    ) {
        throw new Error(
            "Add your Firebase Web App configuration in assets/js/firebase-config.js."
        );
    }

    const firebaseApp = getApps().length
        ? getApp()
        : initializeApp(firebaseConfig);

    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);

onAuthStateChanged(auth, async user => {
    const session = ++state.session;
    const loading = document.getElementById("authLoading");

    loading?.classList.remove("hidden");

    resetSession();

    if (!user) {
        UI.loginStatus.textContent = "";
        $("#loginPassword").value = "";

        UI.loginScreen.classList.remove("hidden");
        loading?.classList.add("hidden");

        return;
    }

    try {
        const permission = await getDoc(
            doc(db, "admins", user.uid)
        );

        // Ignore an outdated check if the account changed.
        if (session !== state.session) return;

        if (!permission.exists()) {
            UI.loginStatus.textContent =
                "This account has no admin access. Create admins/" +
                user.uid +
                " in Firestore, then sign in again.";

            UI.loginScreen.classList.remove("hidden");

            return;
        }

        state.authorised = true;

        UI.loginStatus.textContent = "";
        $("#loginPassword").value = "";

        // Reset password visibility on entering the dashboard.
        const password = $("#loginPassword");
        const toggle = $("#togglePassword");

        password.type = "password";

        if (toggle) {
            toggle.setAttribute("aria-label", "Show password");
            toggle.setAttribute("aria-pressed", "false");

            toggle.querySelector(".eye-show")
                ?.classList.remove("hidden");

            toggle.querySelector(".eye-hide")
                ?.classList.add("hidden");
        }

        $("#adminIdentity").textContent =
            user.email || "Admin";

        // Prepare dashboard while the loading screen is visible.
        await switchView("customer");

        if (
            session !== state.session ||
            !state.authorised
        ) {
            return;
        }

        UI.loginScreen.classList.add("hidden");
        UI.app.classList.remove("hidden");

    } catch (error) {
        if (session !== state.session) return;

        UI.loginStatus.textContent = friendlyError(error);
        UI.loginScreen.classList.remove("hidden");

    } finally {
        if (session === state.session) {
            loading?.classList.add("hidden");
        }
    }
});

} catch (error) {
    document.getElementById("authLoading")
        ?.classList.add("hidden");

    UI.loginScreen.classList.remove("hidden");
    UI.loginStatus.textContent = friendlyError(error);
    UI.loginButton.disabled = true;
}
const passwordInput = document.getElementById("loginPassword");
const passwordToggle = document.getElementById("togglePassword");

if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener("click", () => {
        const visible = passwordInput.type === "password";

        passwordInput.type = visible ? "text" : "password";

        passwordToggle.setAttribute(
            "aria-label",
            visible ? "Hide password" : "Show password"
        );

        passwordToggle.setAttribute(
            "aria-pressed",
            String(visible)
        );

        passwordToggle.querySelector(".eye-show")
            .classList.toggle("hidden", visible);

        passwordToggle.querySelector(".eye-hide")
            .classList.toggle("hidden", !visible);
    });
}