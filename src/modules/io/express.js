var express = require("express")

module.exports = {
    boot: function boot() {
        this.server.on("creation", this.createExpress)
    },
    createExpress: function createExpress(server) {
        var app = express()
        this.emit("creation", app)
        server.on("request", app)
    }
}