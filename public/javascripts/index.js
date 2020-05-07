// init, every filter is selected on first load
$('.curve-filter').eq('0').addClass('select-cases');
$('.curve-filter').eq('1').addClass('select-deaths');
$('.curve-filter').eq('2').addClass('select-recovered');

// for each filter hide/unhide their respective dataset on click
$('.curve-filter').each( function(index){
    $(this).on("click", function(){
        switch(index){
            case 0:
                $(this).toggleClass('select-cases');
                if($(this).hasClass('select-cases')){
                    (myChart.data.datasets)[0].hidden = false;
                    myChart.update();
                
                } else{
                    (myChart.data.datasets)[0].hidden = true;
                    myChart.update();
                }
                break;
            case 1:
                $(this).toggleClass('select-deaths');
                if($(this).hasClass('select-deaths')){
                    (myChart.data.datasets)[1].hidden = false;
                    myChart.update();
                } else{
                    (myChart.data.datasets)[1].hidden = true;
                    myChart.update();
                }
                break;
            case 2:
                $(this).toggleClass('select-recovered');
                if($(this).hasClass('select-recovered')){
                    (myChart.data.datasets)[2].hidden = false;
                    myChart.update();
                } else{
                    (myChart.data.datasets)[2].hidden = true;
                    myChart.update();
                }
                break;
        }
    });
});

// init dropdown func of semantic js
$('.ui.dropdown').dropdown();

//processdata
const processData = (dataList) => {
    let newList = [];

    dataList.forEach((data, index) => {
        if(index == 0){
            let newData = {
                date: moment(data.Date).format('MMM DD YYYY'),
                newCases: data.Confirmed,
                newDeaths: data.Deaths,
                newRecovered: data.Recovered
            };
            newList.push(newData);
        } else{
            let newData = {
                date: moment(data.Date).format('MMM DD YYYY'),
                newCases: data.Confirmed - dataList[index-1].Confirmed,
                newDeaths: Math.abs(data.Deaths - dataList[index-1].Deaths),
                newRecovered: Math.abs(data.Recovered - dataList[index-1].Recovered)
            }
            newList.push(newData);
        }
    });

    return newList;
};


Chart.defaults.global.legend.display = false;

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                data: [8, 7, 13, 12, 1, 6],
                backgroundColor: 'rgba(114, 114, 114, 0.3)',
                borderColor: 'rgba(114, 114, 114, 1)',
                borderWidth: 1
            },
            {
                data: [10, 3, 6, 17, 12, 4],
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },

        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    // stepSize: 50
                },
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],
            xAxes: [{
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    display: false //this will remove only the label
                }
            }],

        },
        aspectRatio: 3,
        animation: {
            duration: 0,
        },
        elements: {
            line: {
                tension: 0
            },
            point: {
                radius: 0.1
            }
        }
    }
});


const getDates = (data) => {
    let dates = [];
    data.forEach((element) => dates.push(element.date));
    return dates;
}
const getCases = (data) => {
    let cases = [];
    data.forEach((element) => cases.push(element.newCases));
    return cases;
}

const getDeaths = (data) => {
    let deaths = [];
    data.forEach((element) => deaths.push(element.newDeaths));
    return deaths;
}

const getRecovered = (data) => {
    let recovered = [];
    data.forEach((element) => recovered.push(element.newRecovered));
    return recovered;
}

const getAverageCases = (cases) => {
    let avg = 0;
    cases.forEach((element) =>  (avg += element));
    return avg/cases.length;
}

const getStdDev = (cases) => {
    let size = cases.length;
    let sum = 0;
    let mean = getAverageCases(cases);

    cases.forEach((element) => {
        sum += Math.pow(element - mean, 2);
    });

    return Math.sqrt(sum / size);
}

const reformatDates = (dates) =>{
    let newDateList = [];
    dates.forEach((element) => {
        let newDate = moment(element).format("MMM DD");
        newDateList.push(newDate);
    });

    return newDateList;

}


//this will update the chart with new timeline
const newTimeline = (endpoints, dates, cases, deaths, recovered) => {
    let start = endpoints[0];
    let end = endpoints[1];

    

    myChart.data.datasets[0].data = cases.slice(start,end);
    myChart.data.datasets[1].data = deaths.slice(start,end);
    myChart.data.datasets[2].data = recovered.slice(start,end);
    myChart.data.labels = dates.slice(start,end);
    myChart.update();
}

//init
$('#slider-cont').css("margin-left", `${myChart.chartArea.left}px`);

$(window).resize(function(){
    $('#slider-cont').css("margin-left", `${myChart.chartArea.left}px`);
});

//get data
$.ajax('https://api.covid19api.com/total/dayone/country/canada')
    .then(
        function success(response){
            console.log(response)
            let data = processData(response);
            let cases = getCases(data);
            let dev = getStdDev(data);
            let deaths = getDeaths(data);
            let recovered = getRecovered(data);

            let dates = getDates(data);
            let newDates = reformatDates(dates);
            myChart.data.labels = dates;
            myChart.data.datasets[0].data = cases;
            myChart.data.datasets[1].data = deaths;
            myChart.data.datasets[2].data = recovered;
            myChart.update();
            
            $('#slider-cont').css("margin-left", `${myChart.chartArea.left}px`);
            $("#flat-slider")
                .slider({
                    max: dates.length,
                    min: 1,
                    range: true,
                    values: [1, dates.length],
                    slide: function(event, ui){

                        let endpoints = [];
                        $('.ui-slider-pip').each(function(index){
                            if($(this).hasClass('ui-slider-pip-selected-1')){
                                console.log(index);
                                $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important');
                                $('.ui-slider-label').not( $('.ui-slider-label').eq(`${index}`) ).attr('style', 'display: none !important');
                                endpoints.push(index);
                            }

                            if($(this).hasClass('ui-slider-pip-selected-2')){
                                $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important');
                                endpoints.push(index);
                            }

                            newTimeline(endpoints, dates, cases, deaths, recovered);
                        });

                    }
                })
                .slider("pips", {
                    // first: "pip",
                    // last: "pip",
                    rest: "label",
                    labels: newDates,
                    step: 1
                });

            
        },
        function fail(data, status){
            console.log(status);
        }
    );



//bar chart -> provinces or states
var barCtx = document.getElementById('barChart');
var barChart = new Chart(barCtx, {
    type: 'horizontalBar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                data: [9, 7, 9, 6, 9, 10],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
        ]
    },
    options: {
        scales: {
            yAxes: [{
            
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }], 
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],

        },
        aspectRatio: 4,
    }
});

//init, cases filter for bar graph is selected at first load
$('.bar-filter').eq('0').addClass('select-cases');

$('.bar-filter').each( function(index){
    $(this).on("click", function(){
        switch(index){
            case 0:
                $(this).toggleClass('select-cases');
                if($('.bar-filter').eq('1').hasClass('select-deaths')){
                    $('.bar-filter').eq('1').removeClass('select-deaths');
                }

                if($('.bar-filter').eq('2').hasClass('select-recovered')){
                    $('.bar-filter').eq('2').removeClass('select-recovered');
                }
                break;
            case 1:
                $(this).toggleClass('select-deaths');
                if($('.bar-filter').eq('0').hasClass('select-cases')){
                    $('.bar-filter').eq('0').removeClass('select-cases');
                }

                if($('.bar-filter').eq('2').hasClass('select-recovered')){
                    $('.bar-filter').eq('2').removeClass('select-recovered');
                }
                break;
            case 2:
                $(this).toggleClass('select-recovered');
                if($('.bar-filter').eq('0').hasClass('select-cases')){
                    $('.bar-filter').eq('0').removeClass('select-cases');
                }

                if($('.bar-filter').eq('1').hasClass('select-deaths')){
                    $('.bar-filter').eq('1').removeClass('select-deaths');
                }
                break;
        }
    });
});