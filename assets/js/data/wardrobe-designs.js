/* =========================================================
   ECON — WARDROBE DESIGNS DATA
   Dummy Collection Data 
========================================================= */
function getWardrobeImage(index) {

    return `/assets/images/wardrobe/${index}.webp`;

}
/* =========================================================
   WARDROBE DESIGNS
========================================================= */

export const wardrobeDesigns = [
    {
        id: 1,
        slug: "modern-sliding-wardrobe-01",
        title: "Modern Sliding Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "sliding",
        categoryLabel: "Sliding Door Wardrobe",
        package: "essentials",
        packageLabel: "Essentials",

        image:
            getWardrobeImage(1),

        images: [
            getWardrobeImage(1),
            getWardrobeImage(2),
            getWardrobeImage(3)
        ],

        size: "8 ft × 7 ft",
        finish: "Matte Laminate",
        material: "HDF-HMR",

        description:
            "A clean modern sliding wardrobe designed for practical everyday storage and compact bedrooms.",

        features: [
            "Space-Saving Sliding Doors",
            "Multiple Storage Shelves",
            "Full-Length Hanging Space",
            "Internal Drawers",
            "Soft-Close Sliding System"
        ]
    },

    {
        id: 2,
        slug: "modern-sliding-wardrobe-02",
        title: "Modern Two-Tone Sliding Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "sliding",
        categoryLabel: "Sliding Door Wardrobe",
        package: "premium",
        packageLabel: "Premium",

        image:
    getWardrobeImage(2),

images:[
    getWardrobeImage(2),
    getWardrobeImage(3),
    getWardrobeImage(4)
],

        size: "9 ft × 7 ft",
        finish: "Dual-Tone Laminate",
        material: "Plywood",

        description:
            "A contemporary two-tone sliding wardrobe with organised storage and a refined modern appearance.",

        features: [
            "Dual-Tone Finish",
            "Premium Sliding Track",
            "Internal Drawer Unit",
            "Adjustable Shelves",
            "Dedicated Hanging Area"
        ]
    },

    {
        id: 3,
        slug: "modern-sliding-wardrobe-03",
        title: "Modern Floor-to-Ceiling Sliding Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "sliding",
        categoryLabel: "Sliding Door Wardrobe",
        package: "luxe",
        packageLabel: "Luxe",

        image:
    getWardrobeImage(3),

images:[
    getWardrobeImage(3),
    getWardrobeImage(4),
    getWardrobeImage(5)
],

        size: "10 ft × 9 ft",
        finish: "Premium Acrylic",
        material: "Plywood",

        description:
            "A full-height sliding wardrobe designed to maximise vertical storage while maintaining a premium modern look.",

        features: [
            "Floor-to-Ceiling Storage",
            "Premium Acrylic Finish",
            "Soft-Close Sliding System",
            "Integrated Loft Storage",
            "Custom Internal Layout"
        ]
    },

    {
        id: 4,
        slug: "modern-mirror-wardrobe-01",
        title: "Modern Mirror Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "mirror",
        categoryLabel: "Mirror Wardrobe",
        package: "essentials",
        packageLabel: "Essentials",

        image:
    getWardrobeImage(4),
        images: [
            getWardrobeImage(4),
            getWardrobeImage(5),
            getWardrobeImage(6)
        ],

        size: "7 ft × 7 ft",
        finish: "Mirror & Laminate",
        material: "HDF-HMR",

        description:
            "A functional wardrobe with integrated mirror shutters created for modern compact bedrooms.",

        features: [
            "Integrated Mirror",
            "Smart Internal Storage",
            "Hanging Section",
            "Adjustable Shelves",
            "Compact Design"
        ]
    },

    {
        id: 5,
        slug: "modern-mirror-wardrobe-02",
        title: "Modern Full Mirror Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "mirror",
        categoryLabel: "Mirror Wardrobe",
        package: "premium",
        packageLabel: "Premium",

        image:
    getWardrobeImage(5),
        images: [
            getWardrobeImage(5),
            getWardrobeImage(6),
            getWardrobeImage(7)
        ],

        size: "8 ft × 7 ft",
        finish: "Full Mirror Finish",
        material: "Plywood",

        description:
            "A sophisticated full-mirror wardrobe that visually expands the bedroom while providing generous storage.",

        features: [
            "Full-Height Mirror",
            "Premium Hardware",
            "Internal Drawers",
            "Accessory Storage",
            "Soft-Close System"
        ]
    },

    {
        id: 6,
        slug: "modern-mirror-wardrobe-03",
        title: "Modern Smoked Mirror Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "mirror",
        categoryLabel: "Mirror Wardrobe",
        package: "luxe",
        packageLabel: "Luxe",

        image:
    getWardrobeImage(6),

images:[
    getWardrobeImage(6),
    getWardrobeImage(7),
    getWardrobeImage(8)
],

        size: "10 ft × 8 ft",
        finish: "Smoked Mirror",
        material: "Premium Plywood",

        description:
            "A luxury modern wardrobe featuring smoked mirror panels and premium internal organisation.",

        features: [
            "Smoked Mirror Panels",
            "Premium Internal Finish",
            "Designer Hardware",
            "Accessory Organisers",
            "Custom Storage Planning"
        ]
    },

    {
        id: 7,
        slug: "modern-walk-in-wardrobe-01",
        title: "Modern Open Walk-In Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "walk-in",
        categoryLabel: "Walk-In Wardrobe",
        package: "essentials",
        packageLabel: "Essentials",

       image:
    getWardrobeImage(7),

images:[
    getWardrobeImage(7),
    getWardrobeImage(8),
    getWardrobeImage(9)
],
        size: "Custom Size",
        finish: "Matte Laminate",
        material: "HDF-HMR",

        description:
            "An open walk-in storage system designed for easy access and organised everyday dressing.",

        features: [
            "Open Storage",
            "Multiple Hanging Areas",
            "Display Shelves",
            "Drawer Storage",
            "Shoe Storage"
        ]
    },

    {
        id: 8,
        slug: "modern-walk-in-wardrobe-02",
        title: "Modern Dressing Walk-In Wardrobe",
        style: "modern",
        styleLabel: "Modern",
        category: "walk-in",
        categoryLabel: "Walk-In Wardrobe",
        package: "premium",
        packageLabel: "Premium",
image:
    getWardrobeImage(8),

images:[
    getWardrobeImage(8),
    getWardrobeImage(9),
    getWardrobeImage(10)
],

        size: "Custom Size",
        finish: "Premium Laminate",
        material: "Plywood",

        description:
            "A premium walk-in wardrobe with dedicated clothing, accessory and dressing storage.",

        features: [
            "Dedicated Dressing Zone",
            "Drawer Organisers",
            "Shoe Storage",
            "Multiple Hanging Zones",
            "Premium Shelving"
        ]
    },
 
];