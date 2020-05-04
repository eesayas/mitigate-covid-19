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

var ctx = document.getElementById('myChart');
Chart.defaults.global.legend.display = false;
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
        // color: 'rgba(244, 132, 26, 1)'
    }
});
