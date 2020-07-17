/*
 * Rick and Morty API uitlezen
 * 
 * Informatie bronnen:
 * https://rickandmortyapi.com/
 * 
 */

 var characters = {
    info: null,
    result: null,
    characters: null
};
var episodes = [], locations = [];

var settings = {
    page: 1,
    set: false
};

var settingsOpen = false;
 GetAllEpisodes();

 function GetAllCharacters () {

    //If the SwitchPage function didnt set a page then just use 0
    if (!settings.set) {
        settings.page = 1;
    }
    $.getJSON( `https://rickandmortyapi.com/api/character/?page=${settings.page}`, {
      format: "json"
    })
      .done(function( apiData ) {

        characters.result = apiData;
        characters.info = apiData.info;
        characters.characters = apiData.results;
        
        if (characters != null) {
            AppendCharacters();
        }
      });

 }



 function GetOtherData (type, value) {
    //zoek andere data
    if (type == 0) { // episode naam
        return episodes[value].name;
    } else if (type == 1) { // episode nummber
        return episodes[value].episode;
    } else if (type == 2) { // dimensie
        return locations[value].dimension;
    }
 }

 function GetAllEpisodes () {
    //Save alle episodes
    for (let index = 1; index < 32; index++) { // 31 episoides
        $.getJSON( `https://rickandmortyapi.com/api/episode/${index}`, {
            format: "json"
          })
            .done(function( episodeD ) {
                episodes.push(episodeD); //push ze naar de epiosdes array
            });
    }
    GetAllLocations();
 }

 function GetAllLocations () {
    //Save alle locaties
    for (let index = 1; index < 77; index++) { // 76 locations
        $.getJSON( `https://rickandmortyapi.com/api/location/${index}`, {
            format: "json"
          })
            .done(function( locationD ) {
                locations.push(locationD); //push ze naar de epiosdes array
            });
    }
    //Haal de characters op
    GetAllCharacters();
 }

 function AppendCharacters () {

    $('main, footer').hide(300);
    setTimeout (function () {
        $('.ricks').empty();
        for (let i = 0; i < characters.characters.length; i++) {
    
            var lastDimension
            //locatie url
            var locationURL = characters.characters[i].location.url;
            //haal de numers daaar uit
            if (locationURL == "") {
                lastDimension = `<p>Laatste dimensie: Unknown</p>`;
            } else {
                var dimNumber = locationURL.match(/\d+/g).map(Number);
                dimNumber = dimNumber - 1;
                lastDimension = `<p>Laatste dimensie: ${GetOtherData(2, dimNumber)}</p>`;
            }
    
            //episode url
            var lastEpItem = characters.characters[i].episode[characters.characters[i].episode.length-1];
            //haal de numers daaar uit
            var epNumber = lastEpItem.match(/\d+/g).map(Number);
    
            epNumber = epNumber - 1;
            const img = `<img src="${characters.characters[i].image}" />`;
            const name = `<p>Name: ${characters.characters[i].name}</p>`;
            const status = `<p>Status: ${characters.characters[i].status}</p>`;
            const species = `<p>Species: ${characters.characters[i].species}</p>`;
            const origin = `<p>Origin: ${characters.characters[i].origin.name}</p>`;
            const lastLocationName = `<p>Last location: ${characters.characters[i].location.name}</p>`;;
            const gender = `<p>Gender: ${characters.characters[i].gender}</p>`;
            const lastEpisode = `<p>Last episode: ${GetOtherData(0, epNumber)}, ${GetOtherData(1, epNumber)}</p>`;
            const buttons = `<a onclick="OpenDetailView(2, ${dimNumber});"class="detail-view-button">Location details</a> <a onclick="OpenDetailView(0, ${epNumber});" class="detail-view-button">Episode details</a>`
    
            const html = img+name+status+species+origin+lastLocationName+lastDimension+gender+lastEpisode+buttons;
            //Append het aan de html pagina
            $('.ricks').append(`<div class="character-card">${html}</div>`);
            SetNavButtons();
    
        }
    },400);
    $('main,footer').show(300);

}

function SwitchPage (page) {

    if (page == 'next') {
        if (settings.page < characters.info.pages) {
            settings.page++;
            settings.set = true;
            SetNavButtons();
            GetAllCharacters();
        }
    } else if (page == 'previous') {
        if (settings.page > 1) {
            settings.page--;
            settings.set = true;
            SetNavButtons();
            GetAllCharacters();
        }
    }

}
function OpenDetailView (type, value) {
    //Show detailed data
    var header = "", item0 = "", item1 = "", item2 = "", item3 = "", item4 = "", item5 = "";
    if (type == 0) { // episode naam
        header = `<h3>Episode ${episodes[value].episode} details</h3>`;
        item0 = `<p>ID: ${episodes[value].id}</p>`;
        item1 = `<p>Name: ${episodes[value].name}</p>`;
        item2 = `<p>Air date: ${episodes[value].air_date}</p>`;
    } else if (type == 2) { // dimensie
        header = `<h3>Locatie ${locations[value].id} details</h3>`;
        item0 = `<p>ID: ${locations[value].id}</p>`;
        item1 = `<p>Type: ${locations[value].type}</p>`;
        item2 = `<p>Dimensie: ${locations[value].dimension}</p>`;
    }
    $('.detail-view').empty();
    $('.detail-view').append('<div>'+header+item0+item1+item2+item3+item4+item5+'<a class="detail-view-button" onclick="CloseDetailView()">Close</a></div>');
    $('.detail-view').show(200);

    
 }

 function CloseDetailView () {
    $('.detail-view').hide(200);
    $('.detail-view').empty();
 }

 function SetNavButtons () {

    if (settings.page >= 25) {
        $('#next').attr("src", "assets/img/unavailable.png");
        $('#previous').attr("src", "assets/img/previous.png");
    } else if (settings.page <= 1) {
        $('#previous').attr("src", "assets/img/unavailable.png");
        $('#next').attr("src", "assets/img/next.png");
    } else {
        $('#next').attr("src", "assets/img/next.png");
        $('#previous').attr("src", "assets/img/previous.png");
    }
}