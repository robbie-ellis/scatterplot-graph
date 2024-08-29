document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Response for json data was not ok");
      }
      return response.json();
    })
    .then(response => {
      const dataSet = response;
      
      let years = [];
      dataSet.forEach((el, index) => {
        years[index] = el.Year;
      });
      console.log(years);

      let times = [];
      dataSet.forEach((el, index) => {
        times[index] = new Date(0, 0, 1, 0, parseInt(el.Time.substring(0, 2)), parseInt(el.Time.substring(3)));
      });

      let dopings = [];
      dataSet.forEach((el, index) => {
        if (el.Doping === "") {
          dopings[index] = false;
        } else {
          dopings[index] = true;
        }
      });

      const h = 600;
      const w = 900;
      const padding = 40;
      const dopingColor = 'red';
      const noDopingColor = 'yellow';
      
      const xScale = d3.scaleLinear()
        .domain([d3.min(years, (d) => d - 1), //-1 to keep it from overlapping the axes 
          d3.max(years, (d) => d + 1)]) //+1  to keep it from overlapping the axes
        .range([padding, w - padding]);

      const yScale = d3.scaleTime()
        .domain([d3.min(times, (d) => d), 
          d3.max(times, (d) => d)])
        .range([padding, h - padding]);
      
      const svg = d3.select('#chart')
        .append('svg')
        .attr('height', h)
        .attr('width', w)
        .style('background', 'linear-gradient(silver, grey)')
        .style('border-radius', '10px')
        .style('box-shadow', '10px 10px 5px 0px rgba(0, 0, 0, 0.5)');

      const circles = svg.selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('id', (d, i) => i)
        .attr('class', 'dot');
        
      circles
        .data(years)
        .attr('data-xvalue', (d) => d)
        .attr('cx', (d) => xScale(d));

      circles
        .data(times)
        .attr('data-yvalue', (d) => d)
        .attr('cy', (d) => yScale(d))
        .attr('r', '5');
      
      
      circles
        .data(dopings)
        .attr('alleged-doping', (d) => d) // Not necessary but I wanted to associate this data with the circle elements
        .attr('fill', (d) => {
          if (d) {
            return dopingColor;
          } else {
            return noDopingColor;
          }
        });
      
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

      svg.append('g')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
        .attr('id', 'x-axis')
        .call(xAxis)
        .attr('color', 'black');

      svg.append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .attr('id', 'y-axis')
        .call(yAxis)
        .attr('color', 'black');

      svg.append('rect')
        .attr('width', 220)
        .attr('height', 50)
        .attr('x', w - 235)
        .attr('y', h - 420)
        .attr('fill', 'aqua')
        .attr('rx', '10px')
        .style('box-shadow', '10px 10px 5px 0px rgba(0, 0, 0, 0.5)');

      svg.append('text')
        .attr('id', 'legend')
        .text("Doping alleged or confirmed")
        .attr('x', w - 230)
        .attr('y', h - 400);
      
      svg.append('circle')
        .attr('cx', w - 30)
        .attr('cy', h - 405)
        .attr('r', 5)
        .attr('fill', dopingColor);
      
      svg.append('text')
        .text("No doping alleged")
        .attr('x', w - 163)
        .attr('y', h - 380);
      
      svg.append('circle')
        .attr('cx', w - 30)
        .attr('cy', h - 385)
        .attr('r', 5)
        .attr('fill', noDopingColor);
    })
    .catch(error => {
      console.error("There was a problem fetching json data", error);
    });
});
