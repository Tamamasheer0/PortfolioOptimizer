console.log("<JavaScript | Charts> Volatility/Return Chart: Import Fn: Successful")

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
var tickers = ['AMZN','GOOG','FB']
var data0 = [1,-1,2,0,1];
var data1 = [0,-2,2,1,2];
var data2 = [2,-2,1,2,2];
var dataPfolio = [1,-1,1,-1,1];

class volDataset {
    constructor(data, number, id, dash) {
        this.borderWidth = 2;
        this.data = data;
        this.borderColor = rgbaColor(colorsLine[number], 0.8),
        this.backgroundColor = rgbaColor(colorsLine[number], 0.15);
        this.number = number;
        this.fill = false;
        this.borderDash = dash;
        this.label = `${id}`;
        this.type = 'line';
    }
}

var dataset0 = new volDataset(data0, 0, tickers[0], [5,5]);
var dataset1 = new volDataset(data1, 1, tickers[1], [5,5]);
var dataset2 = new volDataset(data2, 2, tickers[2], [5,5]);
var datasetPfolio = new volDataset(dataPfolio, 3, 'Optimized Portfolio', []);

var data_bar = 0;
var data_bar_neg = data_bar*-1;

// -----
var _data0 = [1,2,4,3,5];
var _data1 = [0,1,3,2,4];
var _data2 = [0,2,3,4,5];
var _dataPfolio = [1,2,3,5,6];

class rtnDataset {
    constructor(data, number, id, dash) {
        this.borderWidth = 2;
        this.data = data;
        this.borderColor = rgbaColor(colorsLine[number], 0.8),
        this.backgroundColor = rgbaColor(colorsLine[number], 0.15);
        this.number = number;
        this.fill = false;
        this.borderDash = dash;
        this.label = `${id}`;
        this.type = 'line';
    }
}

var _dataset0 = new rtnDataset(_data0, 0, tickers[0], [5,5]);
var _dataset1 = new rtnDataset(_data1, 1, tickers[1], [5,5]);
var _dataset2 = new rtnDataset(_data2, 2, tickers[2], [5,5]);
var _datasetPfolio = new rtnDataset(_dataPfolio, 3, 'Optimized Portfolio', []);

// -----

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

// -----

function renderVOL() {
    var vol = document.getElementById('volatility-chart');

    function newChart(chart, config) {
        var ctx = chart.getContext('2d');
        return new window.Chart(ctx, config);
    };

    var chartLine = document.getElementById('volatility-chart');

    var volChart = newChart(chartLine, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                dataset0,
                dataset1,
                dataset2,
                datasetPfolio,
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
                },
                point: {
                    radius: 0
                }
            },
            legend: {
                display: false
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
                        display: false
                    }
                }],
                yAxes: [{
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

// -----

    var rtn = document.getElementById('return-chart');

    function newChart(chart, config) {
        var ctx = chart.getContext('2d');
        return new window.Chart(ctx, config);
    };

    var chartLine = document.getElementById('return-chart');

    var rtnChart = newChart(chartLine, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                _dataset0,
                _dataset1,
                _dataset2,
                _datasetPfolio,
            ]
        },
        options: {
            elements: {
                line: {
                    tension: 0.4
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
                        let line0 = ci.data.datasets;
                        let line1 = volChart.chart.data.datasets;
                        if (line0[index].borderColor == rgbaColor(colorsLine[line0[index].number], 0.15)) {
                            for (value in indexes) {
                                line0[value].borderColor = rgbaColor(colorsLine[line0[value].number], 0.8);
                                line1[value].borderColor = rgbaColor(colorsLine[line1[value].number], 0.8);

                            }
                        }
                        for (value in filtered) {
                            if (line0[filtered[value]].borderColor != rgbaColor(colorsLine[line0[filtered[value]].number], 0.15)) {
                                line0[filtered[value]].borderColor = rgbaColor(colorsLine[line0[filtered[value]].number], 0.15);
                                line1[filtered[value]].borderColor = rgbaColor(colorsLine[line1[filtered[value]].number], 0.15);
                            }
                            else {
                                line0[filtered[value]].borderColor = rgbaColor(colorsLine[line0[filtered[value]].number], 0.8);
                                line1[filtered[value]].borderColor = rgbaColor(colorsLine[line1[filtered[value]].number], 0.8);
                            }
                        }

                        let std = [];
                        for(key in line1[index].data){
                            std.push((line1[index].data[key]));
                        }
                        data_bar = standardDeviation(std);
                        data_bar_neg = data_bar*-1;
                        for (data in line0[value].data) {
                            line1[4].data[data] = data_bar;
                            line1[5].data[data] = data_bar_neg;
                        }
                        line1[4].backgroundColor = rgbaColor(colorBar(data_bar),0.4);
                        line1[5].backgroundColor = rgbaColor(colorBar(data_bar),0.4);

                        var copy = Array.from(line0[index].data);
                        var exp = copy.pop();

                        vol.innerHTML = 'Standard Deviation: ' + Math.round(data_bar*100)/100;
                        rtn.innerHTML = 'Expected Return: $' + exp;

                        ci.update();
                        volChart.chart.update();
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
function off1() {
    document.getElementById('overlay1').style.display = 'none';
}
function on1() {
    document.getElementById('overlay1').style.display = 'block';
}
