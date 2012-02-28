var http = require("http"),
    PORT = process.env.PORT || 8080

module.exports = {
    init: function init() {
        var server = this.server = http.createServer()
        this.emit("creation", server)
        server.listen(PORT)
        this.emit("listening", PORT)
        //console.log("server listening on", PORT)
    },
    destroy: function destroy() {
        this.server.close()
        this.emit("closing", server)
    }
}