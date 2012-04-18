module.exports = {
    middleware: function (req, res, next) {
        this.domain.get({
            email: req.headers.email,
            password: req.headers.password
        }, storeAndNext)

        function storeAndNext(err, user) {
            console.log("middleware", err, user)
            req.user = user
            next()
        }
    }
}