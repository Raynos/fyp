var path = require("path"),
    express = require("express")

module.exports = {
    setup: function () {
        this.express.on("creation", this.attachConfiguration)
    },
    attachConfiguration: function (app) {
        this.app = app
        app.configure(this.configure)
        app.configure("development", developmentConfigure)
    },
    configure: function () {
        var app = this.app
        app.set('views', path.join(__dirname, "../../public/views"))
        app.set('view engine', 'jade')
        app.use(express.favicon())
        app.use(express.static(path.join(__dirname, "../../public")))
        app.use(express.bodyParser())
        app.use(express.methodOverride())
        Object.keys(this.middlewares).forEach(attachMiddleware, this)
        app.use(app.router)

        function attachMiddleware(name) {
            this.app.use(this.middlewares[name].middleware)
        }
    }
}



function developmentConfigure() {
    this.use(express.errorHandler({
        dumpException: true,
        showStack: true
    }))
    this.use(express.logger('dev'))
}