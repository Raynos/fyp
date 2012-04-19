if (typeof process !== "undefined" && process.title === "node") {
    module.exports = (require)("./gReader.server.js")
} else if (typeof window !== "undefined" && window.window) {
    module.exports = require("./gReader.client.js")
}