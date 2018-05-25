class Track {
    constructor(nombreAlbum, nombre, duracion, genero) {
      this.albumName = nombreAlbum;
      this.name = nombre;
      this.duration = duracion;
      this.genres = genero;
      this.lyrics = null;
    }
    
    getLyrics(){
      if(this.lyrics === null){
        const rp = require('request-promise');
        const option ={
          url: 'http://api.musixmatch.com/ws/1.1/track.search',
          qs:{
            q_track = this.name
          },
          headers: { Authorization: '44e25018083ffd40c281dad1e7c2128d' },
          json: true,
        }
        rp.get(option, function(err,re,body){
          if(err){console.log("ERROR: "+ err.message)
            process.exit(-1)}

          let tracks = JSON.parse(body)
          let track = tracks[0]
          const option2 ={
            url: 'http://tracking.musixmatch.com/t1.0/'+ track.track_id,
            headers: { Authorization: '44e25018083ffd40c281dad1e7c2128d' },
            json: true,
          }
          
          rp.get(option2,function(error,ree,data){
            if(error){
              console.log("ERROR"+ error.message)
              process.exit(-1)
            }
            let trackLytics = JSON.parse(data).lyrics_body
            this.lyrics = trackLytics

          })
        }) 
      }
      return this.lyrics
    }
    incluyeGenero(generos){
      return generos.includes(this.genres);
    }
  }

module.exports = {
    Track: Track
}