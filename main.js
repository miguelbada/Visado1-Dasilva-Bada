

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
function llamarMetodo(unqfyst,parametros){
  switch(parametros[0]){
    case "addArtist":
      console.log(parametros)
     unqfyst.addArtist(parametros[1],parametros[2]);
    console.log(unqfyst.artistas);
    console.log(unqfyst.getArtistByName(parametros[1]));
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


