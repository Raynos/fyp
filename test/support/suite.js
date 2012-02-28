var core = require("../../")

module.exports = function makeSuite(name, callback) {
    core.dependencies.testsuite = {
        express: "io.express",
        server: "io.server"
    };
    describe(name, function () {
        var _app,
            app = function () {
                return _app
            }

        before(function (done) {
            core.use("testsuite", {
                boot: function boot() {
                    this.express.on("creation", function (app) {
                        _app = app
                    })
                    this.server.on("listening", function (port) {
                        done()
                    })
                }
            })
        })

        callback(app)
    })
}