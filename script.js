// dit is voor de javascript

// to do list

var dataHigh = [];
var dataLow = [];
var dataLabels = [];
var dataWaarde = "";
var tijdSerie = "";
var hoog = "";
var laag = "";
var aandeel = 0;

// als op invoeren gedrukt wordt start aanmaken van grafiek
// deze link op https://www.alphavantage.co/documentation/ (https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo) geeft een lijst van alle
// actieve symbolen in CSV

//ASML
document.getElementById('ASML').addEventListener("click", () => {
    allData("ASML", 1);
});

//NVDA - NVidia
document.getElementById('NVDA').addEventListener("click", () => {
    allData("NVDA", 1);
});

//Bitcoin
document.getElementById('BTC').addEventListener("click", () => {
    allData("BTC", 2);
});

//Ethereum
document.getElementById('ETH').addEventListener("click", () => {
    allData("ETH", 2);
});

const allData = async (aandeelNaam, optie) => {

    document.getElementById("chart-container").style.backgroundColor = "rgba(224,247,250, 0.85)";

    //invoer uit HTML uitlezen
    var dataName = aandeelNaam; 

    //Foutmelding boodschap resetten
    document.getElementById('message').innerHTML = "";

    //api key
    var apiKey = "JOUW_API_KEY";

    //variabele voor de url afhankelijk van optie
    var url = "";

    if (optie === 1) {
        //Alpha Vantage data API adres (url) om aandelen op te vragen (Daily Series)
        url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + dataName + "&apikey=" + apiKey;
        dataWaarde = "USD";
        tijdSerie = "Time Series (Daily)";
        hoog = "2. high";
        laag = "3. low";
        aandeel = 70;
        console.log("Aandelen");
    }

    if (optie === 2) {
        url = "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=" + dataName + "&market=EUR&apikey=" + apiKey;
        dataWaarde = "EURO";
        tijdSerie = "Time Series (Digital Currency Daily)";
        hoog = "2a. high (EUR)";
        laag = "3a. low (EUR)";
        aandeel = 940;
        console.log("Crypto");
    }  

    const stockDataCall = await fetch(url);
    console.log(stockDataCall);
    const stockData = await stockDataCall.json();
    console.log(stockData);

    //foutmelding handelen
    if (stockData["Note"]) {
        console.log(stockData["Note"]);
        let foutmelding = document.getElementById('message');
        foutmelding.innerHTML = `<h1>Deze API-call ging fout.</h1>`
        return;
    }

    const update = await stockDataParsing(stockData);
    const plotten = await setGraphs(dataLabels, dataLow, dataHigh, dataName, dataWaarde);
}

const stockDataParsing = async (data) => {

    // tijdelijke lokale variabelen die nodig zijn om de data uit de JSON te parsen
    let x;
    let tijdsData;
    let tempLabels = [];
    let tempHigh = [];
    let tempLow = [];

    // uit de variabele de specifieke data (Time Series) halen en array maken voor de namen (labels) van ieder datapunt (i.e. datum + uur)
    tempLabels = Object.keys(data[tijdSerie]);        

    //de uurdata uit het antwoord lezen uit specifieke tijdSerie
    tijdsData = data[tijdSerie];

    //data uit de variabele halen voor hoogste en laagste handelsprijzen
    for (x in tijdsData) {
        tempHigh.push(tijdsData[x][hoog]);
        tempLow.push(tijdsData[x][laag]);
    }

    //laatste waarden afhalen om laatste maand over te houden        
    while(aandeel--){
        tempLabels.pop();
        tempHigh.pop();
        tempLow.pop();
    }             
    
    console.log(tempLabels);
    // het omdraaien van de volgorde 
    dataLabels = tempLabels.reverse();
    dataHigh = tempHigh.reverse();
    dataLow = tempLow.reverse();
}

// functie om de grafiek te plotten met de labels, data (laag, hoog) en naam als parameters
const setGraphs = (labels, laag, hoog, naam, waarde) => {    

    //aanpassen kleur div om grafiek op te plotten
    let area = document.getElementsByClassName("chart-container");

    //hier definieer je dat data-plots, labels X-as, naam, kleur, etc.
    const data = {
        labels: labels,
        datasets: [{
            label: naam + " - laagste prijs",
            backgroundColor: '#004cff',
            borderColor: '#004cff',
            data: laag,
        }, {
            label: naam + " - hoogste prijs",
            backgroundColor: '#ff0000',
            borderColor: '#ff0000',
            data: hoog,
        }
        ]
    };

    //hier stel je de verdere configuratie van de grafiek in, met daarin de data const.
    const config = {
        type: 'line',
        data,
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    grid: {
                        color: 'grey',                                             
                    },
                    title: {
                        display: true,
                        text: 'DATUM',                        
                    },                    
                },
                y: {
                    grid: {
                        color: 'grey',                                               
                    },
                    title: {
                        display: true,
                        text: waarde,                        
                    },                    
                }
            },            
        }
    };

    // de grafiek in de HTML gaan plaatsen
    var mijnGrafiek = new Chart(
        document.getElementById('myChart'),
        config
    );

    //grafiek verwijderen als op de knop opnieuw gedrukt wordt
    document.getElementById('opnieuw').addEventListener("click", () => {
        mijnGrafiek.destroy();
        document.getElementById("chart-container").style.backgroundColor = "transparent";
    }
    )
}
