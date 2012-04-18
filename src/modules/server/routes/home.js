module.exports = {
    start: function (app) {
        app.get("/", this.home)
    },
    home: function (req, res) {
        res.render("server/index")
    }
}