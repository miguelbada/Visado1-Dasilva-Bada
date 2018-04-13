
const picklejs = require('picklejs');

class Artista {
  constructor(nombre, pais) {
    this.name = nombre;
    this.country = pais;
  }
}

class Album {
  constructor(_artista, nombre, _year) {
    this.name = nombre;
    this.artista = _artista;
    this.pistas = [];
    this.year = _year
   }
}

class Track {
  constructor(nombreAlbun,nombre, duracion, genero) {
    this.albun = nombreAlbun;
    this.name = nombre;
    this.duration = duracion;
    this.genres = genero;
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
    this.albunes = [];
    this.tracks = [];
    this.playlist = [];
  }
  
  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    let tracksPL = this.tracks.filter(tr => tr.genres.includes(genres))
    return tracksPL

  }

  getTracksMatchingArtist(artistName) {
    let tracksAr = this.tracks.filter(tr => this.getAlbumByName(tr.albun).artista === artistName)
    return tracksAr

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
      console.log("El artista "+ "¨"+artistName +"¨"+ " No Existe")
    }else{
          let nuevoAlbun = new Album(artistName, params.name, params.year)
          this.albunes.push(nuevoAlbun)
          
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
          this.tracks.push(nuevoTrack)
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
    let album = this.albunes.find(albun => albun.name === name)
    return album

  }

  getTrackByName(name) {
    let track = this.tracks.find(tr => tr.name === name)
    return track

  }

  getPlaylistByName(name) {
    let playlist = this.playlist.find(pl => pl.name === name)
    return playlist

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
    while(nuevoPlayList.duration()< maxDuration){
          let random = Math.floor((Math.random() * trackGener.length))
          //console.log("Random: "+ random)
          let track = trackGener[random]

          if(!nuevoPlayList.hasTrack(track)){
            nuevoPlayList.addTrackToPlay(track)
          } 
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

