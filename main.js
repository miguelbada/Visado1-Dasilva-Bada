

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

function imprimirTracks(tracks){
  tracks.forEach(argument=> console.log("Nombre: " +argument.name+","+ " Albun: "+ argument.albumName+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
}
function llamarMetodo(unqfyst,parametros){
  switch(parametros[0]){
    case "addArtist":
      unqfyst.addArtist({name:parametros[1],country:parametros[2]});
      console.log(unqfyst.artistas);
    //console.log(unqfyst.getArtistByName(parametros[1]));
      break;

    case "addAlbum":
      unqfyst.addAlbum(parametros[1],{name:parametros[2], year:parseInt(parametros[3])});
      console.log(unqfyst.albumes);
      break;

    case "addTrack":
      unqfyst.addTrack(parametros[2],{name:parametros[1], duration:parseInt(parametros[3]), genres:[parametros[4]]});
      console.log(unqfyst.tracks);
      break;

    case "getTracksMatchingGenres":
      let tracks = unqfyst.getTracksMatchingGenres(parametros[1]);
      //tracks.forEach(argument => console.log("Nombre: "+ argument.name +","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
      //console.log(tracks);
      imprimirTracks(tracks)
      break;

    case "getTracksMatchingArtist":
      let tracksAr = unqfyst.getTracksMatchingArtist(parametros[1]);
      //tracksAr.forEach(argument => console.log("Nombre: "+ argument.name +","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
      //console.log(tracksAr);
      imprimirTracks(tracksAr)
      break;
    case "addPlaylist":
      unqfyst.addPlaylist(parametros[1],parametros[2], parseInt(parametros[3])); 
      console.log(unqfyst.playlist);
      break;   
    
    case "getPlaylistByName":
      let playListT = unqfyst.getPlaylistByName(parametros[1]);
      console.log("Playlist Nombre: "+ parametros[1] )
      //playListT.pistas.forEach(argument=> console.log("Nombre: " +argument.name+","+ " Albun: "+ argument.albun+","+ "  Duracion: "+ argument.duration+","+" Genero: "+ argument.genres ));
      imprimirTracks(playListT.pistas)
     //console.log(playListT)
     break;
     
    case "getArtistByName":
      let artistaL = unqfyst.getArtistByName(parametros[1]);
      console.log("Nombre: "+ artistaL.name +","+" Pais: "+ artistaL.country);
      break;

    case "getAlbumByName":
      let artistaL2 = unqfyst.getAlbumByName(parametros[1]);
      console.log("Nombre: "+ artistaL2.name +","+" Artista: "+ artistaL2.artista+","+" Año: "+ artistaL2.year);
      break;

    case "getTrackByName":
      let trackGet = unqfyst.getTrackByName(parametros[1]);
      console.log("Nombre: "+ trackGet.name +","+" Albun: "+ trackGet.albumName+","+" Duracion: "+ trackGet.duration+", "+"Gemero: "+ trackGet.genres);
      break;
  }
}

function main() {
  let unqfy = getUNQfy('estado');
  let parametros = process.argv.slice(2);
  console.log('arguments: ');
  parametros.forEach(argument => console.log(argument));
  llamarMetodo(unqfy,parametros)

  saveUNQfy(unqfy, 'estado');
}

main();


