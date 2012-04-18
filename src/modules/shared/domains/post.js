module.exports = {
    setup: function () {
        this.scraper = this.dataSources.scraper.scraper
    },
    find: function (uri, callback) {
        this.scraper(uri, callback)
    }
}