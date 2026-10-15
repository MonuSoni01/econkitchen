# ECON Firebase setup
1. In Firebase Console, create/select your project. Add a Web App and copy its firebaseConfig object into assets/js/firebase-config.js. These are Web App settings, not a service account key.
2. Create Firestore Database. Enable Authentication > Email/Password. Create your admin login.
3. Create Firestore document admins/ADMIN_AUTH_UID with role: "admin" using Firebase Console.
4. Publish the supplied firestore.rules in Firestore > Rules. Or run firebase deploy --only firestore:rules after selecting your project with Firebase CLI.
5. Serve the project from its root using a web server. Optional Firebase Hosting: firebase use --add, then firebase deploy --only hosting.
6. Submit each of the six enquiry forms and three calculators. Verify a document in leads with the matching formId, full values and createdAt. The calculator result opens after a successful write.
7. Open /admin/, sign in and select leads. Filter by form, expand complete records, refresh or export JSON. Admin reads require the admins/UID document, not just an Authentication account.

## Database and API access
All nine active lead sources write to leads/{autoId}. Every document has formId, leadType, source, sourcePage, schemaVersion, status and a server createdAt timestamp. Enquiry fields are top-level. Kitchen records include layout, dimensions, runningFeet, package, packageRate and estimate. Wardrobe records include customer, wardrobe and estimatedPrice. Interior records include bhk, size, rooms, package, estimateLow and estimateHigh.
The Firebase SDK is the API client; a separate custom HTTP server is not included or required for these submissions.
To fetch from a different browser admin page, use the same Firebase Web config, sign in with Firebase Authentication, then call getDocs(collection(db, 'leads')). The signed-in UID must have an admins/UID document. For server-side integrations, use Firebase Admin SDK with server-managed credentials; never put service account credentials in frontend code. Public reads of customer data are denied.

## Coverage and limits
Contact, Modular Kitchen Consultation, Full Interior Consultation, Wardrobe Consultation, ECON BOX and Shutters are connected. Kitchen, Wardrobe and Interior calculators are connected.
forms.html still has six empty link placeholders. No actual referral form is present in this source; no referral fields have been invented. External form links do not automatically forward their responses to Firebase.
Existing documents in websiteLeads are not migrated automatically. Existing localStorage drafts are not automatically uploaded.
Pricing formulas and page styling are retained. Firebase credentials were not supplied, so a live project write/read test must be completed after setup. No cloud resources were created by this ZIP.
