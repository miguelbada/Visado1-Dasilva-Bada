const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

let errors = require('./Errors');
let ApiError = errors.APIError;
let NotFound = errors.NotFound;
//let unquiFy = getUNQfy('estado');
const nodemailer = require('nodemailer'); 

function getUNQfy(filename) { 
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      console.log();
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;};



//"nodemailer": "^4.6.7",
class ParIdEmail{
    constructor(id){
        this.idArtist = id;
        this.emailsUsers = [];
    }

    agregarEmail(emailsUser){
        if(!(this.emailsUsers.filter(e => e === emailsUser).length > 0)){ 
        this.emailsUsers.push(emailsUser);
        }
    }

    sacarEmail(emailsUser){
   this.emailsUsers= this.emailsUsers.filter((mailUser) => mailUser != emailsUser)
    }

    setearEmails(listEmail){
        this.emailsUsers = [];
    }

};


class Notificador{
    
    constructor(unq){
        this.unquiFy = unq
        this.mapaDeSuscriptores = [];
    }

    notificarUsuarios(artistId){

    }
    getsEmailsArtistIdFromMap(artist){
       let  parIdEm = this.mapaDeSuscriptores.find(pares=> pares.idArtist === artist.artistId)
       if(parIdEm === undefined){
        parIdEm = new  ParIdEmail(artist.artistId)
        this.mapaDeSuscriptores.push(parIdEm)
       }
       return parIdEm;
    }
    

    getsEmails(artistID){
        let artista= this.unquiFy.getArtistById(artistID)
        if(artista === undefined){
            throw new NotFound();     
        }
        return this.getsEmailsArtistIdFromMap(artista)
    }

    deleteEmails(artistID){
        let artista= this.unquiFy.getArtistById(artistID)
        if(artista === undefined){
            throw new NotFound();     
        }
        this.getsEmailsArtistIdFromMap(artista).setearEmails([]);
    }

    suscribirseAUnArtista(artistID,mailUsuario){
        let artista= this.unquiFy.getArtistById(artistID)
        if(artista=== undefined){
            throw new NotFound();     
        }
        this.getsEmailsArtistIdFromMap(artista).agregarEmail(mailUsuario)
        console.log(this.mapaDeSuscriptores)
        
    }

    desubscribirseAUnArtista(artistID,mailUsuario){
        let artista= this.unquiFy.getArtistById(artistID)
        if(artista=== undefined){
            throw new NotFound();     
        }
        this.getsEmailsArtistIdFromMap(artista).sacarEmail(mailUsuario)
        console.log(this.mapaDeSuscriptores)
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