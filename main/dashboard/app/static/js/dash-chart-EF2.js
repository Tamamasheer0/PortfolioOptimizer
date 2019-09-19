console.log("**Updated** <JavaScript | Charts> Scatter-Chart: Import Fn >> Successful")

/*############################################################################
                  [ChartJS] Radar Chart - Portfolio Metrics
############################################################################*/


var hexToRgb = function hexToRgb(hexValue) {
    var hex;
    hexValue.indexOf('#') === 0 ? hex = hexValue.substring(1) : hex = hexValue; // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    }));
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

var rgbaColor = function rgbaColor(color, alpha) {
    if (color === void 0) {
        color = colors[0];
    }
    if (alpha === void 0) {
        alpha = 0.5;
    }
    return "rgba(" + hexToRgb(color) + "," + alpha + ")";
};

// SORT PORTFOLIOS
function compare(a,b) {
    const xA = a.x;
    const xB = b.x;

    let comparison = 0;
    if (xA > xB) {
        comparison = 1;
    }
    if (xA < xB) {
        comparison = -1
    }
    return comparison;
}

var scatterData = [];
var scatterDataSorted = [];
var optimalPfolio = [];
var unoptimalPfolio = [];
var badPfolio = [];
var terriblePfolio = [];
var modPfolio = [];
var minvariancePfolio = {};
var bestPfolio = {};
var y=0;

window.onload=function(){
    var defaultURL = "/defChartEF"
    d3.json(defaultURL).then(function(data){
        console.log(data.EF)
        data.EF.forEach(function(d){
            console.log(d)
            scatterData.push(d)
        });
        console.log("[Flask Route | JavaScript] Query Efficient Frontier Data")
        console.log(scatterData)

        scatterDataSorted = scatterData;
        scatterDataSorted.sort(compare);
        y=0;
        for (dict in scatterDataSorted) {
            if (scatterDataSorted[dict].y > y) {
                y = scatterDataSorted[dict].y;
                optimalPfolio.push(scatterDataSorted[dict]);
            }
            else {
                unoptimalPfolio.push(scatterDataSorted[dict]);
            }
        }
        y = 1;
        for (dict in unoptimalPfolio) {
            if (unoptimalPfolio[dict].y < y) {
                y = unoptimalPfolio[dict].y;
                terriblePfolio.push(unoptimalPfolio[dict]);
            }
            else {
                badPfolio.push(unoptimalPfolio[dict]);
            }
        }
        var z = 0;
        var x = 1;
        for (dict in optimalPfolio) {
            optimalPfolio[dict].z = optimalPfolio[dict].y/optimalPfolio[dict].x;
            if (optimalPfolio[dict].z > z) {
                bestPfolio = optimalPfolio[dict];
                z = optimalPfolio[dict].z;
            }
            if  (optimalPfolio[dict].x < x) {
                minvariancePfolio = optimalPfolio[dict];
                x = optimalPfolio[dict].x;
            }
        }



        var toMod = Array.from(optimalPfolio)
        toMod.shift();
        modPfolio = toMod.filter(function(value){
            return value != bestPfolio;
        })


        //  Render Chart

        var color = Chart.helpers.color

        var htmlEF = document.getElementById("chart-efficient-frontier")
        var configEF = {
            type:"scatter",
            data: {
                datasets: [
                    {
                    id: 'terrible',
                    borderWidth: 5,
                    data: terriblePfolio,
                    borderColor: rgbaColor('#dc143c', 0.5),
                    backgroundColor: rgbaColor('#dc143c', 0.5)
                    },
                    {
                    id: 'optimal',
                    borderWidth: 5,
                    data: optimalPfolio,
                    borderColor: rgbaColor('#00d97e', 0.5),
                    backgroundColor: rgbaColor('#00d97e', 0.5)
                    },
                    {
                    id: 'bad',
                    data: badPfolio,
                    borderColor: rgbaColor('#FFF', .15),
                    backgroundColor: rgbaColor('#fff', 0.3)
                    }
                ]},
            options: {
                events:['click'],
                legend: {
                    display: false
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false,
                    xPadding: 10,
                    yPadding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function label(tooltipItem) {
                            var sharpe = tooltipItem.yLabel/tooltipItem.xLabel;
                            return 'Sharpe ratio: ' + (Math.round(sharpe * 100))/100;
                        },
                        title: function title(tooltipItem, data) {
                            return data.datasets[tooltipItem[0].datasetIndex].label;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            show: true,
                            display:true,
                            labelString: 'Volatility',
                            fontColor: rgbaColor('#4899b1', 0.7),
                            fontStyle: 600
                        },
                        ticks: {
                            fontColor: rgbaColor('#4899b1', 0.7),
                            fontStyle: 600
                        },
                        gridLines: {
                            color: rgbaColor('#4899b1', 0.1),
                            lineWidth: 1
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                        show: true,
                        display: true,
                        labelString: 'Return',
                        fontColor: rgbaColor('#4899b1', 0.7),
                        fontStyle: 600
                        },
                        ticks: {
                            fontColor: rgbaColor('#4899b1', 0.7),
                            fontStyle: 600
                        },
                        gridLines: {
                            color: rgbaColor('#367385', 0.1),
                            lineWidth: 1
                        }
                    }]
                }       // Close Scales
            }           // Close Options
        };

        var scatter = new Chart(htmlEF, configEF);// Close configEF

var optimal = {
    id: 'optimal',
    borderWidth: 5,
    data: optimalPfolio,
    borderColor: rgbaColor('#00d97e', 0.5),
    backgroundColor: rgbaColor('#00d97e', 0.5)
};
var mod = {
    id: 'optimal',
    borderWidth: 5,
    data: modPfolio,
    borderColor: rgbaColor('#00d97e', 0.5),
    backgroundColor: rgbaColor('#00d97e', 0.5)
};
var bad = {
    id: 'bad',
    data: badPfolio,
    borderColor: rgbaColor('#ddd', 0.5),
    backgroundColor: rgbaColor('#ddd', 0.15)
};
var spy = {
    id: 'spy',
    label: 'S&P 500',
    borderWidth: 10,
    data: [{'x': 0.0742, 'y': 0.0724}],
    borderColor: rgbaColor('#ffd80a', 0.5),
    backgroundColor: rgbaColor('#ffd80a', 0.5)
};
var max = {
    id: 'max',
    label: 'Optimal Portfolio',
    borderWidth: 10,
    data: [bestPfolio],
    borderColor: rgbaColor('#ffd80a', 0.5),
    backgroundColor: rgbaColor('#ffd80a', 0.5)
};
var min = {
    id: 'min',
    label: 'Minimum Variance Portfolio',
    borderWidth: 10,
    data: [minvariancePfolio],
    borderColor: rgbaColor('#ffd80a', 0.5),
    backgroundColor: rgbaColor('#ffd80a', 0.5)
};



    })
}









/*docuemnt.select('#inefficient').on('click', function (e) {
    scatterChart.options.animation = false;
    if (e.target.checked == false) {
        var filtered = scatterChart.data.datasets.filter(function(value){
            return value.id != 'bad';
        });
        scatterChart.data.datasets = filtered;
        scatterChart.update();
    }
    else {
        scatterChart.data.datasets.push(bad);
        scatterChart.update();
    }
});
$('#spy').on('click', function (e) {
    scatterChart.options.animation = false;
    if (e.target.checked == true) {
        var filtered = scatterChart.data.datasets.filter(function(value){
            return value.id != 'optimal';
        });
        scatterChart.data.datasets = filtered;
        scatterChart.data.datasets.unshift(spy, max, min, mod);
        scatterChart.update();
    }
    else {
        scatterChart.data.datasets.push(optimal);
        scatterChart.data.datasets.splice(0,4);
        scatterChart.update();
    }
});

*/
