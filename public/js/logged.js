var button_artist = document.querySelector("#artists")
var button_songs = document.querySelector("#songs")
var column_artist = document.querySelector(".column_artist")
var column_songs = document.querySelector(".column_songs")


button_artist.addEventListener("click", open_artists)
button_songs.addEventListener("click", open_songs)

function open_artists(){
    column_songs.style.display = "none";
    column_artist.style.display = "flex";
}

function open_songs(){
    column_artist.style.display = "none";
    column_songs.style.display = "flex";
}


