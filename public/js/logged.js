var button_artist = document.querySelector("#artists")
var button_songs = document.querySelector("#songs")
var column_artist = document.querySelector(".column_artist")
var column_songs = document.querySelector(".column_songs")
const urlPath = window.location.pathname;
const id = urlPath.split('/').pop(); 


button_artist.addEventListener("click", open_artists)
button_songs.addEventListener("click", open_songs)

function open_artists(){
    column_songs.style.display = "none";
    column_artist.style.display = "flex";
}

async function open_songs(){

    column_artist.style.display = "none";
    column_songs.style.display = "flex";
    fetch(`/getSongs/${id}`)
    .then(response => response.json())
    .then(data => {
        data.forEach((elemento,index) =>{
            RenderSongs(elemento,index)
        })
    }
        )
}

function RenderSongs(data,index){

    const section= document.createElement("section")
    section.classList.add("file")
    section.innerHTML = `
    <h1>${ index + 1}</h1>
    <span class="info_artist">
        <h3>Name: ${data.name}</h3>
        <h3>Popularity: ${data.popularity}</h3>
        <h3>Aprox Duration: ${Math.round(data.duration_ms / 60000)} min</h3>
    </span>
    <span class="art_foto">
        <img src="${data.album.images[1].url}" alt="">
    </span>
`
    column_songs.appendChild(section)
}
