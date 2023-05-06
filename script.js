
import Cookies from "./node_modules/js-cookie/dist/js.cookie.mjs";

const apiKey = "277298eb6341a54a8f7a17db41009443";

// Il y a une deuxième sécuriter sur la clé ;)
// Pour activer le watch Tailwind : npx tailwindcss -i ./input.css -o ./output.css --watch


let derniereVille = Cookies.get('derniereVille');
console.log(derniereVille);
let liste = document.getElementById("liste");

async function fetchData(argVille) {
    let dataFetch;
    dataFetch = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
    + argVille 
    + "&units=metric&appid=" 
    + apiKey)
    .then((response) => response.json())
    .finally((data) => dataFetch = data);
    if (dataFetch.cod === '404'){
        alert("Désolé, cette emplacement n'a pas été trouver.")
        return;
    }
    return dataFetch;
}

async function fetchDataCoord(argPos) {
    let dataFetch;
    try {
    dataFetch = await fetch("https://api.openweathermap.org/data/3.0/onecall?"
    + "lat=" + argPos.latitude
    +"&lon=" + argPos.longitude
    + "&exclude=hourly,minutely&units=metric&appid=" 
    + apiKey)
    return await dataFetch.json();
    } catch (error) {
        alert("Désolé, cette emplacement n'a pas été trouver.");
    }
}

document.getElementById("position").addEventListener("click",getPosition);
document.getElementById("chercherVille").addEventListener("click", ajouterVille);

Iniatilisation();

async function Iniatilisation(){
    if (derniereVille === undefined || ""){
        getPosition();
    }
    let data = await fetchData(derniereVille);
    CreerCardMeteo(data);
}

async function ajouterVille(){
    let ville = document.getElementById("villeAChercher").value;
    let data = await fetchData(ville);
    console.log(data);
    CreerCardMeteo(data);
    Cookies.set('derniereVille', ville)
}

async function ajouterVilleCoord(pos){
    let data = await fetchDataCoord(pos.coords);
    console.log(data);
    CreerCardMeteoCoord(data);
}

function getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(ajouterVilleCoord,error);
    } else {
     alert("La géocalisation n'est pas supporter avec votre explorateur.");
    }
  }

function error(){
    alert("Impossible de trouver votre géolocation")
}

function CreerCardMeteo(data){
    
    let divPrincipale = document.createElement("div");
    divPrincipale.className = 
    "bg-neutral-800 text-white p-4 w-96 m-4 rounded-2xl m-4 flex flex-col justify-around items-center text-2xl shadow-2xl shadow-black hover:scale-110 transition";
    let titre = document.createElement("h1");
    titre.textContent = "Météo à : " + data.name;
    let temperature = document.createElement("h2");
    temperature.textContent = "Temperature moyenne : " + data.main.temp + "°C";
    let temperatureMin = document.createElement("h2");
    temperatureMin.textContent = "Temperature minimum : " + data.main.temp_min + "°C";
    let temperatureMax = document.createElement("h2");
    temperatureMax.textContent = "Temperature maximum : " + data.main.temp_max + "°C";
    let ciel = document.createElement("img");
    ciel.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"; 
    let humidite = document.createElement("p");
    humidite.textContent = "Humidité : " + data.main.humidity + "%";
    let vent = document.createElement("p");
    vent.textContent = "Vitesse du vent : " + data.wind.speed + " km/h";
    divPrincipale.append(titre);
    divPrincipale.append(temperature);
    divPrincipale.append(temperatureMax);
    divPrincipale.append(temperatureMin);
    divPrincipale.append(ciel);
    divPrincipale.append(humidite);
    divPrincipale.append(vent);
    liste.prepend(divPrincipale);
}

function CreerCardMeteoCoord(data){
    
    let divPrincipale = document.createElement("div");
    divPrincipale.className = 
    "bg-neutral-800 text-white p-4 w-96 m-4 rounded-2xl m-4 flex flex-col justify-around items-center text-2xl shadow-2xl shadow-black hover:scale-110 transition";
    let titre = document.createElement("h1");
    titre.textContent = "Météo à : " + data.lat + " " + data.lon;
    let temperature = document.createElement("h2");
    temperature.textContent = "Temperature moyenne : " + data.current.temp + "°C";
    let temperatureMin = document.createElement("h2");
    temperatureMin.textContent = "Temperature minimum : " + data.daily[0].temp.min + "°C";
    let temperatureMax = document.createElement("h2");
    temperatureMax.textContent = "Temperature maximum : " + data.daily[0].temp.max + "°C";
    let ciel = document.createElement("img");
    ciel.src = "https://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + "@2x.png"; 
    let humidite = document.createElement("p");
    humidite.textContent = "Humidité : " + data.current.humidity + "%";
    let vent = document.createElement("p");
    vent.textContent = "Vitesse du vent : " + data.daily[0].wind_speed + " km/h";
    divPrincipale.append(titre);
    divPrincipale.append(temperature);
    divPrincipale.append(temperatureMax);
    divPrincipale.append(temperatureMin);
    divPrincipale.append(ciel);
    divPrincipale.append(humidite);
    divPrincipale.append(vent);
    liste.prepend(divPrincipale);
}

