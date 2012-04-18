var dnode = require("dnode"),
    clientmongo = require("clientmongo")

module.exports = {
    start: function (server) {
        var dnodeServer = this.server = dnode()
        dnodeServer.use(clientmongo.middleware)
        dnodeServer.listen(server)
    }
}