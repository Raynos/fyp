var clientmongo = require("clientmongo")

module.exports = {
    mongo: clientmongo("Posts", "fyp-db")
}