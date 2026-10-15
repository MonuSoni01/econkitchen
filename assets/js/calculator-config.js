const calculatorConfig = {


    // Standard Kitchen Height
    height: 5,


    // Layout Configuration
    layouts: {


        "l-shaped": {

            name: "L-Shaped Kitchen",

            walls: [
                "a",
                "b"
            ]

        },


        "straight": {

            name: "Straight Kitchen",

            walls: [
                "a"
            ]

        },


        "u-shaped": {

            name: "U-Shaped Kitchen",

            walls: [
                "a",
                "b",
                "c"
            ]

        },


        "parallel": {

            name: "Parallel Kitchen",

            walls: [
                "a",
                "b"
            ]

        }


    },




    // Package Configuration
    packages: {


        essential: {

            name: "Essential",

            description:
            "Smart & Practical",

            rate: 2000

        },



        premium: {

            name: "Premium",

            description:
            "Modern & Stylish",

            rate: 3000

        },



        signature: {

            name: "Signature",

            description:
            "Luxury & Exclusive",

            rate: 5000

        }


    }



};
export default calculatorConfig;