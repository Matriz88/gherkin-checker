module.exports = {
    features_path: "./features",
    steps_path: "./scripts/steps/common-steps",
    components: {
        enabled: true,
        options: {
            components_path: "./scripts/libs/components",
            excludedComponents: [
                "home",
                "search",
                "thank you registration",
                "register",
                "wishlist",
                "item",
                "orders",
                "addressbook",
                "creditcardwallet",
                "profile",
                "login",
                "thankyou",
                "checkmail",
                "delivery",
                "payment",
                "thankyou",
                "cart",
                "confirmation"
            ]
        }
    }
}