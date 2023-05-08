
import Cookies from "./node_modules/js-cookie/dist/js.cookie.mjs";

const apiKey = "277298eb6341a54a8f7a17db41009443";

// Il y a une deuxième sécuriter sur la clé ;)
// Pour activer le watch Tailwind : npx tailwindcss -i ./input.css -o ./output.css --watch


let derniereVille = Cookies.get('derniereVille');
let liste = document.getElementById("liste");
let location =  document.getElementById("location");

async function fetchCoord(argVille){
    let dataFetch;
    try {
    dataFetch = await fetch("http://api.openweathermap.org/geo/1.0/direct?"
    + "q=" + argVille
    + "&appid=" + apiKey)
    return await dataFetch.json();
    } catch (error) {
        alert("Désolé, cette emplacement n'a pas été trouver.");
    }
}

async function fetchCoordReverse(argLat, argLong) {
    let dataFetch;
    try {
    dataFetch = await fetch("http://api.openweathermap.org/geo/1.0/reverse?"
    + "lat=" + argLat
    +"&lon=" + argLong
    + "&limit=5&appid=" 
    + apiKey)
    return await dataFetch.json();
    } catch (error) {
        alert("Désolé, cette emplacement n'a pas été trouver.");
    }
}

async function fetchDataCoord(argLat, argLong) {
    let dataFetch;
    try {
    dataFetch = await fetch("https://api.openweathermap.org/data/3.0/onecall?"
    + "lat=" + argLat
    +"&lon=" + argLong
    + "&exclude=current,hourly,minutely&units=metric&appid=" 
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
    let coords = await fetchCoord(derniereVille);
    ajouterVilleCoord(coords);
    CreerLaMetro()
}

async function ajouterVille(){
    let ville = document.getElementById("villeAChercher").value;
    let villeCoords = await fetchCoord(ville);
    ajouterVilleCoord(villeCoords);
    Cookies.set('derniereVille', ville)
}

async function ajouterVilleCoord(pos){
    console.log(pos);
    let data = await fetchDataCoord(pos[0].lat,pos[0].lon);
    location.innerText = "Voici la météo à "+ pos[0].name +" sur les trois prochains jours"
    CreerLaMetro(data)
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

function CreerLaMetro (data) {
    liste.innerHTML = '';
    for ( var i = 0 ; i < 3 ; i++){
        if (i == 0) {
            CreerCardMeteoCoord(data,i,"Aujourd'hui");
        }
        if (i == 1) {
            CreerCardMeteoCoord(data,i,"Demain");
        }
        if (i == 2) {
            CreerCardMeteoCoord(data,i,"Après Demain");
        }
    }
}

function CreerCardMeteoCoord(data, index, journee){
    
    let divPrincipale = document.createElement("div");
    divPrincipale.className = 
    "bg-neutral-800 text-white p-4 w-96 m-4 rounded-2xl m-4 flex flex-col justify-around items-center text-2xl shadow-2xl shadow-black hover:scale-110 transition";
    let titre = document.createElement("h1");
    titre.textContent = journee;
    let temperature = document.createElement("h2");
    temperature.textContent = "Temperature moyenne : " + data.daily[index].temp.day + "°C";
    let temperatureMin = document.createElement("h2");
    temperatureMin.textContent = "Temperature minimum : " + data.daily[index].temp.min + "°C";
    let temperatureMax = document.createElement("h2");
    temperatureMax.textContent = "Temperature maximum : " + data.daily[index].temp.max + "°C";
    let ciel = document.createElement("img");
    ciel.src = "https://openweathermap.org/img/wn/" + data.daily[index].weather[0].icon + "@2x.png"; 
    let humidite = document.createElement("p");
    humidite.textContent = "Humidité : " + data.daily[index].humidity + "%";
    let vent = document.createElement("p");
    vent.textContent = "Vitesse du vent : " + data.daily[index].wind_speed + " km/h";
    divPrincipale.append(titre);
    divPrincipale.append(temperature);
    divPrincipale.append(temperatureMax);
    divPrincipale.append(temperatureMin);
    divPrincipale.append(ciel);
    divPrincipale.append(humidite);
    divPrincipale.append(vent);
    liste.append(divPrincipale);
}

