// function buildMetadata(sample) {
//   // Use `d3.json` to fetch the metadata for a sample
//   d3.json("/metadata/"+sample).then(function(data) {
//     console.log(data);
//     // Use d3 to select the panel with id of `#sample-metadata`
//     let metaPanel = d3.select("#sample-metadata");
//     // Use `.html("") to clear any existing metadata
//     metaPanel.html("")},

//   function(reason){
//     console.log("did not receive data!");
//     console.log(reason);
//   });
// };

function buildCharts(iso) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/aquadata/"+iso).then(function(data){
    console.log(data);
  },
  //callback function to handle error in case we did not receive the json data.
  function(reason){
    console.log("did not receive data!");
    console.log(reason);
  });
}

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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  //buildMetadata(newSample);
}

// Initialize the dashboard
init();