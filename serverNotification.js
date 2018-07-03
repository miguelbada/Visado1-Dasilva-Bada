let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');
const fs = require('fs');

let notificadore = require('./Notificador');
let unqmod = require('./unqfy');
let unquiFy = getUNQfy('estado');

function getUNQfy(filename) { 
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      console.log();
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;};

let notificador = new notificadore.Notificador(unquiFy)
let errors = require('./Errors');
let ApiError = errors.APIError;
let NotFound = errors.NotFound;




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola 
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if(err instanceof ApiError  ){
        res.status(err.status); 
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        // body-parser error para JSON invalido   
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'}); }
         else {
             // continua con el manejador de errores por defecto
             res.status(err.status)
             res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})   
             next(err); 
            } 
        }

let port = process.env.PORT || 8080; 

let router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api', router);
app.use((req,res,next)=>{
    throw new NotFound();
});

router.post('/subscribe',function (req, res,next){
    let artBody = req.body;
    console.log(artBody);
    //try{ 
    notificador.suscribirseAUnArtista(artBody.artistId, artBody.email);
    //console(notificador.mapaDeSuscriptores);
    res.json(); 
    //}
    //catch(err){
    //    console.log(err)
    //    err;
    //}
});

router.post('/unsubscribe',function (req, res,next){
    let artBody = req.body;
    console.log(artBody);
    notificador.desubscribirseAUnArtista(artBody.artistId, artBody.email);
    res.json();
});

router.post('/notify',function (req, res,next){
    let body = req.body;
    console.log(body);
    notificador.notificarUsuarios(body);
    res.json();
});

router.get('/subscriptions/:artistId',function (req, res) {
        let artId = parseInt(req.params.artistId);
        console.log(artId)
        let parIdEm = notificador.getsEmails(artId)
        res.json({
            "artistId": parIdEm.idArtist,
            "emails": parIdEm.emailsUsers
        });
        });
router.delete('/subscriptions/:artistId',function (req, res) { 
    let artId = parseInt(req.params.artistId);
    console.log(artId)
    notificador.deleteEmails(artId);
    res.json();
});

// START THE SERVER
// =============================================================================
app.use(errorHandler);
app.listen(port);
console.log('Magic happens on port ' + port);