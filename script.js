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

var dataHigh = [];
var dataLow = [];
var dataLabels = [];

document.getElementById('invoeren').addEventListener("click", () => {
    allData();
});

const allData = async () => {

    //invoer uit HTML uitlezen
    var dataName = document.getElementById('invoer').value.toUpperCase();
    console.log(dataName);

    //Foutmelding boodschap resetten
    document.getElementById('message').innerHTML = "";

    //grafiek resetten
    var oud = document.getElementById('myChart');
    console.log(oud);

    var apiKey = "API_KEY";

    //Alpha Vantage data API adres (url)
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + dataName + "&apikey=" + apiKey;

    const stockDataCall = await fetch(url);
    const stockData = await stockDataCall.json();

    //foutmelding handelen
    if (stockData["Error Message"]) {
        console.log(stockData["Error Message"]);
        let foutmelding = document.getElementById('message');
        foutmelding.innerHTML = `<h1>Deze API-call ging fout. Weet u zeker dat u een bestaand aandeel heeft ingevoerd?</h1>`
        return;
    }
    const update = await stockDataParsing(stockData);
    const plotten = await setGraphs(dataLabels, dataLow, dataHigh, dataName);
}

const stockDataParsing = async (data) => {

    // uit de variabele de specifieke data (Time Series) halen en array maken voor de namen (labels) van ieder datapunt (i.e. datum + uur)
    let tempLabels = Object.keys(data["Time Series (Daily)"]);

    //de uurdata uit het antwoord lezen (Time Series (Daily))
    tijdsData = data["Time Series (Daily)"];

    let x;
    let tempHigh = [];
    let tempLow = [];

    //data uit de variabele halen voor hoogste ("2. high") en laagste ( "3. low") handelsprijzen en het handelsvolume ("5. volume")
    for (x in tijdsData) {
        tempHigh.push(tijdsData[x]["2. high"]);
        tempLow.push(tijdsData[x]["3. low"]);       
    }

    // het omdraaien van de volgorde 
    dataLabels = tempLabels.reverse();    
    dataHigh = tempHigh.reverse();
    dataLow = tempLow.reverse();
}

// functie om de grafiek te plotten met de labels, data (laag, hoog) en naam als parameters
const setGraphs = (labels, laag, hoog, naam) => {

    const data = {
        labels: labels,
        datasets: [{
            label: naam + " - laagste prijs",
            backgroundColor: '#004cff',
            borderColor: '#004cff',
            data: laag,
        },{
            label: naam + " - hoogste prijs",
            backgroundColor: '#ff0000',
            borderColor: '#ff0000',
            data: hoog,
        }    
    ]
    };

    const config = {
        type: 'line',
        data,
        options: {}
    };

    // de grafiek in de HTML gaan plaatsen
    var mijnGrafiek = new Chart(
        document.getElementById('myChart'),
        config
    );

    document.getElementById('opnieuw').addEventListener("click", () => {
        mijnGrafiek.destroy();
    }
    )
}