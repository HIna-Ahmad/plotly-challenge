//Using D3 to connect to json file "samples.json" and use .then to pass parameter and create function
var loadData = d3.json("samples.json").then((data) => {
  // console.log(data.names);

  //Name your var for desired data
  var sampleNames = data.names;

  //Connect var containing data to html element <select> by its ID
  var selector = d3.select("#selDataset");

  //Take var and use .forEach to pass peram and create function to
  //take html connecting var, and use .append to input user's selected option's fields in
  //.text and putting the .property of object which is "value"
  sampleNames.forEach((sample) => {
    selector.append("option").text(sample).property("value", sample);
  });
});

//function conntected to drop down; name of function gathered by html element <select> attribute 'onchange'
function optionChanged(inputDropdown) {
  // console.log(inputDropdown);

  //Using D3 to connect to jason file "samples.json" and use .then to pass parameter and create function
  d3.json("samples.json").then((data) => {
    data.metadata.forEach((input) => {});
    // console.log(data.metadata);
    // console.log(input.age);

    var filteredData = data.metadata.filter(
      (row) => row["id"] == inputDropdown
    );
    // console.log(filteredData);

    //Capture the HTML of a selection
    var sampleMetaData = d3.select("#sample-metadata");
    //To clear previous ID Dropdown Selection
    sampleMetaData.html("");
    //To input Values in div panel
    filteredData.forEach((inputhtml) => {
      sampleMetaData.append("div").text("ID: " + inputhtml.id);
      sampleMetaData.append("div").text("Ethnicity: " + inputhtml.ethnicity);
      sampleMetaData.append("div").text("Gender: " + inputhtml.gender);
      sampleMetaData.append("div").text("Age: " + inputhtml.age);
      sampleMetaData.append("div").text("Location: " + inputhtml.location);
      sampleMetaData.append("div").text("bbtype: " + inputhtml.bbtype);
      sampleMetaData.append("div").text("wfreq: " + inputhtml.wfreq);

      bubbleAndBarChart(inputDropdown);
    });
  });
}

function bubbleAndBarChart(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    // console.log(samples);

    //Use filter function to iterate through 'samples' array of objects and return only those that match the param by ID
    var filtArray = samples.filter((eachObject) => eachObject.id == sample);

    var filtById = filtArray[0];
    // console.log(filtById);

    //Create var for otu_ids data
    var otu_ids = filtById.otu_ids;
    // console.log(otu_ids);

    //Create var for otu_labels data
    var otu_labels = filtById.otu_labels;
    // console.log(otu_labels);

    //Create var for sample_values data
    var sample_values = filtById.sample_values;
    // console.log(sample_value

    //Build horizontal bar chart
    //First, slice the 10 objects for plotting,
    //reverse the array due to plotly's default and put into a var for y
    var ytickMark = otu_ids
      .slice(0, 10)
      .map((otuID) => `OTU ${otuID}`)
      .reverse();

    var trace1 = {
      y: ytickMark,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };

    var barChartData = [trace1];

    var barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 40, l: 140 },
      xaxis: { title: "Sample Values" },
      margin: { t: 30 },
      yaxis: { title: "OTU ID" },
      margin: { r: 20 },
    };
    Plotly.newPlot("bar", barChartData, barChartLayout);

    // Build a Bubble Chart
    var trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "electric",
      },
    };

    var bubbleChartData = [trace];

    var bubbleChartLayout = {
      title: "Bacteria Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 },
    };
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
  });
}
