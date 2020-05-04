//init
$('.curve-filter').eq('0').addClass('select-cases');
$('.curve-filter').eq('1').addClass('select-deaths');
$('.curve-filter').eq('2').addClass('select-recovered');

$('.curve-filter').each( function(index){
    $(this).on("click", function(){
        switch(index){
            case 0:
                $(this).toggleClass('select-cases');
                break;
            case 1:
                $(this).toggleClass('select-deaths');
                break;
            case 2:
                $(this).toggleClass('select-recovered');
                break;
        }
    });
});

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


//case rate chart
var caseRateCtx = document.getElementById('caseRateChart');
var caseRateChart = new Chart(caseRateCtx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                data: [2, 6, 8, 10, 14, 20],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 3
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],
            xAxes: [{
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }]
        },
        aspectRatio: 1,
        elements: {
            line: {
                tension: 0
            }
        }
    }
});

//death rate chart
var deathRateCtx = document.getElementById('deathRateChart');
var deathRateChart = new Chart(deathRateCtx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                data: [2, 6, 8, 10, 14, 20],
                borderColor: 'rgba(114, 114, 114, 1)',
                borderWidth: 3
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],
            xAxes: [{
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }]
        },
        aspectRatio: 1,
        elements: {
            line: {
                tension: 0
            }
        }
    }
});

//recover rate chart
var recoverRateCtx = document.getElementById('recoverRateChart');
var recoverRateChart = new Chart(recoverRateCtx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                data: [2, 6, 8, 10, 14, 20],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 3
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }],
            xAxes: [{
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }]
        },
        aspectRatio: 1,
        elements: {
            line: {
                tension: 0
            }
        }
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
                borderWidth: 3
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
        aspectRatio: 3,
    }
});

//infection trajectory
var trajectoryCtx = document.getElementById('trajectoryChart');
var trajectoryChart = new Chart(trajectoryCtx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'p'],
        datasets: [
            {
                data: [1, 4, 5, 6, 9, 10],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                borderWidth: 3
            },
            {
                data: [0, 12, 34, 36, 78, 100, 900],
                borderColor: 'rgba(114, 114, 114, 1)',
                fill: false,
                borderWidth: 3
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
        aspectRatio: 2,
        elements: {
            line: {
                tension: 0
            }
        }
    }
});
