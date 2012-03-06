var assert = require("assert"),
    suite = require("../support/suite"),
    Request = require("../support/http"),
    email = process.env.G_EMAIL,
    password = process.env.G_PASSWORD

suite("HTTP tests", function (app) {
    it("should do something", function (done) {
        request(app())
        .get('/post')
        .end(function (res) {
            //console.log(res.body)
            done()
        })
    })

    function request() {
        return Request(app())
            .set('email', email)
            .set('password', password)
    }
})
