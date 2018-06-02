class Track {
    constructor(nombreAlbum, nombre, duracion, genero) {
      this.albumName = nombreAlbum;
      this.name = nombre;
      this.duration = duracion;
      this.genres = genero;
      this.lyrics = null;
    }
     
    incluyeGenero(generos){
      return generos.includes(this.genres);
    }
  }

module.exports = {
    Track: Track
}