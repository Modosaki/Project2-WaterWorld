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

    // Use `.html("") to clear any existing metadata
    d3.select(".line").remove();
    chartGroup.selectAll(".axis").remove();

    //svg.html("");


    graphingData = [];

    for (var i in data['Total population with access to safe drinking-water (JMP)'].Year){
      graphingData.push(
        {
          date: data['Total population with access to safe drinking-water (JMP)'].Year[i],
          value: data['Total population with access to safe drinking-water (JMP)'].Value[i]
        });
    }
    console.log(graphingData)




    var xTimeScale = d3.scaleLinear()
                       .domain(d3.extent(graphingData, data => data.date))
                       .range([0, chartWidth]);

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
                         .domain([0, d3.max(graphingData, data => data.value)*1.1] )
                         .range([chartHeight, 0]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a line function which will plot the x and y coordinates using our scales
    var drawLine = d3.line()
                     .x( data => xTimeScale(data.date) )
                     .y( data => yLinearScale(data.value) );

    // Append an SVG path and plot its points using the line function
    var path = chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for forceData
              .attr("d", drawLine(graphingData))
              .classed("line", true);

    // Append an SVG group element to the chartGroup, create the left axis inside of it
    chartGroup.append("g")
              .classed("axis", true)
              .call(leftAxis);

    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
      .classed("axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength+" "+totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset",0);



  }).catch(function(error){
    console.log(error);
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
    //buildMetadata(firstSample);
  });
}

function optionChanged(newIso) {
  // Fetch new data each time a new sample is selected
  buildCharts(newIso);
  //buildMetadata(newSample);
}

// Initialize the dashboard
init();