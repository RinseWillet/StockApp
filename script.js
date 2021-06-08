// dit is voor de javascript

var labels1 = [];
var dataStock = {
    labels: labels1,
    dataset: [{
        label: '',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }]
};

// to do list
// function als arrowfunction herschrijven
// labels (datum + tijd) uit JSON response peuteren en tot zinnige labels in een labelarray dataLabels plaatsen
// dataTradevolume en datalabels visualiseren in ChartJS
// dataHigh en datalabels visualiseren in ChartJS
// dataLow en datalabels visualiseren in ChartJS
// selector voor grafieken maken
// input veld voor type aandeel maken
// crypto currency tracker


var tijdsData;
var dataTradevolume = [];
var dataHigh = [];
var dataLow = [];
var dataLabels = [];

//get the data from Alpha Vantage
// <!-- WGN8GB3LJSZPZR5R -->
function updateStock() {
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=60min&apikey=WGN8GB3LJSZPZR5R"
    var xhr = new XMLHttpRequest();
    console.log(tijdsData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 'OK' || (xhr.status >= 200 && xhr.status < 400)) {
                var inhoudDB = JSON.parse(this.responseText);             
                tijdsData = inhoudDB["Time Series (60min)"];
                let x;                
                for (x in tijdsData) {
                    // console.log(tijdsData[x]["5. volume"]);                    
                    dataTradevolume.push(tijdsData[x]["5. volume"]);
                    dataHigh.push(tijdsData[x]["2. high"]);
                    dataLow.push(tijdsData[x]["3. low"]);

                }
                console.log("hallo");             
                console.log(dataTradevolume);
                console.log(dataHigh);
                console.log(dataLow);
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

updateStock();
console.log("hiya");




const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
];
const data = {
    labels: labels,
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
    }]
};

const config = {
    type: 'line',
    data,
    options: {}
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);