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
                    beginAtZero: true
                },
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],
            xAxes: [{
                gridLines:{
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],

        },
        aspectRatio: 3,
        animation: {
            duration: 2000,
        },
    }
});

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