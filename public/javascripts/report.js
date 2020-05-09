Chart.defaults.global.legend.display = false;

var ctx = document.getElementById('myPieChart');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: data = {
    datasets: [{
        data: [10, 20, 30]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    },
    options: {
        aspectRatio: 1
    }
});