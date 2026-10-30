import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';
export const db = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_') ? getFirestore(getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export async function rows(name) { if (!db) return []; try { return (await getDocs(collection(db, name))).docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { console.warn(name, e); return []; } }
export async function submitLead(data) {
    if (!db) throw new Error('Firebase is not configured. Add your Web App config in assets/js/firebase-config.js.');
    const payload = JSON.parse(JSON.stringify(data));
    payload.name = String(payload.name || payload.customer?.name || '').trim();
    payload.phone = String(payload.phone || payload.customer?.phone || '').replace(/\D/g, '').replace(/^(?:91|0)(?=[6-9]\d{9}$)/, '');
    if (!payload.name || !/^[6-9]\d{9}$/.test(payload.phone)) throw new Error('Invalid name or mobile number.');
    const record = { ...payload, schemaVersion: 1, formId: payload.formId || 'unknown', leadType: payload.leadType || 'enquiry', source: payload.source || document.title, sourcePage: location.pathname, status: 'new', createdAt: serverTimestamp() };
   const saved = await addDoc(collection(db, 'leads'), record);

let sheetSynced = null;

if (
    payload.formId === "kitchen_consultation" &&
    payload.enquiryCategory === "carpenter_vs_factory"
) {
    sheetSynced = false;

    try {
        const sheetPayload = {
            ...payload,
            leadId: saved.id,
            sourcePage: location.pathname
        };

        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbynNr5q4BC3JCiZu8nChTDG7r5ZyWrzDV8uIeYRBtmZ2EEQ6gUwzVqtYQ4pgd0zyMk/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(sheetPayload),
                redirect: "follow"
            }
        );

        if (!response.ok) {
            throw new Error(
                `Google Sheet HTTP error: ${response.status}`
            );
        }

        const result = await response.json();

        if (result.ok !== true) {
            throw new Error(
                result.error || "Google Sheet save not confirmed"
            );
        }

        sheetSynced = true;

    } catch (error) {
        // Firebase entry is already saved.
        // Do not ask the customer to submit again.
        console.error(
            "Comparison lead saved in Firebase; Sheet sync not confirmed:",
            error
        );
    }
}

return {
    ok: true,
    id: saved.id,
    sheetSynced
};
}
