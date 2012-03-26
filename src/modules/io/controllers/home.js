module.exports = {
    setup: function () {
        this.express.on("creation", this.attachRoute)
    },
    attachRoute: function (app) {
        app.get("/", this.home)
    },
    home: function (req, res) {
        res.render("main")
    }
}