var assert = require("assert"),
    suite = require("../support/suite"),
    request = require("../support/http")

suite("HTTP tests", function (app) {
    it("should do something", function (done) {
        request(app())
        .get('/session/new')
        .expect('GET', done)
    })
})