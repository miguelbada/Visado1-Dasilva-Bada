const rp = require('request-promise');
const urlUnquyRest = "http://localhost:8080/api";
let errors = require('./Errors');
let ServerInternalError = errors.InternalServerError;

class Observable{

    change(artista, album){
        const options = {
            url: urlUnquyRest + "/notify",
            body: {
                artistId: artista.artistId,
                subject: "Nuevo Album para artsta " + artista.name,
                message: "Se ha agregado el album " + album.name + " al artista " + artista.name,
                from: "notificadordeusuario9580@gmail.com",
            },
            json: true,
          };
          rp.post(options).then(() => {
            console.log("Notificaciones enviadas con exitos"); 
          }).catch((error) => {
            if (error) {
              console.log("Error" + error.message);
            throw new ServerInternalError;
            }
          });
    }
}

module.exports = {
    Observable: Observable
  }
    