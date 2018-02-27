const WIDTH = 1600;
const HEIGHT = 580;
const PADDING = 100;
const TOOLTIP_PADDING = 20;

document.addEventListener('DOMContentLoaded', function() {
  request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
  request.send();
  request.onload = function() {
    // Acquire US GDP dataset
    json = JSON.parse(request.responseText);
	createHeatmap(json);
  }
});

function createHeatmap(dataset) {
	// Acquire a function that will linearly scale the numbers in the dataset
  	// to numbers that can be used to represent the data in the graph
	const xScale = d3.scaleLinear()
					 .domain(d3.extent(dataset.monthlyVariance, d => d.year))
					 .range([PADDING, WIDTH-PADDING]);


	const yScale = d3.scaleTime()
					 .domain([new Date(2014, 11, 31), new Date(2014, 0, 1)])
					 .range([HEIGHT-PADDING, PADDING/8]);

	let tooltip = d3.select('body')
					.append('div')
					.attr('class', 'tooltip');

	// Create the svg element
	const svg = d3.select("#heatmap")
				  .append("svg")
				  .attr("width", WIDTH)
				  .attr("height", HEIGHT);

	// Plot the dataset onto the svg canvas
	svg.selectAll("rect")
	   .data(dataset.monthlyVariance)
	   .enter()
	   .append("rect")
	   .attr('x', d => xScale(d.year))
	   .attr('y', d => yScale(new Date(2014, d.month-1, 1)))
	   .attr('width', 5)
	   .attr('height', (HEIGHT-PADDING)/12)
	   .attr('class', 'bar')
	   .attr('fill', d => {
	   		colorLegend = [
	   			'rgb(49, 54, 149)',
	   			'rgb(69, 117, 180)',
	   			'rgb(116, 173, 209)',
	   			'rgb(171, 217, 233)',
	   			'rgb(224, 243, 248)',
	   			'rgb(255, 255, 191)',
	   			'rgb(254, 224, 144)',
	   			'rgb(253, 174, 97)',
	   			'rgb(244, 109, 67)',
	   			'rgb(215, 48, 39)'
	   		]
	   		const temp = dataset.baseTemperature + d.variance;
	   		let colorIndex = 0;
	   		for (let i = 2.8; i < 13; i += 1.1) {
	   			if (temp < i) {
	   				return colorLegend[colorIndex];
	   			}
	   			colorIndex++;
	   		}

	   		return 'rgb(165, 0, 38)';
	   })
	   .on("mouseover", function(d) {
	   		const formatTime = d3.timeFormat('%Y - %B');
	   	  	let date = new Date(d.year, d.month, 1);
	   	  	let temp = d3.format('.1f')(dataset.baseTemperature + d.variance);
	   	  	let variance = d3.format('.1f')(d.variance);
	   	  	const br = '<br>';
	   	  	const cels = '&#8451';
	   	  	let content = formatTime(date)+br+temp+cels+br+variance+cels;

          	tooltip.style("visibility", "visible")
                   .html(content)
       })
       .on("mousemove", () => tooltip.style("left",(event.pageX+20)+"px").style('top', (event.pageY-36)+'px'))
       .on("mouseout", () => tooltip.style("visibility", "hidden"));

	// Create x-axis for graph
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
	svg.append('g')
	   .attr('transform', 'translate(0, ' + (HEIGHT-PADDING) + ')')
	   .call(xAxis);

	// Add text label for x-axis
	svg.append("text")             
       .attr("transform",
            "translate(" + (WIDTH/2) + " ," + 
                           (HEIGHT - PADDING/2) + ")")
       .style("text-anchor", "middle")
       .text("Years");

	// Create y-axis for graph
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));
	svg.append('g')
	   .attr('transform', 'translate(' + PADDING + ', 0)')
	   .call(yAxis);
}




