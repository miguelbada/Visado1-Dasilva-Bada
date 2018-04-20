
const picklejs = require('picklejs');

class Artista {
  constructor(nombre, pais) {
    this.name = nombre;
    this.country = pais;
    this.albumes = [];
  }
}

class Album {
  constructor(_artista, nombre, _year) {
    this.artista = _artista;
    this.name = nombre;
    this.year = _year;
    this.pistas = [];
   }
}

class Track {
  constructor(nombreAlbum, nombre, duracion, genero) {
    this.albumName = nombreAlbum;
    this.name = nombre;
    this.duration = duracion;
    this.genres = genero
  }
  incluyeGenero(generos){
    return generos.includes(this.genres);
  }
}

class Playlist{
  constructor(_name){
    this.name = _name;
    this.pistas = [];
  }

  duration(){
    let res = 0;
    this.pistas.forEach(tr=> res+= tr.duration);
    return res;
  }

  hasTrack(aTrack){
    let res = this.pistas.some(tr=> tr.name === aTrack.name);
    return res;
  }

  addTrackToPlay(aTrack){
    this.pistas.push(aTrack)
  }
}


class UNQfy {
  constructor(){
    this.artistas = [];
    this.playlist = [];
  }
  
  getAllTracks(){
    let res = [];
    for (var i = 0; i < this.artistas.length; i++) {
      for (var n = 0; n < this.artistas[i].albumes.length; n++) { 
       res = res.concat(this.artistas[i].albumes[n].pistas);
      }
     }
     return res;
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    let tracks = this.getAllTracks(); 
    let tracksPL = tracks.filter(tr => tr.incluyeGenero(genres));
    return tracksPL
  }

  getTracksMatchingArtist(artistName) {
    let artista = this.getArtistByName(artistName);
    let res = [];
    for (var i = 0; i < artista.albumes.length; i++) {
      res = res.concat(artista.albumes[i].pistas);
    } 
    //let tracksAr = this.tracks.filter(tr => this.getAlbumByName(tr.albumName).artista === artistName)
    return res;
  }


  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
  // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    let nuevoArtista = new Artista(params.name, params.country);
    this.artistas.push(nuevoArtista);
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    let artista = this.getArtistByName(artistName)
    if(artista === undefined){
      console.log("El Artista "+ "¨"+artistName +"¨"+ " No Existe")
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
      console.log("El Album "+ "¨"+albumName +"¨"+ " No Existe")
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

  getArtistByName(name) {
    let artista = this.artistas.find(artista => artista.name === name);
      return artista;
  }

  getAlbumByName(name) {
    let album;
    //let artista1 = this.artistas[0]
    //console.log(artista.albumes)
    //let album2 = artista1.albumes[0]
    //let namealbum2 = album2.name
    //console.log("NOMBREEE:" + name)
    //console.log("ALBUM2"+album2)
    //console.log("ALBUM2 Name:"+namealbum2)
    //let album = this.artistas.foreach(artista => artista.albumes.find(album => album.name === name));
    for (var i = 0; i < this.artistas.length; i++) {
      let artista = this.artistas[i]
      let albumes = artista.albumes
      //console.log(artista.albumes)
      //let album1 = artista.albumes[0]
      //album = album1
     // console.log("ALBUM1"+album1)
     //console.log(album)
     if(albumes.length !== 0){
      album = albumes.find(album => album.name === name);
      /*for (var n = 0; n < albumes.length; n++) {
          let albumN = albumes[n]
          if (albumN.name === name){
            return albumN
          }*/
     }
     //console.log("DALEEEE"+ album)
  }
  return album;
  }
  
  getTrackByName(name) {
    let pista;
    //let pista = this.tracks.find(pista => pista.name === name);
    for (var i = 0; i < this.artistas.length; i++) {
     for (var n = 0; n < this.artistas[i].albumes.length; n++) { 
      pista = this.artistas[i].albumes[n].pistas.find(pista => pista.name === name);
      
     }
    }
     //Do something
     //Do something
    return pista;
  }

  getPlaylistByName(name) {
    let playlist = this.playlist.find(pl => pl.name === name)
    return playlist

  }

  allUndefined(array){
    return array.every(a=> a=== undefined)
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
    let nuevoPlayList = new Playlist(name)
    let trackGener = this.getTracksMatchingGenres(genresToInclude)
    while(nuevoPlayList.duration()< maxDuration && trackGener.length != 0){
          let random = Math.floor((Math.random() * trackGener.length))
          //console.log("Random: "+ random)
          let track = trackGener[random]
          trackGener.splice(random,1)

          //if(!nuevoPlayList.hasTrack(track)){
          nuevoPlayList.addTrackToPlay(track)
         // } 
    } 
    
    // ASIGNACION DE TRACKS SIN RANDOMS 
   /* let i;  
    for (i = 0; i < this.tracks.length; i++) { 
          if(this.tracks[i].genres.includes(genresToInclude)&& nuevoPlayList.duration()<= maxDuration){
            nuevoPlayList.addTrackToPlay(this.tracks[i])
          }
    }*/
    this.playlist.push(nuevoPlayList)
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

