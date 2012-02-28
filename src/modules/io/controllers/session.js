module.exports = {
    boot: function boot() {
        this.express.on("creation", this.attachRoute)
    },
    attachRoute: function attachRoute(app) {
        app.get("/session/new", this.create)
    },
    create: function create(req, res) {
        res.end(req.method)
    }
}