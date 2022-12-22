import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  public playerNames:string[];
  public gameType:string;
  public totalPlayers:number;
  constructor(private shared:SharedService,private router:Router) { 
    this.playerNames=['',' '];
    this.gameType="none";
    this.totalPlayers=2;
  }
  setGameType(type:string){
    this.gameType=type;
  }
  startGame(){
    if(this.gameType=='robot'){
      this.playerNames[1]="AI";
    }
    for(let i=0;i<this.totalPlayers;i++){
      this.shared.addPlayerNames(i,this.playerNames[i]);
    }
    this.shared.setGameType(this.gameType);
    this.router.navigateByUrl('/game');
  }
  ngOnInit(): void {
  }

}
