let artista = require('./JavaScript/Artista');
let Artista = artista.Artista;

let album = require('./JavaScript/Album');
let Album = album.Album;

let track = require('./JavaScript/Track');
let Track = track.Track;

let playList = require('./JavaScript/Playlist');
let Playlist = playList.Playlist;

let errors = require('./Errors');
let ApiError = errors.APIError
let AlreadyExistsError = errors.AlreadyExistsError;
let InvalidInputError = errors.InvalidInputError;
let InvalidURL = errors.InvalidURL;
let ArtistNotFound = errors.ArtistNotFound;
let NotFound = errors.NotFound;

const fs = require('fs');
let unqmod = require('./unqfy');
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
let unquiFy = getUNQfy('estado');


let express = require('express');        // call express
let app = express();                 // define our app using express
let router = express.Router();
let bodyParser = require('body-parser');

let port = process.env.PORT || 5000;        // set our port


router.use(function (req, res, next) {
    // do logging
    console.log('Request received!');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api UNQUIFY!' });
});

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

app.use('/api', router);
app.use((req,res,next)=>{
    throw new NotFound();
});

router.get('/artists/:id',function (req, res) { 
      console.log("Parametros"+req.params.id);
      let ids =  parseInt(req.params.id) 
      console.log(ids);
      let artista = unquiFy.getArtistById(ids)
      if(artista === undefined){
        throw new NotFound();
        process.exit(-1);
      }
      let JsonArtist = artista.toJSON();
      res.json(JsonArtist);
    })
router.delete('/artists/:id',function (req, res) { 
    //  console.log(req);
      let ids =  parseInt(req.params.id) 
      console.log(ids);
      let artista = unquiFy.getArtistById(ids)  
      if(artista === undefined){
        throw new NotFound();
        process.exit(-1);
      }
      unquiFy.deleteArtistById(ids)
      saveUNQfy(unquiFy, 'estado');
      res.json();
    })    

router.route('/artists')
    .get(function (req, res) {
        //  console.log(req);
        console.log(req.query);
        //res.json({ message: req.query });
        if (req.query.name) {
            let search = unquiFy.searchByName(req.query.name);
            let prueba = unquiFy.containsName("Charly garcia", "cHARly")
            console.log(prueba)
            res.json(search);
        }
        else {
            let resArt = unquiFy.artistas.map((artista) => artista.toJSON());
            res.json(resArt);
        }
    })
    // create a track (accessed at POST http://localhost:8080/api/artists)
    .post(function (req, res, next) {
        let artBody = req.body
        if(!(artBody.name && artBody.country)){
            throw new InvalidInputError();
            process.exit(-1);
        }
        if(unquiFy.artistaRepetido(artBody.name)){
             throw new AlreadyExistsError();
        }else{ 

            let art = new Artista(artBody.name, artBody.country)
            let artistId = unquiFy.addArtist(art)
            console.log(req.body.name);
            saveUNQfy(unquiFy, 'estado');
            let artistJSON = artistId.toJSON();
            res.json(artistJSON);
        }
    })

router.delete('/albums/:id',function (req, res){
    let ids = parseInt(req.params.id)
    let album = unquiFy.getAlbumById(ids);
    if(album === undefined){
        throw new NotFound();
        process.exit(-1);
      }
    unquiFy.deleteAlbumById(ids)
    saveUNQfy(unquiFy, 'estado');
    res.json();  
});    
router.get('/albums/:id',function (req, res){
    let ids =  parseInt(req.params.id) 
    console.log(ids);
    let album = unquiFy.getAlbumById(ids);
    if(album === undefined){
        throw new NotFound();
        process.exit(-1);
      }
      let JsonAlbum = album.toJSON()
      res.json(JsonAlbum);
});    
router.route('/albums')
    .get(function (req, res){
        console.log(req.query);
        if (req.query.name){
            let searchAlbu = unquiFy.searchAlbumByName(req.query.name);
            res.json(searchAlbu);
        }
        else{
             let resAl = unquiFy.getAllAlbunes().map((album)=> album.toJSON());
             res.json(resAl)
        }
    })
    .post(function (req, res,next){
        let albumBody = req.body;
        if(!(albumBody.artistId && albumBody.name && albumBody.year)){
            throw new InvalidInputError();
            process.exit(-1);
        }
        let artista = unquiFy.getArtistById(albumBody.artistId);
        if(artista === undefined ){
            throw new ArtistNotFound()
            process.exit(-1)
        };

        if(unquiFy.albumRepetido(albumBody.name)){
            /*let error = new AlreadyExistsError()
            res.json({ status: error.status,
                errorCode: error.errorCode
             })*/
             throw new AlreadyExistsError();
             process.exit(-1);
            };

        //let albu = new Album(artista,albumBody.name, albumBody.year)
        let albumId = unquiFy.addAlbum(artista.name,albumBody);
        console.log(albumId);
        saveUNQfy(unquiFy, 'estado');
        let albumJSON = albumId.toJSON();
        res.json(albumJSON);

    });    
    
app.use(errorHandler);
app.listen(port);
console.log('Magic happens on port ' + port);    