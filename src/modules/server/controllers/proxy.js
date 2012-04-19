var request = require("request")

module.exports = {
    start: function (app) {
        app.all("/proxy/:url", this.handleProxy)
    },
    handleProxy: function (req, res) {
        request(req.params.url).pipe(res)
    }
}