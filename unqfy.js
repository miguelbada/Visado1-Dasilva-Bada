
const picklejs = require('picklejs');

class Artista {
  constructor(nombre, pais) {
    this.name = nombre;
    this.country = pais;
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
}

class Playlist{
  constructor(){
    this.pistas = [];
  }
}


class UNQfy {
  constructor(){
    this.artistas = [];
    this.albumes = [];
    this.tracks = [];
    this.playlist = [];
  }
  
  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres

  }

  getTracksMatchingArtist(artistName) {

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
    let nuevoAlbun = new Album(artistName, params.year, params.name);
    this.albumes.push(nuevoAlbun);
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
    let nuevoTrack = new Track(albumName, params.name, params.duration, params.genres);
    this.tracks.push(nuevoTrack);
  }

  getArtistByName(name) {
    let artista = this.artistas.find(artista => artista.name === name);

    return artista;
  }

  getAlbumByName(name) {
    let album = this.albumes.find(album => album.name === name);

    return album;
  }

  getTrackByName(name) {
    let pista = this.tracks.find(pista => pista.name === name);

    return pista;
  }

  getPlaylistByName(name) {

  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

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

