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
      
      let dates =[];
      dataSet.forEach((el, index) => {
        dates[index] = new Date(el.Year, 0, 1, 0, parseInt(el.Time.substring(0, 2)), parseInt(el.Time.substring(3)));
      });

      let years = [];
      dates.forEach((el, index) => {
        years[index] = el.getFullYear();
      });

      let minutes = [];
      dates.forEach((el, index) => {
        minutes[index] = el.getMinutes();
      });
      console.log(minutes);
      
      const h = 600;
      const w = 900;
      const padding = 40;

      console.log(d3.min(years));
      console.log(d3.max(years));
      
      const xScale = d3.scaleLinear()
        .domain([d3.min(dates, (d) => d.getFullYear()), 
          d3.max(dates, (d) => d.getFullYear())])
        .range([padding, w - padding]);

      const yScale = d3.scaleLinear()
        .domain([d3.min(dates, (d) => d.getMinutes()), 
          d3.max(dates, (d) => d.getMinutes())])
        .range([h - padding, padding]);
      
      const svg = d3.select('body')
        .append('svg')
        .attr('height', h)
        .attr('width', w)
        .style('background', 'linear-gradient(silver, grey)')
        .style('border-radius', '10px')
        .style('box-shadow', '10px 10px 5px 0px rgba(0, 0, 0, 0.5)');

      svg.selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('id', (d, i) => i)
        .attr('class', 'dot')
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time)
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => h - yScale(d.Time))
        .attr('r', '5');

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

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
    })
    .catch(error => {
      console.error("There was a problem fetching json data", error);
    });
});
