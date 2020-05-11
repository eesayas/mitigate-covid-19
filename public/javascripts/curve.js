//init dropdown
$('.ui.dropdown').dropdown(); 


//config settings for curveChart
var config = {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                type: "time",
                time:       {
                    format: 'MMM DD YYYY', //this is the format of the data
                    tooltipFormat: 'll'    //this is how you want to present it on the chart
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Dates of Infection' //this is the title of the x-axis
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Cases' // this is the title of the y-axis
                }
            }]
        },
        aspectRatio: 3,
        elements: {
            line: {
                tension: 0
            },
            point: {
                radius: 0
            }
        }
    }
};

window.onload = () => {
    var ctx = document.getElementById("curveChart").getContext("2d");
    window.myLine = new Chart(ctx, config);
};

// get initial data
$.ajax('/get-countries-total-data')
    .then(
        function success(response){
            let dataSetData = getInitialCurveData(response);
            console.log(dataSetData);
            window.myLine.config.data.datasets = dataSetData;
            window.myLine.update(); //update chart with inital data
        },
        function fail(data, status){
            console.log(status);
        }
    );

// this will be put the value of dataset for chartjs
const getInitialCurveData = (dataResponse) => {

    //aux functions...
    let getData = (data) =>{
        let dataList = [];
        data.forEach((day) => {
            let dayData = {
                x: day.date,
                y: day.cases
            }
            dataList.push(dayData);
        });
        return dataList;
    }

    let getRandomColor = () =>{
        let randomColor =  Math.floor(Math.random()*16777215).toString(16);
        return '#' + randomColor;
    }

    var dataSetList = [];
    dataResponse.forEach((element) => {
        let color = getRandomColor();

        let data = {
            label: element.name,
            data: getData(element.data),
            fill: false,
            borderColor: color,
            backgroundColor: color
        }
        dataSetList.push(data);
    });

    return dataSetList;
}

$('#search-cont button').on('click', function() {
    let countryVal = $('#country-val').val();
    
    if(!countryVal){
        alert('You have not selected a country.');
    } else{

        $.ajax(`/get-country-curve-data?country=${countryVal}`)
            .then(
                function success(response){
                    console.log(response);
                    //aux => maybe move to callback?
                    let getData = (data) =>{
                        let dataList = [];
                        data.forEach((day) => {
                            let dayData = {
                                x: day.date,
                                y: day.cases
                            }
                            dataList.push(dayData);
                        });
                        return dataList;
                    }

                    let getRandomColor = () =>{
                        let randomColor =  Math.floor(Math.random()*16777215).toString(16);
                        return '#' + randomColor;
                    }

                    let color = getRandomColor();

                    let data = {
                        label: response.name,
                        data: getData(response.data),
                        fill: false,
                        borderColor: color,
                        backgroundColor: color
                    }

                    window.myLine.config.data.datasets.push(data);
                    window.myLine.update(); //update chart
                },
                function fail(data, status){
                    console.log(status);
                }
            );

    }
});