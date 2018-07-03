const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');
const rp = require('request-promise');
let errors = require('./Errors');
let NotFound = errors.NotFound;
const urlUnquyRest = "http://localhost:5000/api";
//let unquiFy = getUNQfy('estado');
let ServerInternalError = errors.InternalServerError;
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com', // server para enviar mail desde gmail
port: 587,
secure: false, // true for 465, false for other ports
auth: {
user: 'notificadordeusuario9580@gmail.com',
pass: 'clave9580',
},
});


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

    notificarUsuarios(param){
        let artista = this.verificarSiExisteArtista(param.artistId);
        let emails = this.getsEmailsArtistIdFromMap(artista).emailsUsers;
        
        for (var i = 0; i <emails.length; i++) {
            const mailOptions = {
                from: param.from, // sender address
                to: emails[i], // list of receivers
                subject: param.subject, // Subject lin
                text: param.message, // plain text body
                html: '<b>Hello world?</b>' // html body
                };
                transporter.sendMail(mailOptions).then(() => {console.log("Emails enviados");})
                .catch((error) => {
                    if (error) {
                      console.log("Error" + error.message);
                    throw new ServerInternalError;
                    }
                  });; 
        } 
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

    verificarSiExisteArtista(artistId){
        const options = {
            url: urlUnquyRest + "/artists/:id",
            qs: {
                id: artistId,
               
            },
            json: true,
          };
          return rp.get(options).catch((error) => {
            if (error) {
              console.log("Error" + error.message);
            throw new NotFound;
            }
          });; 
    }
    
};

module.exports = {
    Notificador: Notificador
  }