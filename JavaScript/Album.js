class Album {
    constructor(_artista, nombre, _year) {
      this.artista = _artista;
      this.name = nombre;
      this.year = _year;
      this.pistas = [];
     }
  }

module.exports = {
    Album: Album
}