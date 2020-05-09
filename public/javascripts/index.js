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

//init dropdown
$('.ui.dropdown').dropdown(); 

//when dropdown value changes (ie new country)
$('#country-val').change( function(){
    let country = $(this).val();
    country = country.toLowerCase().split(' ').join('-'); //reformat
    
    location.href = `/timeline?country=${country}`; //redirect
});

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
                radius: 0
            }
        }
    }
});

/*
    This gets the data for a given country and update the chart accordingly
*/

// get the country slug value
let country = $('#country-val').val();

// make get request to service
$.ajax('/get-country-data/' + country)
    .then(
        function success(response){

            //update the chart with data from country
            updateChart(response);

            //init endpoints
            let start = moment(response.dateList[0]).format('YYYY-MM-DD');
            let end = moment(response.dateList[response.dateList - 1]).format('YYYY-MM-DD');

            $('#start-point').val(start);
            $('#end-point').val(end);

            //initialize slider for dates
            let newDates = reformatDates(response.dateList);
            initSlider(newDates, response);
        },
        function fail(data, status){
            console.log(status);
        }
    );

// This will update the chart with new data
const updateChart = (countryData) =>{

    //update data
    myChart.data.labels = countryData.dateList;
    myChart.data.datasets[0].data = countryData.caseList;
    myChart.data.datasets[1].data = countryData.deathList;
    myChart.data.datasets[2].data = countryData.recoveredList;

    //update chart
    myChart.update();
};  

// This will initialize the flat slider with the right data
const initSlider = (dates, countryData) => {

    $('#slider-cont').css("margin-left", `${myChart.chartArea.left}px`); //align margin with chart
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
                        $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important'); //hide other date labels
                        $('.ui-slider-label').not( $('.ui-slider-label').eq(`${index}`) ).attr('style', 'display: none !important');
                        endpoints.push(index);

                        //set value
                        let start = countryData.dateList[index];
                        start = moment(start).subtract(1, "days").format('YYYY-MM-DD');
                        $('#start-point').val(start);
                    }

                    if($(this).hasClass('ui-slider-pip-selected-2')){
                        $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important');
                        endpoints.push(index+1);

                        //set value
                        let end = countryData.dateList[index];
                        end = moment(end).subtract(1, "days").format('YYYY-MM-DD');
                        $('#end-point').val(end);
                    }

                    updateTimeline(endpoints, countryData); //update timeline
                });
            }
        })
        .slider("pips", {
            rest: "label",
            labels: dates,
            step: 1
        });
}

// This reformats MMM DD YYYY => MMM DD
const reformatDates = (dates) =>{
    let newDateList = [];
    dates.forEach((element) => {
        let newDate = moment(element).format("MMM DD");
        newDateList.push(newDate);
    });
    return newDateList;
}

//this will update the chart with new timeline
const updateTimeline = (endpoints, countryData) => {
    let start = endpoints[0];
    let end = endpoints[1];

    let newCountryData = {
        dateList: countryData.dateList.slice(start, end),
        caseList: countryData.caseList.slice(start, end),
        deathList: countryData.deathList.slice(start, end),
        recoveredList: countryData.recoveredList.slice(start, end)
    }

    updateChart(newCountryData);
}

//this initalizes listener for timeline report btn
const initReportBtnListener = (country) => {
    $('#report-btn').on('click', function(){
        let start = $('#start-point').val();
        let end = $('#end-point').val();
        // location.href = `/${country}/report?start=${start}&end=${end}`;
        window.location.href = '/report';
    });
}

initReportBtnListener(country); //run func above

//adjust slider margin when resizing window
$(window).resize(function(){
    $('#slider-cont').css("margin-left", `${myChart.chartArea.left}px`);
});