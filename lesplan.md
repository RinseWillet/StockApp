# IT Proeverij 29-6-2021

## Hou je eigen aandelen bij met Chart.JS en Alpha Vantage API

# Stap 1 Repl.IT, API key, JSON

We werken voor dit project in Repl.it en we beginnen met het aanmaken can een HTML, CSS, JS project. We moeten om de data van de aandelen op te halen een API key aanmaken bij Alpha Vantage. https://www.alphavantage.co/support/#api-key . Alpha Vantage is een platform dat voor startende ontwikkelaars gratis aandelen en valuta data deelt. Vervolgens kunnen we de data gaan aanroepen. Met de link https://www.alphavantage.co/documentation/ zie je dat er heel veel mogelijkheden zijn om data op te vragen. Wij gaan vandaag gebruik maken van de Stock Time Series - Time_Series_Daily (https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo) die de dagelijkse data van een verhandeld aandeel teruggeeft en eventueel van de Cryptocurrencies - Digital_Currency_Daily (https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo) die dagelijkse data van de koersontwikkeling van cryptocurrencies teruggeeft. Wat je op het scherm krijg is een zgn. JSON (JavaScript Object Notation) antwoord terug, heel herkenbaar aan de { }. En binnen die brackets staat een heleboel labels met waarden. Met deze waarden gaan we dadelijk aan de slag.

# Stap 2 Index.html

We gaan nu beginnen met programmeren in Repl.it. Na de boilerplate HTML, bouw link ik het script.js file en link ik naar het script van Chart.JS. Chart.JS is een zog. library (een verzameling van allemaal stukjes code in JavaScript) die gemaakt is om grafieken op een scherm te toveren. Je kunt deze library zelfs geheel op je computer installeren (handig als je hier vaker mee gaat werken), maar in Repl.It maken we een link naar het script zodat de functionaliteit in ons project ingeladen kan worden. Daarna gaan we ook ons eigen script.js bestand linken naar de html. Als laatste ga ik in de HTML een div maken die als container gaat fungeren waarbinnen we een zog. canvas gaan plaatsen. Dat canvas wordt de plek waarop de grafiek geprojecteerd gaat worden, en de container div is handig om meer styling/plaatsings kenmerken mee te geven. Alles krijgt hier een class, behalve de canvas. De canvas krijgt een id, die we heel speciek vanuit onze JS gaan targeten.

```javascript

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="style.css" />
    <title>Stock App</title>

  </head>
  <body>
    <div id="chart-container">
      <canvas id="myChart"> </canvas>
    </div>

    <script src="script.js"></script>
  </body>
</html>
```

# Stap 3 Style.css

Ik begin met style voor de chart-container in de style.css, omdat het meegeven van de grootte etc. dan zorgt dat de grafiek mooi in het scherm valt. Ik zet ook alvast de positie op relative en display op flex (dit doe ik zodat het canvas dadelijk mooi in het midden geplaatst kan worden met andere elementen eronder) Daarnaast moeten we wat boiler-plate CSS schrijven om te zorgen dat de grootte, de padding, margin, en sizing netjes uitgevoerd worden, en ik zet box-sizing: border-box om te zorgen dat bij de breedte en hoogte van alle elementen de margin en padding meegerekend worden. Daarnaast kopieer ik een achtergrondplaatje in mn project en zet deze als achtergrond in.

```css
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
  color: white;
}

body {
  min-height: 100vh;
  background-image: url("background.webp");
  background-color: #e0f7fa;
  padding: 4rem;
}

#chart-container {
  height: 75vh;
  margin-top: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  object-fit: cover;
}
```

# Stap 4 Script.JS - API call, foutmelding

Nu ga ik de website/app die we gemaakt hebben dynamisch maken en we beginnen door de variabelen te maken die we nodig gaan hebben om de data uit te lezen uit onze API en om de grafiek mee te gaan plotten. We willen de hoogste en laagste waarden hebben van het aandeel over een bepaalde tijd, dus maken we een drietal arrays (array = een reeks van data, bijvoorbeeld getallen - long, short, integers; kommagetallen - doubles, floats; bytes; characters; of strings - reeks/draad van characters aan elkaar zoals een woord), 1 voor de hoge waarden, 1 voor de lage waarden, en 1 voor de labels die we op de x-as (horizontale as) moeten gaan zetten. In ons geval worden de labels gewoon dag-data (e.g. 21-05-2021). Heel belangrijk is ook de variabele voor de url, waarmee we de Alpha Vantage API gaan aanspreken. De dataWaarde is puur om dadelijk langs de Y-as (vertikale as) het label van de waarde (USD, EURO, YEN etc.) kunnen noteren.

```JavaScript

//variabelen
var dataHigh = [];
var dataLow = [];
var dataLabels = [];
var dataWaarde = "";

//api key
var apiKey = "JOUW_API_KEY";

//variabele voor de url afhankelijk van optie
var url = "";

```

Daarnaast moeten we een methode gaan schrijven, die we kunnen aanroepen om via het internet de API aan te spreken. We maken er een arrowfunctie van (dus een const waarin de functie zit) en dat is de wat modernere manier van JavaScript notatie voor methodes/functies (ipv. function allData(){}). Het wordt een asynchrone functie (async). Dit zorgt ervoor dat deze methode andere methodes laat doorlopen, terwijl deze functie mag wachten op het uitvoeren van functies. Hier gaan we de methode bijvoorbeeld laten wachten op een antwoord van het internet in onze API call. Dit is redelijk hetzelfde principe als in onze IT proeverij over de Java weerApp. Het eerste wat we doen is de achtergrondkleur van onze div chart-container aanpassen, zodat de grafiek hier mooi op geprojecteerd kan worden. Daarna gaan we het argument van de aandeelnaam in een lokale variabele zetten. Vervolgens gaan we onze variabele url vullen met de Alpha Vantage API query met als variabelen daarin de dataName en de API key. Op die manier krijg je de data van het aandeel wat je wil met jouw API key. (je kunt deze string met het aandeelnaam en apikey ook eens in een webbrowser invullen en kijken wat er gebeurd). Het volgende wat we doen is de API met de url variabele oproepen met het fetch commando van JavaScript. Met fetch kun je asynchroon data ophalen via een HTTP pipeline, waar je vervolgens allerlei functies mee kunt gaan uitvoeren. Het await geeft aan dat we wachten op het uitvoeren van de functie (dus we laten de rest van de code niet verder lopen binnen de methode allData). We stoppen het antwoord in een const. En we zien dat er vanallen in dat antwoord zit, maar dat het nog niet de JSON is die we van de API call in een webbrowser krijgen. Daarom gaan we ook met de .json() functie uit het antwoord specifiek de JSON halen. Ook hier gebruiken we await, zodat er gewacht wordt tot de stockDataCall compleet gelezen is en dan de JSON eruit gehaald wordt. In deze JSON zien we wel de data die we herkennen van de web-api call. Als laatste moeten we in deze stap een specifieke foutmelding uitfilteren, en die heeft alles te maken met het gelimiteerde aantal API-calls voor een gratis Alpha Vantage account (bij meer dan 5 per minuut geeft de API een note terug als antwoord). We lossen dit op met een if-statement en vervolgens ook naar de html een foutmelding weer te geven zodat je ook ziet wat er gebeurd aan de voorkant. Om dit goed te doen maken we nog een div in de index.html en we geven een beetje styling mee voor de div in onze CSS. Nu hebben we de API call gemaakt en kunnen we verder met de data uit de JSON lezen.

in script.js
```JavaScript
const allData = async(aandeelNaam) => {

    // achtergrondkleur voor de grafiek
    document.getElementById("chart-container").style.backgroundColor = "rgba(224,247,250, 0.85)";

    //invoer uit HTML uitlezen
    var dataName = aandeelNaam;

    url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + dataName + "&apikey=" + apiKey;

    //ik ga even uit van een Amerikaans aandeel verhandeld in dollars
    dataWaarde = "USD";

    //fetch de data
    const stockDataCall = await fetch(url);
    console.log(stockDataCall);

    //het json antwoord uit de response halen
    const stockData = await stockDataCall.json();
    console.log(stockData);

    //foutmelding handelen
    if (stockData["Note"]) {
        console.log(stockData["Note"]);
        let foutmelding = document.getElementById('message');
        foutmelding.innerHTML = `<h1>Deze API-call ging fout.</h1>`
        return;
    }
}

//aanroepen functie allData
allData("ASML");
```
in index.html
```HTML
    <div id="chart-container">
        <canvas id="myChart"> </canvas>
    </div>
    <div id="message"></div>
```
in style.css
```CSS
#message{
    font-size:large;    
    color: white;
    background: #BF360C;
}
```

# Stap 5 Parsing van ons JSON antwoord in data voor de grafiek

Om de data die we willen uit het grote JSON antwoord te halen, schrijven we weer een async functie die we gaan aanroepen vanuit de allData functie (weer met await, zodat het volledige antwoord wordt afgewacht). Als argument krijgt de methode data mee (nl. de StockData uit de allData methode). We beginnen in de functie met een aantal lokale variabelen te maken (let) die we enkel gaan gebruiken om de JSON uit te lezen. Als eerste ga ik de labels uit het antwoord uitlezen (dit zijn de datums voor de dagen) en dat doe ik met het commando Object.keys(), waarmee je de 'enumerable keys' (zegmaar de eigenschapsnamen) uit een JSON object kunt halen in JavaScript. Kijk maar eens in de webbrowser API call en daar zie je onder Time Series allemaal dagen staan met daarin de data. Voor de labels willen we de deze dagen hebben zonder de data. Vervolgens zetten we de data (Time Series (Daily)) in een variabele tijdsData waar we de data uit gaan halen. De x gaan we gebruiken we voor een for enhanved loop om daarmee ons tempHigh en tempLow array te vullen met de data uit de json. Met de for loop laten we helemaal door de tijdsData heen lopen, dus langs alle dagen. En voor iedere dag willen we de data in onze tempHigh en -low array zetten. En dit doen we met het commando .push() waarmee we waarde van die dag (dat index nummer, en dat geven we aan met x - zie console.log) in het array duwen, totdat alle waardes erin zitten. Vervolgens gebruiken we een while-loop om de laatste 70 waarden uit onze arrays te halen zodat we de laatste maand overhouden. We doen dat met while(aandeel--) wat betekent dat zolang aandeel (die 70 is) - 1 niet negatief is, dan mag die iets uitvoeren. En in dit geval zeggen we dat er iedere keer de laatste waarde weggegooid mag worden uit de onze temp-arrays. Dit doen we met .pop(); Daarna zien we nog dat de waardes van nieuw naar oud lopen, wat zou kunnen zorgen dat we op onze grafiek de oudste waardes helemaal rechts krijgen en de nieuwste links. Maar we lezen van links naar rechts, dus is het handig deze waardes om te draaien. Dat kan met het .reverse() commando. Nu hebben we onze variabelen die we in het begin van het script opgezet hebben gevuld en kunnen we gaan beginnen met een grafiek aan te maken.

```JavaScript
const update = await stockDataParsing(stockData);

const stockDataParsing = async (data) => {

    console.log(data);

    let x;
    let tijdsData;
    let tempLabels = [];
    let tempHigh = [];
    let tempLow = [];
    let aandeel = 70;  

    // uit de variabele de specifieke data (Time Series) halen en array maken voor de namen (labels) van ieder datapunt (i.e. datum + uur)
    tempLabels = Object.keys(data["Time Series (Daily)"]);

    //de uurdata uit het antwoord lezen (Time Series (Daily))
    tijdsData = data["Time Series (Daily)"];

    //data uit de variabele halen voor hoogste ("2. high") en laagste ( "3. low") handelsprijzen
    for (x in tijdsData) {
            // console.log(x);
            tempHigh.push(tijdsData[x]["2. high"]);
            tempLow.push(tijdsData[x]["3. low"]);
    }

    //laatste 70 waarden afhalen om laatste maand over te houden        
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
```

# Stap 6 Grafiek aanmaken

Met de data kunnen we nu de grafiek gaan aanmaken. Dit doen we door vanuit onze allData functie weer een methode laten aanroepen die we laten wachten totdate de andere functies (van het data ophalen en JSON parsen) zijn uitgevoerd. We geven als parameters nu mee de labels, de low en high data, de naam van het aandeel, en de waarde van de valuta. In de functie maken we eerst een lokale variabele voor de div chart-container. En vervolgens maken we een const in waarin alle informatie over onze datasets en labels komt te staan voor de grafiek (labels, naam, kleur van de lijn en markers, en de data die geplot moet worden). Je ziet dat deze const erg lijkt op een JSON, met de curly brackets en square brackets voor de datasets. Let dus goed op het openen en sluiten van de haakjes. Vervolgens maken we een const config waarin we alle gegevens (ook de data const) inladen om de grafiek mee te configureren. Het type bepaald type van de grafiek (line, bar etc.), dan de data, en dat de options, waarin we de aspectratio ook false mogen zetten (zodat je de grafiek kunt aanpassen aan de grootte van de website) en de responsive op true te zetten wordt de grafiek aangepast naar de grootte van onze chart-container. Dan geven we wat opties over de scales mee (de assen), zoals de kleur van de as en raster, de titel en wat de tekst moet zijn. Als laatste gaan we deze grafiek als een Chart (vanuit de Chart.js library) in het canvas inladen in onze HTML. En dit doen we door een variabele te maken (mijngrafiek) waarin we het element van de canvas uit de html inladen en daarop een new Chart maken die de config const meekrijgt voor de configuratie. De reden dat we hier een variabele van maken is om later deze grafiek ook makkelijk te kunnen resetten als we een nieuwe grafiek willen maken. Nu werkt de grafiek.

```JavaScript

const plotten = await setGraphs(dataLabels, dataLow, dataHigh, dataName, dataWaarde);

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
}

```

# Stap 7 Keuze menu maken en resetten grafieken

Nu gaan we de keuze-opties inbouwen, aangezien we nu nog maar 1 aandeel (nl. ASML) er hardcoded ingezet hebben. Daarvoor beginnen we met een extra div in onze html te maken met daarin een aantal knoppen, die we kunnen indrukken om een aandeel te kunnen kiezen. We gaan ook alvast de reset knop bouwen, om de grafiek te kunnen resetten/wissen als we van aandeel willen wijzigen. Dit alles maken we voor de div chart-container.

in index.html
```HTML
<div class="keuze">
    <p>Kies het aandeel in waarvoor u data wilt visualiseren:</p>
    <input type="button" class="button" value="ASML" id="ASML" />
    <input type="button" class="button" value="NVidia" id="NVDA" />
    <input type="button" class="button" value="Reset" id="opnieuw" />
</div>
```
We geven wat styling aan de .keuze div grootte, kleur, hoogte, padding, fontsize. We gaan ook nog wat CSS styling aan de knoppen meegeven, om ze makkelijk zichtbaar te maken. Ik gebruik daarbij text-align om te zorgen dat de naam (value) van de knop in het midden komt, ik geef wat padding mee boven en onder en links en rechts. de display: inline-block geef ik aan dat ik de elementen in de div naast elkaar wil hebben EN dat ik zelf de hoogte, breedte, padding en margin mee mag geven. Font-size 16 pixels (1.6rem) en ik wil dat mn cursor een pointer wordt als ik op de knop kom. 

in style.css
```CSS
.keuze {
    background: rgba(128, 222, 234, 0.9);
    height: 10vh;    
    font-size: 2.5rem;
    padding: 1rem;
}

.button{
  background-color: #1976D2;
  border: none;
  color: white;
  padding: 1.2rem 3.2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.6rem;
  margin: 0.3rem 0.2rem;
  cursor: pointer;
}
```
Nu gaan we in de JavaScript interactiviteit aan de knoppen geven. Ik koppel eerst de button-id met document.getElementById('') en daar koppel ik een eventListener aan die een functie oproept als ik erop klik. Je ziet dat er een naamloze arrowfunctie wordt gestart bij "click" en die functie start vervolgens de allData functie met de String van het aandeel. Nog even de hardcoded functie beneden uitcommenten. Om te voorkomen dat er een fout komt (de grafiek of het Chart Object bestaat immers al) bij het dubbel klikken of het andere aandeel te klikken moeten we een reset knop koppelen die de grafiek uitschakkeld. Dit doen we door een eventlistener in de methode setGraphs te maken die de variabele mijnGrafiek (waarin de Chart zit) vernietigd wordt met .destroy(). Dit is een functionaliteit van Chart.JS om grafiek-objecten te vernietigen, zodat je een nieuwe kunt projecteren in de canvas div. Daarnaast zetten we de achtergrondkleur van de chart-container op transparant, zodat deze niet meer zichtbaar is. Feitelijk heb je nu al een toffe App gemaakt, die in de laatste stap wordt uitgebreid met Cryptocurrency koersen.

in script.js
```JavaScript
//buiten alle functies
//ASML
document.getElementById('ASML').addEventListener("click", () => {
    console.log("geklikt");
    allData("ASML");
});

//NVDA - NVidia
document.getElementById('NVDA').addEventListener("click", () => {
    allData("NVDA");
});

//In de methode setGraphs:

//grafiek verwijderen als op de knop opnieuw gedrukt wordt
    document.getElementById('opnieuw').addEventListener("click", () => {
        mijnGrafiek.destroy();
        document.getElementById("chart-container").style.backgroundColor = "transparent";
        }
    )

//onderaan: 
//aanroepen functie allData
// allData("ASML");
```

# Stap 8 Cryptocurrency koersen

Voor de laatste stap gaan we een andere API van Alpha Vantage, speciaal voor Cryptocurrencies aanroepen. Daarvoor gaan we twee extra knoppen maken in de HTML

in index.html
```HTML
<input type="button" class="button" value="Bitcoin" id="BTC" />
<input type="button" class="button" value="Ethereum" id="ETH" />
```

Daarnaast gaan we in de JavaScript twee extra eventlisteners koppelen aan de knoppen en we gaan de oude een beetje aanpassen, zodat ze kunnen meegeven dat ze niet de aandelen-API maar de CryptoAPI aanroepen. We gaan daarom ook de allData functie aanpassen. Als ze optie 1 (aandeel) meekrijgen, dan moet de functie zoals die is worden uitgevoerd, maar als als optie 2 wordt meegegeven aan allData (dus Crypto) dan moeten we een andere API aanroepen. We doen dit met een if-statement. Ook willen we het JSON parsen wat anders gaan doen, omdat het JSON antwoord van de Crypto API anders is dan voor de aandelen API. We gaan ook wat extra variabelen aanmaken zodat we de stockDataParsing methode voor beide API calls kunnen gebruiken. Let op! Deze crypto JSON geeft standaard de data voor 1000 dagen mee, dus om gebruik te maken van dezelfde while-loop om alleen maar de laatste maand of 2 maanden te hebben, zetten we de variabele aandeel op 940, zodat we 60 dagen kunnen overhouden in de while loop.

in script.js
```JavaScript
// aan variabelen buiten methodes toevoegen:

var tijdSerie = "";
var hoog = "";
var laag = "";
var aandeel = 0;

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

    //Foutmelding boodschap resetten
    document.getElementById('message').innerHTML = "";

    //aandelen
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

    //crypto koersen
    if (optie === 2) {
        url = "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=" + dataName + "&market=EUR&apikey=" + apiKey;
        dataWaarde = "EURO";
        tijdSerie = "Time Series (Digital Currency Daily)";
        hoog = "2a. high (EUR)";
        laag = "3a. low (EUR)";
        aandeel = 940;
        console.log("Crypto");
    }  
    

```
We gaan ook de stockDataParsing iets aanpassen, zodat we de variabelen die we in het if-statement in Alldata hebben ingelezen kunnen gebruiken voor het parsen van de JSON data. Als je dit voor elkaar hebt is de app af! Let op, we hebben hier maar vier aandelen ingelezen, maar je kunt er veel meer uitlezen als je wilt. Met deze link kun je bijvoorbeeld een lijst krijgen voor alle aandelen en ETFs die de laatste handelsdag nog actief waren. - https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo - Daarnaast zijn er ook nog meer cryptocurrencies te vinden. Je kunt van al deze gewoon de SYMBOL (afkorting) neerzetten in plaats van bijv. ASML of NVDA of voor Crypto BTC of ETH.
 
in script.js
```JavaScript

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
```