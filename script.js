// dit is voor de javascript

// to do list
//input veld voor aandeel maken
//foutenhandeling regelen
//reset knop
// enkel laatste 30 dagen weergeven

// labels (datum + tijd) tot zinnige labels in een labelarray dataLabels plaatsen
// dataTradevolume en datalabels visualiseren in ChartJS
// dataHigh en datalabels visualiseren in ChartJS
// dataLow en datalabels visualiseren in ChartJS
// selector voor grafieken maken
// input veld voor type aandeel maken
// crypto currency tracker

var dataTradevolume = [];
var dataHigh = [];
var dataLow = [];
var dataLabels = [];

const allData = async () => {

    var dataName = document.getElementById('invoer').value;
    console.log(dataName);
    var apiKey = "WGN8GB3LJSZPZR5R";

    //Alpha Vantage data API adres (url)
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + dataName + "&apikey=" + apiKey;
    
    const stockDataCall = await fetch(url);    
    const stockData = await stockDataCall.json();    
    if(stockData["Error Message"] === null){
        console.log(stockData["Error Message"]);
        document.getElementById('message').innerHTML = "foutje";
        return;       
    } 
    const update = await stockDataParsing(stockData);
    const plotten = await setGraphs(dataLabels, dataLow, dataName);
    
}

const stockDataParsing = async (data) => { 
    
        // uit de variabele de specifieke data (Time Series) halen en array maken voor de namen (labels) van ieder datapunt (i.e. datum + uur)
        let tempLabels = Object.keys(data["Time Series (Daily)"]);
            
        //de uurdata uit het antwoord lezen (Time Series (Daily))
        tijdsData = data["Time Series (Daily)"];

        let x;
        let tempVolume = [];
        let tempHigh = [];
        let tempLow = [];

        //data uit de variabele halen voor hoogste ("2. high") en laagste ( "3. low") handelsprijzen en het handelsvolume ("5. volume")
        for (x in tijdsData) {
            tempVolume.push(tijdsData[x]["5. volume"]);
            tempHigh.push(tijdsData[x]["2. high"]);
            tempLow.push(tijdsData[x]["3. low"]);
        }

        // het omdraaien van de volgorde 
        dataLabels = tempLabels.reverse();
        dataTradevolume = tempVolume.reverse();
        dataHigh = tempHigh.reverse();
        dataLow = tempLow.reverse();
}

// functie om de grafiek te plotten met de labels, data en naam als parameters
const setGraphs = (labels, antwoordData, name) => {
    const data = {
        labels: labels,
        datasets: [{
            label: name,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: antwoordData,
        }]
    };

    const config = {
        type: 'line',
        data,
        options: {}
    };

    // de grafiek in de HTML gaan plaatsen
    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
