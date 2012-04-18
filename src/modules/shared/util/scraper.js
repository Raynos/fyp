if (typeof process !== "undefined" && process.title === "node") {
    module.exports = (require)("./scraper.server.js")
} else if (typeof window !== "undefined" && window.window) {
    module.exports = require("./scraper.client.js")
}