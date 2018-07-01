const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

let errors = require('./Errors');
let ApiError = errors.APIError;
let NotFound = errors.NotFound;
let unquiFy = getUNQfy('estado');

function getUNQfy(filename) { 
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      console.log();
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;};




class ParIdEmail{
    constructor(id){
        this.idArtist = id;
        this.emailsUsers = [];
    }

    agregarEmail(emailsUser){
    this.emailsUsers.push(emailsUser);
    }

    sacarEmail(emailsUser){
   this.emailsUsers= this.emailsUsers.filter((mailUser) => mailUser != emailsUser)
    }

};


class Notificador{
    
    constructor(){
        this.mapaDeSuscriptores = [];
    }

    getsEmailsArtistIdFromMap(artist){
       // [""+ artista.artistId]
       let  parIdEm = this.mapaDeSuscriptores.find(pares=> pares.idArtist === artist.artistId)
       if(parIdEm === undefined){
        parIdEm = new  ParIdEmail(artist.artistId)
       }
       return parIdEm;
    }
  
    suscribirseAUnArtista(artistName,mailUsuario){
        let artista= this.unquiFy.getArtistByName(artistName)
        if(artista=== undefined){
            throw new NotFound();     
        }
        this.getsEmailsArtistIdFromMap(artista).agregarEmail(mailUsuario)
        
    }

    desubscribirseAUnArtista(artistname,mailUsuario){
        let artista= this.unquiFy.getArtistByName(artistName)
        if(artista=== undefined){
            throw new NotFound();     
        }
        this.getsEmailsArtistIdFromMap(artista).sacarEmail(mailUsuario)
    }

    eliminarArtistSuscribe(artista){
        let artista= this.unquiFy.getArtistByName(artistName)
        if(artista=== undefined){
            throw new NotFound();     
        }
        this.mapaDeSuscriptores= this.mapaDeSuscriptores.filter((pares) => pares.idArtist != artista.artistId)

    }
    
};

module.exports = {
    Notificador: Notificador
  }