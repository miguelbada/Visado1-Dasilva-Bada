class Album {
    constructor(_artista, nombre, _year) {
      this.artista = _artista;
      this.name = nombre;
      this.year = _year;
      this.pistas = [];
      this.albumID = null;
     }

  toJSON(){
      let res = {
          id: this.albumID,
          name: this.name,
          year: this.year,
          tracks: this.pistas 
      }
      return res
  }
}
module.exports = {
    Album: Album
}