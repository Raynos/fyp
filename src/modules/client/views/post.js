var pd = require("pd")

var ProgressRenderer = {
    constructor: function () {
        this.observable.on("change", this.handleProgressChange)
    },
    handleProgressChange: function (key, value) {
        if (key === "greader-progress") {
            this.greaderNode.value = value
        } else if (key === "greader-max") {
            this.greaderNode.max = value
        } else if (key === "linking-progress") {
            this.linkingNode.value = value
        } else if (key === "linking-max") {
            this.linkingNode.max = value
        }
    }
}

module.exports = {
    setup: function () {
        this.domain.on("change", this.handleDomainChange)
    },
    greaderNode: document.getElementById("greader"),
    linkingNode: document.getElementById("linking"),
    handleDomainChange: function (key, value) {
        pd.bindAll({}, ProgressRenderer, this, {
            observable: value
        }).constructor()
    }
}