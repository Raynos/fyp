var pd = require("pd")

module.exports = {
    setup: function (done) {
        var elem = this.elem = this.view.renderInitial(document.body)
        this.done = done
        elem.lastElementChild.addEventListener("click", this.login)
        this.domain.getUser(this.loadUser)
    },
    login: function () {
        var user = {
            email: this.elem.children[0].value,
            password: this.elem.children[1].value   
        }
        this.ready(user)
    },
    loadUser: function (err, user) {
        if (user) {
            this.ready(user)
        }
    },
    ready: function (user) {
        pd.extend(this.util.headers, user)
        this.domain.saveUser(user, this.callDone)
    },
    callDone: function () {
        this.done()
        this.done = function() {}
    }
}