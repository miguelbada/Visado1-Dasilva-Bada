let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');

let notificadore = require('./Notificador');
let Notificador = notificadore.Notificador;
let errors = require('./Errors');
let ApiError = errors.APIError;
let NotFound = errors.NotFound;

let notificador = new Notificador()


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
    let artBody = req.body
    console.log(artBody)
    try{
        console.log("Entra")
        console.log(notificador)
        notificador.suscribirseAUnArtista(body.artistId)
        console(notificador)
        res.json(); 
    }
    catch(err){
        res.json(err); 
    } 

});
// START THE SERVER
// =============================================================================
app.use(errorHandler);
app.listen(port);
console.log('Magic happens on port ' + port);