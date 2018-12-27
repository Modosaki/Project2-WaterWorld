// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#svg")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");


//##################################################################################################
//function to build line charts
//##################################################################################################
function buildCharts(iso) {
  //fetch countries data from iso code
  d3.json("/aquadata/"+iso).then(function(data){
    //console.log(data);
    var country = data.country
    // clear previous graph
    chartGroup.selectAll(".line").remove();
    chartGroup.selectAll(".axis").remove();
    chartGroup.selectAll(".text").remove();
    svg.selectAll(".legend").remove();

    //format data for plotting
    var total_pop = data['Total population with access to safe drinking-water (JMP)']
    var rural_pop = data["Rural population with access to safe drinking-water (JMP)"] 
    var urban_pop = data["Urban population with access to safe drinking-water (JMP)"]
    
    var resultData = []
    var dataCollection = [total_pop,rural_pop,urban_pop]
    dataCollection.forEach(function(d){
      var temp=[]  
      for (let i in d.Year){
          temp.push(
            {
              date:parseTime(d.Year[i]),
              value:d.Value[i]
            }
          )
        }
      resultData.push(temp)
    })

    var timeDomain = d3.extent(resultData[2],data => data.date)
    
    var xTimeScale = d3.scaleTime()
                       .domain(timeDomain)
                       .range([0, chartWidth]);

    // // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
                         .domain([0, 105] )
                         .range([chartHeight, 0]);

    // // Create two new functions passing the scales in as arguments
    // // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var drawLine = d3.line()
                 .x( d => xTimeScale(d.date) )
                 .y( d => yLinearScale(d.value) );

    var chart = chartGroup.selectAll(".line")
                          .data(resultData)
                          .enter()

    //set the colors and texts for each data
    var colors=["gold","blue","red"]
    var legendTexts=["total","rural","urban"]

    //Draw the lines with different color
    var path = chart.append("path")
                    .attr("class", "line")
                    .style("stroke", (d,i)=> colors[i] )
                    .attr("d", drawLine);

    //adding path transition effect to each line, from "https://stackoverflow.com/questions/21140547/accessing-svg-path-length-in-d3"    
    path.each(function(d){d.totalLength = this.getTotalLength(); })
        .attr("stroke-dasharray", function(d){ return d.totalLength+" "+d.totalLength ;})
        .attr("stroke-dashoffset", function(d) { return d.totalLength; })
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset",0);
    
    //Append y-axis title
    chartGroup.append("text")
              .classed("text", true)
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left)
              .attr("x",0 - (chartHeight / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .style("font-weight", "bold")
              .text("Percentage");      
    
    // // Append an SVG group element to the chartGroup, create the left axis inside of it
    chartGroup.append("g")
              .classed("axis", true)
              .call(leftAxis);

    //append x-axis title
    chartGroup.append("text")
              .attr("transform", `translate(${chartWidth / 2}, ${chartHeight +margin.top/1.5})`)
              .classed("text", true)
              .style("font-weight", "bold")
              .text( country);      

    // // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
              .classed("axis", true)
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(bottomAxis);
    //###########################################################  
    //append legened
    //############################################################
    var legend = svg.append("g")
                    .classed("legend", true)
                    .attr("x", 65)
                    .attr("y", 25)
                    .attr("height", 100)
                    .attr("width", 100);
    
    legend.selectAll('g').data(resultData)
                         .enter()
                         .append('g')
                         .each(function(d, i) {
                          var g = d3.select(this);
                              g.append("rect")
                                .attr("x", chartWidth- 65)
                                .attr("y", i*25)
                                .attr("width", 10)
                                .attr("height", 10)
                                .style("fill", colors[i]);

                              g.append("text")
                               .attr("x", chartWidth - 50)
                               .attr("y", i * 25+8 )
                               .attr("height",30)
                               .attr("width",-90)
                               .style("fill", "black")
                               .text(legendTexts[i]);});




  }).catch(function(error){
    console.log(error)
    console.log("Missing accessibility data!")
  });
}
//##################################################################################################
// function used to initialize the page........
//##################################################################################################
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];  
    buildCharts(firstSample);
  });
}

function optionChanged(newIso) {
  // Fetch new data each time a new sample is selected
  buildCharts(newIso);
  //buildMetadata(newSample);
}

// Initialize the dashboard
init();