const fs = require('fs'); // necesitado para guardar/cargar unqfy
const rp = require('request-promise');
let errors = require('./Errors');
let ArtistNotFound = errors.ArtistNotFound;
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
    pass: 'clave9580'
},
tls: {
    rejectUnauthorized: false
}
});



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

    transformarEnStringLosMails(){
        let res = "";
        let email = null;
        for (var i = 0; i < this.emailsUsers.length; i++) {
            email =  this.emailsUsers[i]+ ", "
            res = res + email
        }
        return res
    }

};


class Notificador{
    
    constructor(){
        this.mapaDeSuscriptores = [];
    }

    
    
    notificarUsuarios(param){
        /*let artista =*/ 
        return this.verificarSiExisteArtista(param.artistId).then((artista)=> {
       // console.log(artista)
            let emails = this.getsEmailsArtistIdFromMap(param.artistId);
            let strEmails = emails.transformarEnStringLosMails();
            console.log(strEmails)
        
           // for (var i = 0; i <emails.length; i++) {
            const mailOptions = {
                from: param.from, // sender address
                to: strEmails, // list of receivers
                subject: param.subject, // Subject lin
                text: param.message, // plain text body
                html: '<b>'+param.message+'</b>' // html body
                };
           return  transporter.sendMail(mailOptions).then(() => {console.log("Emails enviados");})
                .catch((error) => {
                    if (error) {
                    console.log("Error" + error.message);
                    console.log(error)
                    throw new ServerInternalError;
                    }
                });; 
            //}
            
        }); 
    }
    getsEmailsArtistIdFromMap(artistid){
       let  parIdEm = this.mapaDeSuscriptores.find(pares=> pares.idArtist === artistid/*artist.id*/)
       if(parIdEm === undefined){
        parIdEm = new  ParIdEmail(artistid/*artist.id*/)
        this.mapaDeSuscriptores.push(parIdEm)
       }
       return parIdEm;
    }
    

    getsEmails(artistID){
 
        return  this.verificarSiExisteArtista(artistID)
        .then((artista)=> {
            return this.getsEmailsArtistIdFromMap(artistID)
            });
    }

    deleteEmails(artistID){
        return  this.verificarSiExisteArtista(artistID).then((artista)=> {
        this.getsEmailsArtistIdFromMap(artistID).setearEmails([]);
        return true});
    }

    suscribirseAUnArtista(artistID,mailUsuario){
        return  this.verificarSiExisteArtista(artistID).then((artista)=> {
        this.getsEmailsArtistIdFromMap(artistID).agregarEmail(mailUsuario)
        console.log(this.mapaDeSuscriptores)
        return true});
    }

    desubscribirseAUnArtista(artistID,mailUsuario){
        return  this.verificarSiExisteArtista(artistID)
            .then((artista)=> {
                this.getsEmailsArtistIdFromMap(artistID).sacarEmail(mailUsuario)
                console.log(this.mapaDeSuscriptores)
                return true
            });
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
            url: urlUnquyRest + "/artists/"+artistId,
            json: true,
          };
          return rp.get(options).then((artist)=>{
            return artist
          })
          .catch((error) => {
            if (error) {
              console.log("Error " + error.message);
              //error
              throw new ArtistNotFound();
            }
          }); 
    }
    
};

module.exports = {
    Notificador: Notificador
  }