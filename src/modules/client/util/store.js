var localStorage = window.localStorage

module.exports = {
    get: function (key) {
        return JSON.parse(window.localStorage.getItem(key))
    },
    set: function (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    }
}