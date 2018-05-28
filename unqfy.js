
const picklejs = require('picklejs');

let artista = require('./JavaScript/Artista');
let Artista = artista.Artista;

let album = require('./JavaScript/Album');
let Album = album.Album;

let track = require('./JavaScript/Track');
let Track = track.Track;

let playList = require('./JavaScript/Playlist');
let Playlist = playList.Playlist;


class UNQfy {
  constructor(){
    this.artistas = [];
    this.playlist = [];
    this.contadorIdArtist= 1;
    this.contadorIdTrack= 1;
    this.contadorIdAlbum= 1;
  }
  
  getAllTracks(){
    let allAlbumes = this.getAllAlbunes();
    let res = [];
    for (var i = 0; i < allAlbumes.length; i++) { 
      res = res.concat(allAlbumes[i].pistas);  
    }
     return res;
  }

  getAllAlbunes(){
    let res = [];
    for (var i = 0; i < this.artistas.length; i++) {
       res = res.concat(this.artistas[i].albumes);
     }
     return res;
  }

  deleteArtistById(id){
    let rest = this.artistas.filter((artista)=> artista.artistId != id)
    this.artistas = rest;
  }
  artistaRepetido(nameArtis){
    // Verifica si hay ya un artista con ese mismo nombre 
    let boolean = false;
    boolean = this.artistas.some((art)=>art.name === nameArtis)
    return boolean

  }
  searchByName(name){
    // Filtra aquellos artistas cuyo nombre tengan incluido name en su string
    if(this.artistas != []){ 
    let res = this.artistas.filter((artista)=> this.containsName(artista.name, name))
    let resJSON = res.map((artista)=> artista.toJSON())
    return resJSON
    }
    return []
  }

  containsName(nameArtist, stringContains){
    // Verifica si StringContains se encuentra incluida en  nameArtist
    let stringContainsLower = stringContains.toLowerCase();
    return nameArtist.toLowerCase().indexOf(stringContainsLower) != -1
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    let tracks = this.getAllTracks(); 
    let tracksPL = tracks.filter(tr => tr.incluyeGenero(genres));
    return tracksPL
  }

  getTracksMatchingArtist(artistName) {
    let artista = this.getArtistByName(artistName);
    if(artista === undefined){
      return artista;
    }else{
      let res = [];
      for (var i = 0; i < artista.albumes.length; i++) {
      res = res.concat(artista.albumes[i].pistas);
      } 
    //let tracksAr = this.tracks.filter(tr => this.getAlbumByName(tr.albumName).artista === artistName)
    return res;
     } 
  }


  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
  // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    let nuevoArtista = new Artista(params.name, params.country);
    nuevoArtista.artistId = this.contadorIdArtist
    this.contadorIdArtist+=1
    this.artistas.push(nuevoArtista);
    return nuevoArtista
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    let artista = this.getArtistByName(artistName)
    if(artista === undefined){
      this.artistaNoEncontrado(artistName);
    }else{
        let nuevoAlbun = new Album(artista, params.name, params.year);
        artista.albumes.push(nuevoAlbun);
     }
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (strings)
  */
  addTrack(albumName, params) {
    let album = this.getAlbumByName(albumName)
    if(album === undefined){
      this.albumNoEncontrado(albumName);
    }else{
          let nuevoTrack = new Track(albumName, params.name, params.duration, params.genres)
          album.pistas.push(nuevoTrack)
    }
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
  }

   //                Solo un genero
   addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

    /* Precondicion: Tiene que haber los tracks necensarios para que se puede rellenar la playList   
    */
    let nuevoPlayList = new Playlist(name);
    let trackGener = this.getTracksMatchingGenres(genresToInclude);
    while(nuevoPlayList.duration()< maxDuration && trackGener.length != 0){
          let random = Math.floor((Math.random() * trackGener.length));
          //console.log("Random: "+ random)
          let track = trackGener[random];
          trackGener.splice(random,1);

          //if(!nuevoPlayList.hasTrack(track)){
          nuevoPlayList.addTrackToPlay(track);
         // } 
    } 
    
    // ASIGNACION DE TRACKS SIN RANDOMS 
   /* let i;  
    for (i = 0; i < this.tracks.length; i++) { 
          if(this.tracks[i].genres.includes(genresToInclude)&& nuevoPlayList.duration()<= maxDuration){
            nuevoPlayList.addTrackToPlay(this.tracks[i])
          }
    }*/
    this.playlist.push(nuevoPlayList);
  }

  getArtistByName(name) {
    let artista = this.artistas.find(artista => artista.name === name);

    if(artista === undefined){
      this.artistaNoEncontrado(name);
    }else{
      return artista;
    }  
  }

  getArtistById(id){
      let artista = this.artistas.find(artista => artista.artistId === id);
      return artista; 
  }

  getAlbumByName(name) {
    let albumes = this.getAllAlbunes()
    //console.log(albumes)
    let album;
    album = albumes.find(album => album.name === name);

    if(album === undefined){
      this.albumNoEncontrado(name);
    }else{
      return album;
    }
  }
  
  getTrackByName(name) {
    let pista;
    let tracks = this.getAllTracks();
    pista = tracks.find(pista => pista.name === name);
     if(pista === undefined){
       this.trackNoEncontrado(name);
     }else{
      return pista;
     }
  }

  getPlaylistByName(name) {
    let playlist = this.playlist.find(pl => pl.name === name)
   
    if(playlist === undefined){
      this.playlistNoEncontrado(name);
    }else{
      return playlist
    }
  }

  populateAlbumsForArtist(artisname){
    const fs = require('fs');
    const filename = "./spotifyCreds.json";
    //const accet_token;

    let data = fs.readFileSync(filename) 

    const accet_token = JSON.parse(data).access_token

    const rp = require('request-promise');
    const options = {
    url: 'https://api.spotify.com/v1/search',
    qs:{
      q: artisname,
      type: "artist"
    },
    headers: { Authorization: 'Bearer ' + accet_token },
    json: true,
    };

    rp.get(options, function(err,re,body){
      if(err){console.log("Error" + err.message);
        process.exit(-1)};
      console.log(body)    //El acces token expiro
      let jsonArtist = JSON.parse(body) 
      console.log(jsonArtist) 
      let artist = jsonArtist[0]
      const options2 ={
      url: "https://api.spotify.com/v1/artists/"+artist.id+"/albums",
      headers: { Authorization: 'Bearer ' + accet_token },
      json: true,
    };  

    rp.get(options2, function(error,re,data){
      if(error){console.log("Error" + error.message)
        process.exit(-1)}
      console.log(data)  
      let albunes =  JSON.parse(data)
      let artista  = this.getArtistByName(artisname)
      artista.albumes = artista.albumes.concat(albunes)

    });
    });
  }

  allUndefined(array){
    return array.every(a=> a=== undefined)
  }

  artistaNoEncontrado(name){
    return console.log("El Artista "+"¨"+name+"¨"+" No Existe!");
  }
  
  albumNoEncontrado(name){
    return console.log("El Album "+"¨"+name+"¨"+" No Existe!");
  }

  trackNoEncontrado(name){
    return console.log("El Track "+"¨"+name+"¨"+" No Existe!");
  }

  playlistNoEncontrado(name){
    return console.log("El Playlist "+"¨"+name+"¨"+" No Existe!");
  }
  

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artista, Album, Track, Playlist];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

