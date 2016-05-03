(function(){
  var margin = {top: 20, right: 20, bottom: 30, left: 60},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var svg = d3.select("#barchart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  d3.csv("data/coral_benefits.csv", type, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.benefit; }));
    y.domain([0, d3.max(data, function(d) { return d.dollar; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(5," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("$ Value in Billions");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.benefit)+10; })
        .attr("width", x.rangeBand()-10)
        .attr("y", function(d) { return y(d.dollar); })
        .attr("height", function(d) { return height - y(d.dollar); });
  });

  function type(d) {
    d.dollar = +d.dollar;
    return d;
  }

})();

(function(){
  var width = 400,
    height = 300,
    radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#ff632c", "#ff9271", "#ffb19f", "#ffead9"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.percent; });

  var svg = d3.select("#piechart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("data/coral_threats.csv", type, function(error, data) {
    if (error) throw error;

    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.threat_level); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.threat_level; });
  });

  function type(d) {
    d.percent = +d.percent;
    return d;
  }
})();
