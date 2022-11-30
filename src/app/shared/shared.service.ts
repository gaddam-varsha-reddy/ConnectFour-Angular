import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
   public playerNames:string[];
   public gameType:string;
   public playerType:string[];
   
  constructor() {
    this.playerNames=['','',''];
    this.gameType="none";
    this.playerType=['','manual','manual']
   }
  addPlayerNames(idx:number,name:string){
    this.playerNames[idx]=name;
  }
  getPlayerNames(){
    return this.playerNames;
  }
  setGameType(type:string){
    this.gameType=type;
    if(this.gameType=='robot'){
      this.playerType[2]='robot';
    }
  }
  getGameType(){
    return this.gameType;
  }
  getPlayerType(){
    return this.getPlayerType;
  }
}
