//http://www.kancloud.cn/wizardforcel/d3-api-ref/101211
//https://github.com/tianxuzhang/d3.v4-API-Translation
//https://github.com/tianxuzhang/d3.v4-API-Translation
//https://mohansun-canvas.herokuapp.com/content/training/
//http://www.kancloud.cn/wizardforcel/d3-api-ref/101210
//https://d3js.org/
//http://127.0.0.1:64492/test/test.html
var margin = {top: 20, right: 120, bottom: 20, left:100},
    width = 950 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;
console.log()
var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = width/2;
root.y0 = 0 ;

update(root);

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "#ccff99" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? 20 : 0; })
      .attr("dy", function(d) { return d.children || d._children ? ".3em" : '2.35em'; })
      .attr("text-anchor", function(d) { return d.children || d._children ? "start" : "middle"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
     .attr("class", function(d) {
              if (d.url != null) { return 'hyper'; }
         })
          .on("click", function (d) {
              $('.hyper').attr('style', 'font-weight:normal');
              d3.select(this).attr('style', 'font-weight:bold');
              if (d.url != null) {
                 //  window.location=d.url;
                 $('#vid').remove();

                 $('#vid-container').append( $('<embed>')
                    .attr('id', 'vid')
                    .attr('src', d.url + "?version=3&amp;hl=en_US&amp;rel=0&amp;autohide=1&amp;autoplay=1")
                    .attr('wmode',"transparent")
                    .attr('type',"application/x-shockwave-flash")
                    .attr('width',"100%")
                    .attr('height',"100%")
                    .attr('allowfullscreen',"true")
                    .attr('title',d.name)
                  )
                }
          })
    ;

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "#ccff99" : "#ff0"; })
      .style('stroke',function(d){return d._children?"#ccffcc":"#f40"})

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; })
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
      .style('stroke',function(d,key){
            console.log(d.target)
            if(d.target.type==1){
                return 'red';
            }else if(d.target.type==2){
                return 'pink'
            }else{
                return 'green'
            }
      })
      .style('stroke-dasharray',function(d,key){
            if(d.target.type==1){
                return '0';
            }else if(d.target.type==2){
                return '20,5,5,5'
            }else{
                return '20,5,5,5,5,10'
            }
            return '2,2,2'
      })


  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
