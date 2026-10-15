import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';
export const db = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_') ? getFirestore(getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export async function rows(name) { if (!db) return []; try { return (await getDocs(collection(db,name))).docs.map(d=>({id:d.id,...d.data()})); } catch(e) { console.warn(name,e); return []; } }
export async function submitLead(data) {
 if (!db) throw new Error('Firebase is not configured. Add your Web App config in assets/js/firebase-config.js.');
 const payload = JSON.parse(JSON.stringify(data));
 payload.name = String(payload.name || payload.customer?.name || '').trim();
 payload.phone = String(payload.phone || payload.customer?.phone || '').replace(/\D/g,'').replace(/^(?:91|0)(?=[6-9]\d{9}$)/,'');
 if(!payload.name || !/^[6-9]\d{9}$/.test(payload.phone)) throw new Error('Invalid name or mobile number.');
 const record = {...payload, schemaVersion:1, formId:payload.formId || 'unknown', leadType:payload.leadType || 'enquiry', source:payload.source || document.title, sourcePage:location.pathname, status:'new', createdAt:serverTimestamp()};
 const saved = await addDoc(collection(db,'leads'), record);
 return {ok:true,id:saved.id};
}
