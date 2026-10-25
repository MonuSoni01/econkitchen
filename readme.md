# ECON Kitchen Premium Website + Firebase CMS

## Setup
1. Create a Firebase project and Web App.
2. Enable **Firestore Database** and **Authentication > Email/Password**.
3. Paste Firebase Web App credentials in `assets/js/firebase-config.js`.
4. Deploy `firestore.rules`.
5. Create your admin user in Firebase Authentication. Copy its UID and create Firestore document `admins/{UID}` with `{ role: "admin" }`.
6. Open `/admin/` and sign in.
7. Manage hero slides, services, categories, gallery, why-choose cards, projects, testimonials, blogs, FAQs, calculator pricing and leads.

## Collections
`admins`, `heroSlides`, `services`, `categories`, `gallery`, `why`, `projects`, `testimonials`, `blogs`, `faqs`, `pricing`, `leads`, `siteSettings`.

## Important
- Public website uses fallback demo content until Firestore content exists.
- Admin image fields currently accept image URLs. For production, Firebase Storage upload can be added later without changing the content model.
- Calculator figures are indicative only. Configure base rates from the `pricing` collection in admin.
- Run via a web server (Firebase Hosting, Netlify, etc.), not by double-clicking HTML files, because shared components use `fetch()`.
