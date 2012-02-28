var path = require("path"),
    express = require("express")

module.exports = {
    boot: function boot() {
        this.express.on("creation", this.attachConfiguration)
    },
    attachConfiguration: function attachConfiguration(app) {
        app.configure(configure)
        app.configure("development", developmentConfigure)
    }
}

function configure() {
    this.set('views', path.join(__dirname, "../../public/views"))
    this.set('view engine', 'jade')
    this.use(express.favicon())
    this.use(express.static(path.join(__dirname, "../../public")))
    this.use(express.bodyParser())
    this.use(express.methodOverride())
    this.use(this.router)
}

function developmentConfigure() {
    this.use(express.errorHandler())
    this.use(express.logger('dev'))
}