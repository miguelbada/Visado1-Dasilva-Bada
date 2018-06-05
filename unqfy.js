
const fs = require('fs');
const picklejs = require('picklejs');
const rp = require('request-promise');

let artista = require('./JavaScript/Artista');
let Artista = artista.Artista;

let album = require('./JavaScript/Album');
let Album = album.Album;

let track = require('./JavaScript/Track');
let Track = track.Track;

let playList = require('./JavaScript/Playlist');
let Playlist = playList.Playlist;


class UNQfy {
  constructor() {
    this.artistas = [];
    this.playlist = [];
    this.contadorId = 1;
    //this.contadorIdTrack = 1;
    //this.contadorIdAlbum = 1;
  }

  getAllTracks() {
    let allAlbumes = this.getAllAlbunes();
    let res = [];
    for (var i = 0; i < allAlbumes.length; i++) {
      res = res.concat(allAlbumes[i].pistas);
    }
    return res;
  }

  getAllAlbunes() {
    let res = [];
    for (var i = 0; i < this.artistas.length; i++) {
      res = res.concat(this.artistas[i].albumes);
    }
    return res;
  }

  deleteArtistById(id) {
    let rest = this.artistas.filter((artista) => artista.artistId != id)
    this.artistas = rest;
  }

  deleteAlbumById(id) {
    let album = this.getAlbumById(id);
    console.log(album);
    let artista = album.artista
    artista.deleteAlbum(album.albumID);
  }

  albumRepetido(nameAlbum) {
    let boolean = false;
    boolean = this.getAllAlbunes().some((alb) => alb.name === nameAlbum);
    return boolean;
  };

  artistaRepetido(nameArtis) {
    // Verifica si hay ya un artista con ese mismo nombre 
    let boolean = false;
    boolean = this.artistas.some((art) => art.name === nameArtis)
    return boolean

  }
  searchAlbumByName(name) {
    let allAlbums = this.getAllAlbunes();
    if (allAlbums != []) {
      let res = allAlbums.filter((album) => this.containsName(album.name, name));
      let resJSON = res.map((album) => album.toJSON());
      return resJSON;
    }

    return []
  }
  searchByName(name) {
    // Filtra aquellos artistas cuyo nombre tengan incluido name en su string
    if (this.artistas != []) {
      let res = this.artistas.filter((artista) => this.containsName(artista.name, name))
      let resJSON = res.map((artista) => artista.toJSON())
      return resJSON
    }
    return []
  }

  containsName(nameArtist, stringContains) {
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
    if (artista === undefined) {
      return artista;
    } else {
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
    nuevoArtista.artistId = this.contadorId;
    this.contadorId += 1;
    this.artistas.push(nuevoArtista);
    return nuevoArtista;
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    let artista = this.getArtistByName(artistName)
    if (artista === undefined) {
      this.artistaNoEncontrado(artistName);
    } else {
      let nuevoAlbun = new Album(artista, params.name, params.year);
      nuevoAlbun.albumID = this.contadorId
      this.contadorId += 1
      artista.albumes.push(nuevoAlbun);
      return nuevoAlbun
    }
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (strings)
  */
  addTrack(albumName, params) {
    let album = this.getAlbumByName(albumName)
    if (album === undefined) {
      this.albumNoEncontrado(albumName);
    } else {
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
    while (nuevoPlayList.duration() < maxDuration && trackGener.length != 0) {
      let random = Math.floor((Math.random() * trackGener.length));
      //console.log("Random: "+ random)
      let track = trackGener[random];
      trackGener.splice(random, 1);

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

    if (artista === undefined) {
      this.artistaNoEncontrado(name);
    } else {
      return artista;
    }
  }

  getArtistById(id) {
    let artista = this.artistas.find(artista => artista.artistId === id);
    return artista;
  }

  getAlbumById(id) {
    let albumes = this.getAllAlbunes();
    let album = albumes.find(album => album.albumID === id);
    return album;
  }

  getAlbumByName(name) {
    let albumes = this.getAllAlbunes()
    let album;
    album = albumes.find(album => album.name === name);

    if (album === undefined) {
      this.albumNoEncontrado(name);
    } else {
      console.log(album);
      return album;
    }
  }

  getTrackByName(name) {
    let pista;
    let tracks = this.getAllTracks();
    pista = tracks.find(pista => pista.name === name);
    if (pista === undefined) {
      this.trackNoEncontrado(name);
    } else {
      return pista;
    }
  }

  getPlaylistByName(name) {
    let playlist = this.playlist.find(pl => pl.name === name)

    if (playlist === undefined) {
      this.playlistNoEncontrado(name);
    } else {
      return playlist
    }
  }

  // Api Key Miguel: e526a0cccce03e69d29dac02c599fd49
  getLyrics(nombreTrack) {
    const key = '44e25018083ffd40c281dad1e7c2128d';
    let track = this.getTrackByName(nombreTrack);
    if (track.lyrics === null) {
      const option = {
        url: 'http://api.musixmatch.com/ws/1.1/track.search',
        qs: {
          q_track: track.name,
          apikey: key
        },
        json: true,
      };
      rp.get(option)
        .then((allTracks) => {
          let tracks = allTracks.message.body.track_list;
          let track = tracks[0].track;
          console.log(track.track_id);

          return track.track_id;
        })
        .then((pistaId) => {
          const option2 = {
            url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
            qs: {
              track_id: pistaId,
              apikey: key
            },
            json: true,
          };
          
          const lyrics = rp.get(option2);
          console.log(lyrics);
          return lyrics;
        })
        .then((data) => {
          //console.log(data)
          // console.log("ERROR"+ error.message)
          // process.exit(-1)
          let trackLyrics = data;
          //console.log(trackLyrics);
          track.lyrics = trackLyrics;
          this.save(this, 'estado');
          return track.lyrics;
        })
        .catch((error) => {
          if (error) {
            //Sconsole.log("Error" + error.message)
            process.exit(-1)
          }
        });
    } else {
      return track.lyrics;
    }
  };

  populateAlbumsForArtist(artisname) {
    const options = {
      url: 'https://api.spotify.com/v1/search',
      qs: {
        q: artisname,
        type: "artist",
        limit: 1
      },
      headers: { Authorization: 'Bearer ' + this.accessToken() },
      json: true,
    };

    let albumes = rp.get(options)
      .then((artistas) => {
        console.log("Albumes del artista " + artistas.artists.items[0].name);    //El acces token expiro
        return artistas.artists.items[0];
      })
      .then((artista) => {
        const options2 = {
          url: "https://api.spotify.com/v1/artists/" + artista.id + "/albums",
          headers: { Authorization: 'Bearer ' + this.accessToken() },
          json: true,
        }

        return rp.get(options2);
      })
      .then((albums) => {
        console.log("La cantidad de albumes es: " + albums.items.length);
        console.log();
        this.printAlbumSpotyfy(albums);
        let albumes = albums.items;
        let artista = this.getArtistByName(artisname);
        console.log(artista);

        let albumsConc = this.mkReduceAlbumL(artista, albums.items);
        
        //let albumsConc = [];
        //albumsConc.push(this.mkReduceAlbum(artista, albums.items[0]));
        //albumsConc.push(this.mkReduceAlbum(artista, albums.items[1]));

        //let listaAlbum = albumes.map((album) => {
         // this.mkReduceAlbum(artista, album);
        //});
        console.log(albumsConc);
        artista.albumes = artista.albumes.concat(albumsConc);

        console.log("luego de la concatenacion el largo es: " + artista.albumes.length);
      })
      .then(() => {
        let filename = 'unqfy.json';
        this.save(filename);
      })
      .catch((error) => {
        if (error) {
          console.log("Error" + error.message);
          process.exit(-1)
        }
      });

    return albumes;
  }

  //allUndefined(array) {
  //  return array.every(a => a === undefined)
  //}

  mkReduceAlbumL(artista, albumsSpoty){
    album = [];
    for(var i=0; i<albumsSpoty.length; i++){
      album.push(this.mkReduceAlbum(artista, albumsSpoty[i]));
    }

    return album;
  }
  
  mkReduceAlbum(artista, fullAlbum) {
    let album = new Album(artista, fullAlbum.name, parseInt(fullAlbum.release_date))
    album.albumID = this.contadorId;
    this.contadorId += 1;

    return album;
  }

  printAlbumSpotyfy(listAlbum){
    for(var i=0; i<listAlbum.items.length; i++){
      console.log("Artista del Album: " + listAlbum.items[i].artists[0].name);
      console.log("Nombre del Album: " + listAlbum.items[i].name);
      console.log("Año del Album: " + listAlbum.items[i].release_date);
      console.log();
    }
  }

  artistaNoEncontrado(name) {
    return console.log("El Artista " + "¨" + name + "¨" + " No Existe!");
  }

  albumNoEncontrado(name) {
    return console.log("El Album " + "¨" + name + "¨" + " No Existe!");
  }

  trackNoEncontrado(name) {
    return console.log("El Track " + "¨" + name + "¨" + " No Existe!");
  }

  playlistNoEncontrado(name) {
    return console.log("El Playlist " + "¨" + name + "¨" + " No Existe!");
  }

  accessToken() {
    const filename = "./spotifyCreds.json";
    //const accet_token;
    let data = fs.readFileSync(filename);
    const accessToken = JSON.parse(data).access_token;

    return accessToken;
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

