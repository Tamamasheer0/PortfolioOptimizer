function standardDeviation(values){
    var avg = average(values);
    
    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
    
    var avgSquareDiff = average(squareDiffs);
  
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }
  
function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}
var colorsLine = ['#00d97e', '#f6c343', '#39afd1', '#e63757'];
var colorsBar = ['#00d97e','#ffd80a','#dc143c'];

var labels = [0,1,2,3,4];
var data0 = [1,-1,2,0,1];
var data1 = [0,-2,2,1,2];
var data2 = [2,-2,1,2,2];
var data_combo = [];
for (i = 0; i < data1.length; i++) {
    let value = data0[i] + data1[i] + data2[i];
    data_combo.push(value);
}

class dataset {
    constructor(data, number, id, dash) {
        this.borderWidth = 2;
        this.data = data;
        this.borderColor = rgbaColor(colorsLine[number], 0.8),
        this.backgroundColor = rgbaColor(colorsLine[number], 0.15);
        this.number = number;
        this.id = `${id}`;
        this.fill = false;
        this.borderDash = dash;
        this.label = `data${id}`;
        this.type = 'line';
    }
}

var dataset0 = new dataset(data0, 0, 0, [5,5]);
var dataset1 = new dataset(data1, 1, 1, [5,5]);
var dataset2 = new dataset(data2, 2, 2, [5,5]);
var dataset_combo = new dataset(data_combo, 3, '_combined', []);

var data_bar = 0;
var data_bar_neg = data_bar*-1;

function updateBar(datasetsBar) {
    console.log(data_bar);
    datasetsBar[0].data[0] = data_bar;
    datasetsBar[1].data[0] = data_bar*-1;
}

var hexToRgb = function hexToRgb(hexValue) {
    var hex;
    hexValue.indexOf('#') === 0 ? hex = hexValue.substring(1) : hex = hexValue;

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

function colorBar(data) {
    console.log(data);
    if (data <= 1.3) {
        return colorsBar[0];
    }
    if (data <= 1.6) {
        return colorsBar[1];
    }
    else {
        return colorsBar[2]
    }
}

function renderVOL() {
    function newChart(chart, config) {
        var ctx = chart.getContext('2d');
        return new window.Chart(ctx, config);
    };

    var chartLine = document.getElementById('lineVOL');

    var lineVOL = newChart(chartLine, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                dataset0,
                dataset1,
                dataset2,
                dataset_combo,
                {backgroundColor: rgbaColor(colorBar(data_bar),0.3),
                borderWidth: 2,
                data: [data_bar,data_bar,data_bar,data_bar,data_bar,],
                borderColor: 'rgba(0, 0, 0, 0.0)'
                },
                {
                backgroundColor: rgbaColor(colorBar(data_bar),0.3),
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.0)',
                data: [data_bar_neg,data_bar_neg,data_bar_neg,data_bar_neg,data_bar_neg]
                }
            ]
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            legend: {
                display: true,
                labels: {
                    fontColor: rgbaColor('#fff', 0.7),
                    fontStyle: 600,
                    padding: 20
                },
                onClick: 
                    function(e, legendItem) {
                        let indexes = [0,1,2,3];
                        var ci = this.chart;
                        var index = legendItem.datasetIndex;
                        let filtered = indexes.filter(function(value){
                            return value != index;
                        });
                        let line = ci.data.datasets;
                        if (line[index].borderColor == rgbaColor(colorsLine[line[index].number], 0.15)) {
                            for (value in indexes) {
                                line[value].borderColor = rgbaColor(colorsLine[line[value].number], 0.8);
                            }
                        }
                        for (value in filtered) {
                            if (line[filtered[value]].borderColor != rgbaColor(colorsLine[line[filtered[value]].number], 0.15)) {
                                line[filtered[value]].borderColor = rgbaColor(colorsLine[line[filtered[value]].number], 0.15);
                            }
                            else {
                                line[filtered[value]].borderColor = rgbaColor(colorsLine[line[filtered[value]].number], 0.8);
                            }
                        }
                        
                        let std = [];
                        for(key in ci.data.datasets[index].data){
                            std.push(ci.data.datasets[index].data[key]);
                        }
                        data_bar = standardDeviation(std);
                        data_bar_neg = data_bar*-1;
                        console.log(data_bar_neg);
                        for (data in line[value].data) {
                            line[4].data[data] = data_bar;
                            line[5].data[data] = data_bar_neg;
                        }
                        line[4].backgroundColor = rgbaColor(colorBar(data_bar),0.5);
                        line[5].backgroundColor = rgbaColor(colorBar(data_bar),0.5);

                        ci.update();
                    }
            },
            hover: {
                mode: null
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    barPercentage: 1.015,
                    categoryPercentage: 1.0,
                    stacked: true,
                    scaleLabel: {
                        show: true,
                        labelString: 'Month'
                    },
                    ticks: {
                    fontColor: rgbaColor('#fff', 0.7),
                    fontStyle: 600
                    },
                    gridLines: {
                    color: rgbaColor('#fff', 0.1),
                    lineWidth: 1
                    }
                }],
                yAxes: [{
                    stacked: true,
                    display: true,
                    ticks: {
                        maxTicksLimit: 5,
                        fontColor: rgbaColor('#fff', 0.7),
                        fontStyle: 600
                    },
                }]
            }
        }
    });
    
}

window.onload=renderVOL();