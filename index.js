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
      console.log(dates);
    })
    .catch(error => {
      console.error("There was a problem fetching json data", error);
    });
});
