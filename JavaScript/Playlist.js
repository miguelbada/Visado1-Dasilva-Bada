class Playlist{
    constructor(_name){
      this.name = _name;
      this.pistas = [];
    }
  
    duration(){
      let res = 0;
      this.pistas.forEach(tr=> res+= tr.duration);
      return res;
    }
  
    hasTrack(aTrack){
      let res = this.pistas.some(tr=> tr.name === aTrack.name);
      return res;
    }
  
    addTrackToPlay(aTrack){
      this.pistas.push(aTrack)
    }
  }




module.exports = {
    Playlist: Playlist
}