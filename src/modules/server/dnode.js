var dnode = require("dnode"),
    clientmongo = require("clientmongo"),
    createReader = require("../shared/util/gReader"),
    scraper = require("../shared/util/scraper")

module.exports = {
    start: function (server) {
        var dnodeServer = this.server = dnode()
        dnodeServer.use(clientmongo.middleware)
        dnodeServer.use(function (remote) {
            this.makeReader = function (callback) {
                var reader = createReader()
                callback({
                    login: function () {
                        console.log("calling login on server")
                        reader.login.apply(reader, arguments)
                    },
                    getItems: function () {
                        console.log("calling getItems on server")
                        reader.getItems.apply(reader, arguments)
                    }
                })
            }
        })
        dnodeServer.use(function (remote) {
            this.proxyGetLinks = scraper
        })
        dnodeServer.listen(server)
    }
}