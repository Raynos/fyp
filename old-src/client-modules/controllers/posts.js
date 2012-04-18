var pd = require("pd")

module.exports = {
    setup: function () {
        var elem = this.view.renderZoom()
        elem.addEventListener("click", this.changeView)
        this.jitElem = document.createElement("div")
        this.jitElem.id = "center-container"
        var infovis = document.createElement("div")
        infovis.id = 'infovis'
        this.jitElem.appendChild(infovis)
    },
    init: function () {
        document.body.appendChild(document.createTextNode("loading posts"))
        this.util.xhr({
            uri: "/post",
            method: "GET"
        }, this.renderPosts)
    },
    renderPosts: function (err, data) {
        document.body.removeChild(document.body.lastChild)
        var json = this.json = JSON.parse(data)
        var fudge = 0
        for (var i = 0; i < json.length; i++) {
            var item = json[i]
            if (item.related && item.related.length > 1) {
                if (fudge++ === 4) {
                    break;
                }
            }
        }
        var node = this.view.renderCentralNode(item)
    },
    changeView: function () {
        this.jit = !this.jit
        if (this.jit) {
            document.body.removeChild(this.view.paper.canvas)
            document.body.appendChild(this.jitElem)
            if (!this.jitRendered) {
                this.renderJit()
            }
        } else {
            document.body.removeChild(this.jitElem)
            document.body.appendChild(this.view.paper.canvas)
        }
    },
    renderJit: function () {
        var data = this.json.slice()

        var jitData = {}

        var fudge = 0
        for (var i = 0; i < data.length; i++) {
            var item = data[i]
            if (item.related && item.related.length > 1) {
                if (fudge++ === 4) {
                    break;
                }
            }
        }

        /* { id: ID, name: String, data: x, children: Array<This> } */

        jitData.id = item._id
        jitData.name = item.item.title
        jitData.data = item
        jitData.children = item.related.map(function self(item) {
            console.log("hasRelated", item.related)
            return {
                data: item,
                id: item._id,
                name: item.item.title,
                children: item.related ? item.related.map(self) : []
            }
        })

        drawJit(jitData)

        this.jitRendered = true
    }
}

function drawJit(json) {
    var rgraph = new $jit.RGraph({  
        //Where to append the visualization  
        injectInto: 'infovis',  
        //Optional: create a background canvas that plots  
        //concentric circles.  
        background: {  
          CanvasStyles: {  
            strokeStyle: '#555'  
          }  
        },  
        //Add navigation capabilities:  
        //zooming by scrolling and panning.  
        Navigation: {  
          enable: true,  
          panning: true,  
          zooming: 20  
        },  
        //Set Node and Edge styles.  
        Node: {  
            color: '#ddeeff'  
        },  
          
        Edge: {  
          color: '#C17878',  
          lineWidth:1.5  
        },  
      
        onBeforeCompute: function(node){  
            console.log("centering " + node.name + "...");  
            //Add the relation list in the right column.  
            //This list is taken from the data property of each JSON node.
            console.log("data", node.data)
            //$jit.id('inner-details').innerHTML = node.data.relation;  
        },  
          
        //Add the name of the node in the correponding label  
        //and a click handler to move the graph.  
        //This method is called once, on label creation.  
        onCreateLabel: function(domElement, node){  
            domElement.innerHTML = node.name;  
            domElement.onclick = function(){  
                rgraph.onClick(node.id, {  
                    onComplete: function() {  
                        console.log("done");  
                    }  
                });  
            };  
        },  
        //Change some label dom properties.  
        //This method is called each time a label is plotted.  
        onPlaceLabel: function(domElement, node){  
            var style = domElement.style;  
            style.display = '';  
            style.cursor = 'pointer';  
      
            if (node._depth <= 1) {  
                style.fontSize = "0.8em";  
                style.color = "#ccc";  
              
            } else if(node._depth == 2){  
                style.fontSize = "0.7em";  
                style.color = "#494949";  
              
            } else {  
                style.display = 'none';  
            }  
      
            var left = parseInt(style.left);  
            var w = domElement.offsetWidth;  
            style.left = (left - w / 2) + 'px';  
        }  
    });  
    //load JSON data  
    rgraph.loadJSON(json);  
    //trigger small animation  
    rgraph.graph.eachNode(function(n) {  
      var pos = n.getPos();  
      pos.setc(-200, -200);  
    });  
    rgraph.compute('end');  
    rgraph.fx.animate({  
      modes:['polar'],  
      duration: 2000  
    });      
}

