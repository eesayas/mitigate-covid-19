let recovered = parseInt($('#recover-val').val().split(',').join(''));
let active = parseInt($('#active-val').val().split(',').join(''));
let dead = parseInt($('#dead-val').val().split(',').join(''));

Chart.defaults.global.legend.display = false;

var ctx = document.getElementById('myPieChart');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: data = {
    datasets: [{
        data: [recovered, active, dead],
        backgroundColor: ["rgba(54, 162, 235, 0.3)",  "rgba(255, 99, 132, 0.3)", "rgba(114, 114, 114, 0.3)"],
        borderColor: [ "rgba(54, 162, 235, 1.0)", "rgba(255, 99, 132, 1.0)", "rgba(114, 114, 114, 1.0)"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Recovered',
            'Active',
            'Deaths'
        ],
        
    },
    options: {
        responsive: false,
        aspectRatio: 1
    }
});