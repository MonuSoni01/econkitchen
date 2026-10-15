/* ECON — Full Interior data. Reference photos are placeholders.
   Replace each photo URL with your own product/project image when ready. */
export const interiorPhoto = id =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;

export const interiorCategories = [
  ["all", "All Interiors"], ["full-home", "Full Home"],
  ["living-room", "Living Room"], ["bedroom", "Bedroom"],
  ["dining", "Dining"], ["kitchen", "Modular Kitchen"],
  ["wardrobe", "Wardrobe"], ["doors", "Doors"],
  ["mandir", "Mandir"], ["tv-unit", "TV Unit"],
  ["pvc-panel", "PVC Panels"], ["cnc", "CNC Cutting"]
];

// Each panel has four selectable design concepts.
export const interiorSections = [
  { key: "living-room", label: "Living Room", icon: "fa-couch",
    title: "Spaces for everyday living.", description: "Seating, entertainment, display and storage planned together.",
    features: ["Seating layout", "TV & display storage", "Lighting planning"],
    variants: [
      {"label": "Modern", "description": "A clean arrangement with practical seating and a coordinated TV wall.", "photo": "photo-1600210492486-724fe5c67fb0"},
      {"label": "Contemporary", "description": "Warm textures and layered lighting for relaxed family living.", "photo": "photo-1600566753086-00f18fb6b3ea"},
      {"label": "Minimal", "description": "Simple furniture and uncluttered storage for a calm interior.", "photo": "photo-1600585152915-d208bec867a1"},
      {"label": "Luxury", "description": "Statement finishes and custom furniture for a refined living space.", "photo": "photo-1600585154340-be6161a56a0c"},
    ]
  },
  { key: "kitchen", label: "Modular Kitchen", icon: "fa-kitchen-set",
    title: "A kitchen made for your space.", description: "Explore practical layouts, finishes and organised kitchen storage.",
    features: ["Cabinet planning", "Kitchen storage", "Hardware selection"],
    variants: [
      {"label": "Straight", "description": "A single-wall layout for compact spaces and simple movement.", "photo": "photo-1556912167-f556f1f39fdf"},
      {"label": "L-Shaped", "description": "A corner layout with connected preparation and cooking areas.", "photo": "photo-1556911220-bff31c812dba"},
      {"label": "U-Shaped", "description": "Three connected counters for generous storage and work space.", "photo": "photo-1556912172-45b7abe8b7e1"},
      {"label": "Parallel", "description": "Two facing counters with separate preparation and cooking zones.", "photo": "photo-1556911220-e15b29be8c8f"},
    ]
  },
  { key: "bedroom", label: "Bedroom", icon: "fa-bed",
    title: "Your own quiet corner.", description: "Bedrooms with considered furniture, storage and lighting.",
    features: ["Bed & headboard", "Wardrobe planning", "Bedside storage"],
    variants: [
      {"label": "Master", "description": "A restful master bedroom with coordinated storage and finishes.", "photo": "photo-1616594039964-ae9021a400a0"},
      {"label": "Kids", "description": "Flexible storage and study planning for a growing child.", "photo": "photo-1617104678098-de229db51175"},
      {"label": "Guest", "description": "A welcoming guest bedroom with practical furniture and storage.", "photo": "photo-1615874694520-474822394e73"},
      {"label": "Study", "description": "A bedroom with an integrated desk and organised work area.", "photo": "photo-1616486338812-3dadae4b4ace"},
    ]
  },
  { key: "wardrobe", label: "Wardrobe", icon: "fa-door-closed",
    title: "Storage that belongs in your room.", description: "Choose shutters and internal storage around your daily routine.",
    features: ["Hanging & shelf planning", "Drawer storage", "Shutter finish selection"],
    variants: [
      {"label": "Sliding", "description": "Sliding shutters for rooms with limited opening space.", "photo": "photo-1616486338812-3dadae4b4ace"},
      {"label": "Hinged", "description": "Full-access hinged shutters with flexible internal storage.", "photo": "photo-1615874694520-474822394e73"},
      {"label": "Mirror", "description": "Mirror shutters combining dressing and storage functions.", "photo": "photo-1616594039964-ae9021a400a0"},
      {"label": "Walk-In", "description": "A dedicated dressing space with organised clothing and accessory zones.", "photo": "photo-1600210492486-724fe5c67fb0"},
    ]
  },
  { key: "doors", label: "Doors", icon: "fa-door-open",
    title: "First impressions begin here.", description: "Main doors, room doors and decorative door concepts.",
    features: ["Size customisation", "Finish coordination", "Hardware planning"],
    variants: [
      {"label": "Main Door", "description": "An entrance concept coordinated with the home material palette.", "photo": "photo-1600566753190-17f0baa2a6c3"},
      {"label": "Bedroom Door", "description": "Room door finishes that complement the bedroom interior.", "photo": "photo-1600585154526-990dced4db0d"},
      {"label": "Designer Door", "description": "A decorative door concept with personalised patterns and finishes.", "photo": "photo-1600566753051-f0b89df2dd90"},
      {"label": "CNC Door", "description": "Precision-cut decorative detailing planned for a suitable door substrate.", "photo": "photo-1600585152915-d208bec867a1"},
    ]
  },
  { key: "mandir", label: "Mandir", icon: "fa-place-of-worship",
    title: "A thoughtful space for devotion.", description: "Pooja units planned around your traditions and available space.",
    features: ["Pooja storage", "Decorative backdrop", "Lighting provision"],
    variants: [
      {"label": "Wall Mounted", "description": "A compact wall-mounted pooja unit for smaller homes.", "photo": "photo-1600210492486-724fe5c67fb0"},
      {"label": "Floor Standing", "description": "A dedicated floor-standing unit with pooja storage.", "photo": "photo-1600566753190-17f0baa2a6c3"},
      {"label": "CNC Mandir", "description": "A pooja concept with decorative CNC patterns and lighting.", "photo": "photo-1600585152915-d208bec867a1"},
      {"label": "Custom Mandir", "description": "A personalised mandir planned around your dimensions and requirements.", "photo": "photo-1600585154340-be6161a56a0c"},
    ]
  },
  { key: "tv-unit", label: "TV Unit", icon: "fa-tv",
    title: "Make your entertainment wall work.", description: "TV consoles with display, storage and cable planning.",
    features: ["Console storage", "Cable management planning", "Display shelves"],
    variants: [
      {"label": "Modern", "description": "A clean TV wall with a balanced console and display space.", "photo": "photo-1600210492486-724fe5c67fb0"},
      {"label": "Floating", "description": "A wall-mounted console that keeps the floor visually open.", "photo": "photo-1600566753086-00f18fb6b3ea"},
      {"label": "Storage", "description": "An entertainment unit with integrated cabinets and shelves.", "photo": "photo-1600585152915-d208bec867a1"},
      {"label": "Luxury", "description": "A feature TV wall with coordinated finishes and lighting.", "photo": "photo-1600585154340-be6161a56a0c"},
    ]
  },
  { key: "pvc-panel", label: "PVC Panels", icon: "fa-layer-group",
    title: "Give your walls a new character.", description: "Decorative PVC wall panel concepts for selected interior areas.",
    features: ["Pattern selection", "Wall measurement", "Finish coordination"],
    variants: [
      {"label": "Fluted", "description": "Fluted panel styling creates vertical rhythm on a feature wall.", "photo": "photo-1600566753051-f0b89df2dd90"},
      {"label": "Marble Look", "description": "A marble-look decorative wall concept with coordinated colours.", "photo": "photo-1600585154340-be6161a56a0c"},
      {"label": "Wood Look", "description": "Wood-look panel styling for warmth and visual texture.", "photo": "photo-1600210492486-724fe5c67fb0"},
      {"label": "Accent Wall", "description": "A custom accent-wall arrangement for your room.", "photo": "photo-1600566753086-00f18fb6b3ea"},
    ]
  },
  { key: "cnc", label: "CNC Cutting", icon: "fa-vector-square",
    title: "Patterns with a personal touch.", description: "Decorative jaali, partitions, mandir backdrops and custom CNC concepts.",
    features: ["Pattern development", "Material selection", "Custom dimensions"],
    variants: [
      {"label": "Jaali", "description": "A decorative jaali pattern selected for a suitable material.", "photo": "photo-1600585152915-d208bec867a1"},
      {"label": "Partition", "description": "A patterned partition for visual separation between spaces.", "photo": "photo-1600566753190-17f0baa2a6c3"},
      {"label": "Mandir Backdrop", "description": "A decorative pooja backdrop planned with the mandir design.", "photo": "photo-1600210492486-724fe5c67fb0"},
      {"label": "Custom Pattern", "description": "A personalised cutting pattern developed for your project.", "photo": "photo-1600585154340-be6161a56a0c"},
    ]
  },
 ];

// Existing IDs and slugs remain available to the current detail page.
const existingRecords = [
  [1, "Warm Contemporary Living Room", "warm-contemporary-living-room", "living-room", "photo-1600210492486-724fe5c67fb0"],
  [2, "Minimal Luxury Living Room", "minimal-luxury-living-room", "living-room", "photo-1600566753086-00f18fb6b3ea"],
  [3, "Modern TV Wall Living Room", "modern-tv-wall-living-room", "living-room", "photo-1600585152915-d208bec867a1"],
  [4, "Luxury Living Room Interior", "luxury-living-room-interior", "living-room", "photo-1600585154340-be6161a56a0c"],
  [5, "Calm Modern Master Bedroom", "calm-modern-master-bedroom", "bedroom", "photo-1616594039964-ae9021a400a0"],
  [6, "Premium Bedroom with Study", "premium-bedroom-with-study", "bedroom", "photo-1616486338812-3dadae4b4ace"],
  [7, "Kids Bedroom with Smart Storage", "kids-bedroom-smart-storage", "bedroom", "photo-1617104678098-de229db51175"],
  [8, "Luxury Master Bedroom", "luxury-master-bedroom", "bedroom", "photo-1615874694520-474822394e73"],
  [9, "Modern Dining with Crockery Unit", "modern-dining-with-crockery-unit", "dining", "photo-1617806118233-18e1de247200"],
  [10, "Compact Dining Space", "compact-dining-space", "dining", "photo-1600566753051-f0b89df2dd90"],
  [11, "Premium Dining Room", "premium-dining-room", "dining", "photo-1600210492486-724fe5c67fb0"],
  [12, "Dining with Pooja Unit", "dining-with-pooja-unit", "dining", "photo-1600566753190-17f0baa2a6c3"],
  [13, "Modern 1BHK Complete Interior", "modern-1bhk-complete-interior", "full-home", "photo-1600607688969-a5bfcd646154"],
  [14, "Modern 2BHK Complete Interior", "modern-2bhk-complete-interior", "full-home", "photo-1600585154526-990dced4db0d"],
  [15, "Premium 2BHK Complete Interior", "premium-2bhk-complete-interior", "full-home", "photo-1600566753190-17f0baa2a6c3"],
  [16, "Premium 3BHK Complete Interior", "premium-3bhk-complete-interior", "full-home", "photo-1600566753086-00f18fb6b3ea"],
  [17, "Contemporary 3BHK Full Home", "contemporary-3bhk-full-home", "full-home", "photo-1600566753086-00f18fb6b3ea"],
  [18, "Luxury 4BHK Complete Interior", "luxury-4bhk-complete-interior", "full-home", "photo-1600585154340-be6161a56a0c"],
  [19, "Luxury Villa Interior", "luxury-villa-interior", "full-home", "photo-1600047509807-ba8f99d2cdde"],
  [20, "Contemporary Full Home Interior", "contemporary-full-home-interior", "full-home", "photo-1600607687920-4e2a09cf159d"],
 ];
const slugify = text => text.toLowerCase().replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryLabel = key => interiorCategories.find(c => c[0] === key)?.[1] || key;
function makeDesign(id, title, slug, category, photo, index, description = "") {
  const section = interiorSections.find(s => s.key === category);
  const series = ["essential", "premium", "signature"][index % 3];
  const features = section?.features ||
    ["Room-wise planning", "Coordinated finishes", "Custom storage"];
  const image = interiorPhoto(photo);
  const copy = description || `${title}: coordinated space planning, furniture and finishes tailored to your home.`;
  return {
    id, slug, title, category, categoryLabel: categoryLabel(category),
    series, style: ["modern", "contemporary", "classic", "luxury"][index % 4],
    image, main_image: image, images: [image], size: "Custom Size",
    finish: "Customisable finishes", material: "Selected during consultation",
    badge: series.toUpperCase(), shortDescription: copy, description: copy,
    features: [...features],
    specifications: [
      { label: "Space", value: categoryLabel(category) },
      { label: "Size", value: "Custom Size" },
      { label: "Finish", value: "Customisable" }
    ],
    faqs: [
      { question: "Can this design be customised?", answer: "Yes. Dimensions, storage and suitable finishes are planned around your requirements." },
      { question: "How do I get a quotation?", answer: "Share your measurements and requirements through the consultation form." }
    ]
  };
}
export const fullInteriorDesigns = existingRecords.map(
  (record, index) => makeDesign(...record, index)
);
let nextId = 21;
for (const section of interiorSections) {
  if (["living-room", "bedroom"].includes(section.key)) continue;
  section.variants.forEach((variant, index) => {
    const title = section.key === "doors" || variant.label.includes(section.label)
      ? `${variant.label} Design` : `${variant.label} ${section.label} Design`;
    fullInteriorDesigns.push(makeDesign(nextId++, title, slugify(title),
      section.key, variant.photo, index, variant.description));
  });
}
// A mixed opening batch; all designs remain accessible through the top filters.
export const featuredInteriorIds = [1, 5, 21, 33, 14];
export const fullInteriorPackages = ["1bhk", "2bhk", "3bhk", "villa"].map(id => ({
  id, title: id === "villa" ? "Villa" : id.toUpperCase(),
  calculatorUrl: `/full-interior-calculator.html?type=${id}`
}));
// Compatibility exports for other pages that use this data file.
export const fullInteriorSpaces = interiorSections.map(s => ({
  id: s.key, title: s.label, image: interiorPhoto(s.variants[0].photo),
  target: `#${s.key}`
}));
const legacyVariantKeys = {
  kitchen: ["straight", "lShaped", "uShaped", "parallel"],
  wardrobe: ["sliding", "hinged", "mirror", "walkIn"],
  doors: ["main", "bedroom", "designer", "cnc"],
  mandir: ["wallMounted", "floorStanding", "cnc", "custom"],
  "tv-unit": ["modern", "floating", "storage", "luxury"],
  "living-room": ["modern", "contemporary", "minimal", "luxury"],
  bedroom: ["master", "kids", "guest", "luxury"],
  cnc: ["jali", "partitions", "panels", "featureWalls"]
};
export const fullInteriorFeatureImages = Object.fromEntries(interiorSections.map(s => [
  s.key === "living-room" ? "livingRoom" : s.key === "tv-unit" ? "tvUnit" : s.key,
  Object.fromEntries(s.variants.map((v,index) => [
    legacyVariantKeys[s.key]?.[index] || v.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    { title: v.label, label: v.label, description: v.description, image: interiorPhoto(v.photo) }
  ]))
]));
fullInteriorFeatureImages.visualisation = {
  planning2D: {title:"2D Planning", image:interiorPhoto("photo-1600607687920-4e2a09cf159d")},
  design3D: {title:"3D Design", image:interiorPhoto("photo-1600585154340-be6161a56a0c")}
};
fullInteriorFeatureImages.calculator = {image:interiorPhoto("photo-1600585154526-990dced4db0d")};