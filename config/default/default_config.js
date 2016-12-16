module.exports = {
    features_path: "./features",
    steps_path: "./steps/common-steps",
    mode: 'full', //'full' or 'light'
    components: {
        enabled: false,
        components_path: "./components/components",
        excludedComponents: []
    },
    reporter: {
        type: 'full' //'full' or 'light'
    }
}