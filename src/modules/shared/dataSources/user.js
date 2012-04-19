var clientmongo = require("clientmongo")

module.exports = {
    mongo: clientmongo("Users", "fyp-db")
}