import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
   public playerNames:string[];
   public gameType:string;
   
  constructor() {
    this.playerNames=[];
    this.gameType="none";
   }
  addPlayerNames(idx:number,name:string){
    this.playerNames[idx]=name;
  }
  getPlayerNames(){
    return this.playerNames;
  }
  setGameType(type:string){
    this.gameType=type;
  }
  getGameType(){
    return this.gameType;
  }
}
