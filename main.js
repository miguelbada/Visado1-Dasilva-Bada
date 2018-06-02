

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

function imprimirTracks(tracks) {
  tracks.forEach(argument => console.log("Nombre: " + argument.name + "," + " Albun: " + argument.albumName + "," + "  Duracion: " + argument.duration + "," + " Genero: " + argument.genres));
}

var asincronico = false;

function llamarMetodo(unqfyst, parametros) {
  switch (parametros[0]) {
    case "addArtist":
      unqfyst.addArtist({ name: parametros[1], country: parametros[2] });
      //console.log(unqfyst.artistas);
      console.log(unqfyst.getArtistByName(parametros[1]));
      break;

    case "addAlbum":
      let artista = unqfyst.getArtistByName(parametros[1]);

      if (artista === undefined) {
        return artista;
      } else {
        unqfyst.addAlbum(parametros[1], { name: parametros[2], year: parseInt(parametros[3]) });
        let album = unqfyst.getAlbumByName(parametros[2]);
        console.log(album);
      }
      break;

    case "addTrack":
      let album = unqfyst.getAlbumByName(parametros[2])

      if (album === undefined) {
        return album;
      } else {
        console.log("NOMBRE ALBUM:" + parametros[2]);
        unqfyst.addTrack(parametros[2], { name: parametros[1], duration: parseInt(parametros[3]), genres: parametros[4] });
        console.log(album);
      }
      break;

    case "getTracksMatchingGenres":
      let generos = parametros.slice(1);
      console.log(generos)
      let tracks = unqfyst.getTracksMatchingGenres(generos);
      //tracks.forEach(argument => console.log("Nombre: "+ argument.name +","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
      //console.log(tracks);
      imprimirTracks(tracks)
      break;

    case "getTracksMatchingArtist":
      let tracksAr = unqfyst.getTracksMatchingArtist(parametros[1]);
      if (tracksAr === undefined) {
        return tracksAr;
      } else {
        //tracksAr.forEach(argument => console.log("Nombre: "+ argument.name +","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
        //console.log(tracksAr);
        imprimirTracks(tracksAr)
      }
      break;

    case "addPlaylist":
      let generos2 = parametros.slice(3);
      console.log(generos2)
      unqfyst.addPlaylist(parametros[1], generos2, parseInt(parametros[2]));
      console.log(unqfyst.playlist);
      break;

    case "getPlaylistByName":
      let playListT = unqfyst.getPlaylistByName(parametros[1]);

      if (playListT === undefined) {
        return playListT;
      } else {
        console.log("Playlist Nombre: " + parametros[1])
        //playListT.pistas.forEach(argument=> console.log("Nombre: " +argument.name+","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
        imprimirTracks(playListT.pistas)
        //console.log(playListT)
      }
      break;

    case "getArtistByName":
      let artistaL = unqfyst.getArtistByName(parametros[1]);

      if (artistaL === undefined) {
        return artistaL;
      } else {
        console.log("Nombre: " + artistaL.name + "," + " Pais: " + artistaL.country);
      }
      break;

    case "getAlbumByName":
      let artistaL2 = unqfyst.getAlbumByName(parametros[1]);

      if (artistaL2 === undefined) {
        return artistaL2;
      } else {
        console.log("Nombre: " + artistaL2.name + "," + " Artista: " + artistaL2.artista.name + "," + " Año: " + artistaL2.year);
      }
      break;
    case "populateAlbumsForArtist":
      let artistname = parametros[1]
      unqfyst.populateAlbumsForArtist(artistname).then(() => {
        // console.log(unqfyst.artistas);
        saveUNQfy(unqfyst, 'estado')
      });
      console.log(unqfyst.artistas);
      asincronico = true;
      //saveUNQfy(unqfyst, 'estado');
      break;
    case "getLyrics":
      let nombreTrack = parametros[1]
      let l = unqfyst.getLyrics(nombreTrack);
      console.log(l);
      asincronico = true;
      saveUNQfy(unqfyst, 'estado');
      break;

    case "getTrackByName":
      let trackGet = unqfyst.getTrackByName(parametros[1]);

      if (trackGet === undefined) {
        return trackGet;
      } else {
        console.log("Nombre: " + trackGet.name + "," + " Album: " + trackGet.albumName + "," + " Duracion: " + trackGet.duration + ", " + "Genero: " + trackGet.genres);
      }
      break;
      
    case "getTotalAlbumes":
      let albumesGet = unqfyst.getAllAlbunes();
      console.log("Total de albumes: " + albumesGet.length);
      break;

    default:
      console.log("¨" + parametros[0] + "¨" + " no es un comando valido!");
      break;
  }
}

function main() {
  let unqfy = getUNQfy('estado');
  let parametros = process.argv.slice(2);
  console.log('arguments: ');
  parametros.forEach(argument => console.log(argument));
  llamarMetodo(unqfy, parametros);
  if (asincronico) {
    asincronico = false
  } else { saveUNQfy(unqfy, 'estado'); }
  //saveUNQfy(unqfy, 'estado');
}

main();


