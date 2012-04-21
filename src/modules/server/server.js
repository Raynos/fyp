var http = require("http")

module.exports = {
    setup: function () {
        var server = this.server = http.createServer()
        this.app.start(server)
        this.dnode.start(server)
    },
    init: function () {
        var port = process.env.FYP_PORT || 8080
        this.server.listen(port)
        console.log("server listening on ", port)
        console.log("I AM PROCESS:", process.pid);
    }
}