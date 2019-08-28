console.log("<JavaScript | Charts> Radar-Chart: Import Fn: >> Successful")


/*############################################################################
                  [ChartJS] Radar Chart - Portfolio Metrics
############################################################################*/

var color = Chart.helpers.color;

// Library: Chart Color Refs
var htmlTag = document.getElementById("chart-radar");// HTML Tag: Radar Chart Canvas
var configRadar = {
    type:"radar",
    data:{
        /*labels:[
            ["Sharpe", "Ratio"],
            ["Portfolio", "Return"],
            ["Portfolio", "Variance"],
            ["Portfolio", "Beta"],
            ["5-Year", "Performance"]
        ]*/

        labels:["Sharpe", "Return", "Risk", "Market", "5-Yr"],

        datasets:[{
            label:"Portfolio",
            backgroundColor:color("red").alpha(0.2).rgbString(),
            pointBackgroundColor:"red",
            lineTension:0,
            data: [.171, .182, .127, .259, .165]
        },
/*              {
            label:"S&P 500",
            backgroundColor:color("blue").alpha(0.2).rgbString(),
            pointBackgroundColor:"blue",
            lineTension:0,
            data:[.311, .211, .088, .213, .286]
        }*/
        ],
        options:{
            legend:{position:"top"},
            title:{
                display:true,
                text:"Portfolio Metrics",
                scale:{
                    ticks:{
                        beginAtZero:false
                    } // ticks
                } // scale
            }, // title
            layout:{
              padding:{
                left:0,
                right:0,
                top:0,
                bottom:0
              }
            }
        } // options
    } // data
} // configRadar


var chartRadar = new Chart(htmlTag, configRadar)
/*      window.onload = function(){
    console.log(htmlTag)
    console.log(configRadar)
    window.myRadar = new Chart(htmlTag, configRadar)
}*/

function addPortfolio(){
  chartRadar.data.datasets.push({
      label:"Portfolio",
      backgroundColor:color("red").alpha(0.2).rgbString(),
      pointBackgroundColor:"red",
      lineTension:0,
      data: [.171, .182, .127, .259, .165]
    }
  );
  chartRadar.update();
}

function addBenchmark(){
  if (chartRadar.data.datasets.length < 2){
    chartRadar.data.datasets.push({
      label:"S&P 500",
      backgroundColor:color("blue").alpha(0.2).rgbString(),
      pointBackgroundColor:"blue",
      lineTension:0,
      data:[.311, .211, .088, .213, .286]
    }
  )};
  chartRadar.update();
}

function resetRadar(){
  chartRadar.data.datasets = []
  addPortfolio();
}

