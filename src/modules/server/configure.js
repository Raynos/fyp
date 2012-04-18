var express = require("express"),
    consolidate = require("consolidate"),
    path = require("path"),
    staticPath = path.join(__dirname, "..", "..", "static")

module.exports = {
    start: function (app) {
        app.configure("development", developmentConfigure)
        app.engine("dust", consolidate.dust)
        app.set("view engine", "dust")
        app.set('views', staticPath)
        app.use(express.favicon())
        app.use(express.static(staticPath))
        app.use(express.bodyParser())
        app.use(express.methodOverride())
        app.use(app.router)
    }
}

function developmentConfigure() {
    this.use(express.errorHandler({
        dumpException: true,
        showStack: true
    }))
    this.use(express.logger('dev'))
}