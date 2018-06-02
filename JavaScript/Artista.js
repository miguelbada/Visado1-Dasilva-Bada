class Artista {
  constructor(nombre, pais) {
    this.name = nombre;
    this.country = pais;
    this.albumes = [];
    this.artistId = null;
  }

  toJSON(){
    let albunesJSON = []
    if(this.albumes != []){
      albunesJSON = this.albumes.map((albun)=> albun.toJSON())
    }
    let res = {
      id: this.artistId,
      name: this.name,
      albums: albunesJSON,
      country: this.country,
    }
    return res
  }

  deleteAlbum(idAlbum){
    let res = this.albumes.filter(album => album.albumID != idAlbum);
    console.log(idAlbum)
    console.log(res)
    this.albumes = res;
  }

}



module.exports = {
  Artista: Artista
}
