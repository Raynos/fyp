var express = require("express")

module.exports = {
    setup: function () {
        this.server.on("creation", this.createExpress)
    },
    createExpress: function (server) {
        var app = express()
        this.emit("creation", app)
        server.on("request", app)
    }
}