console.log("routes loaded")


module.exports = {
    init: function () {
        console.log("init routes")
        this.domain.find("http://raynos.org/blog/", function (err, uris) {
            console.log("uris found", uris)
        })
    }
}