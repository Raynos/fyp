var pd = require("pd"),
    mongo = require("../lib/mongo"),
    base = require("./base")

module.exports = pd.extend({}, base, {
    setup: function () {
        this.collection = mongo("Users")
    }
})