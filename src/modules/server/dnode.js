var dnode = require("dnode"),
    clientmongo = require("clientmongo"),
    createReader = require("../shared/util/gReader")

module.exports = {
    start: function (server) {
        var dnodeServer = this.server = dnode()
        dnodeServer.use(clientmongo.middleware)
        dnodeServer.use(function niggers(remote) {
            this.makeReader = function (callback) {
                var reader = createReader()
                callback({
                    login: function () {
                        console.log("calling login on server")
                        reader.login.apply(reader, arguments)
                    },
                    getItems: function () {
                        reader.getItems.apply(reader, arguments)
                    }
                })
            }
        })
        dnodeServer.listen(server)
    }
}