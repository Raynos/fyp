var DelegateListener = require("DelegateListener"),
    store = require("../util/store")

Element.prototype.matchesSelector = 
    Element.prototype.webkitMatchesSelector

module.exports = {
    setup: function (done) {
        var user = store.get("user")
        if (user) {
            done()
        }
        var domain = this.domain,
            root = this.view.root

        root.addEventListener("click", 
            new DelegateListener(".submit", function (event) {
                event.preventDefault()
                var email = root.elements.email.value,
                    password = root.elements.password.value,
                    user = {
                        email: email,
                        password: password
                    }

                store.set("user", user)
                done && done()
                done = null
                return false
            }))
    }
}