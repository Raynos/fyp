var width = (window.outerWidth - 50) / 2,
    height = (window.outerHeight - 50) / 2,
    paper = Raphael(50, 50, width, height),
    zoomHTML = "<button>Switch View</button>"

module.exports = {
    renderCentralNode: function (data) {
        var title = data.item.title,
            length = title.length,
            left = (width - 5*length - 20) / 2,
            top = (height - 30) / 2

        paper.rect(left, top, length*5 + 30, 30)
        var t = paper.text(width / 2, height / 2, data.item.title)
        t.attr('href', data.uri)

        data.related && data.related.forEach(function (related, offset) {
            this.renderRelatedNode(related, offset, data.related.length)
        }, this)
    },
    paper: paper,
    renderRelatedNode: function (data, index, total) {
        var title = data.item.title,
            left = (width * 0.75) ,
            top = ((height - 30) / 2) + 
                (index - total + Math.ceil(total / 2))*60

        var strs = []

        for (var i = 0; i < title.length; i+=20) {
            //console.log("segment", segment)
            var segment = title.slice(i, i+20)
            strs.push(segment)
        }

        var segmentheight = strs.length

        title = strs.join("\n")

        //console.log(title)

        
        var rect = paper.rect(left, top - 5*segmentheight + 5, 
            20*5 + 30, 10*segmentheight + 10)
        rect.attr("fill", "#fff")
        var t = paper.text(left + 20*2.5 + 15, top + 10, title)
        rect.click((function () {
            paper.clear()
            this.renderCentralNode(data)
        }).bind(this))
    },
    renderZoom: function () {
        var frag = this.util.Fragment(zoomHTML)
        var button = frag.firstChild
        document.body.appendChild(button)
        button.style.float = 'right'
        return button
    }
}