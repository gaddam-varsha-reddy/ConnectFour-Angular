
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  private currentPlayer:number;
  public playerNames:string[];
  private count:number;
  private rows:number;
  private columns:number;
  public score:number[];
  public board:number[][];
  private totalPlayers=2;
  private gameStatus:string;
  public player:string[];
  public turnIndicator:string="Start Playing";
  private Window_Length=4;
  public isopenModal;
  public modalTitle;
  public modalText;
  public imageName;

  
  constructor(private shared:SharedService,private router:Router) {
    this.currentPlayer=1;
    this.playerNames=this.shared.getPlayerNames();
    this.board=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],];
    this.count=0;
    this.rows=6;
    this.columns=7;
    this.score=[0,0,0];
    this.gameStatus="running";
    this.player=this.shared.playerType;
    this.turnIndicator= this.playerNames[this.currentPlayer]+"'s turn";
    this.isopenModal=false;
    this.modalTitle='';
    this.modalText='';
    this.imageName='gametie.jpg';
   }
 
  getTileValue(row:number,col:number):number{
    return this.board[row][col];
  }

  totalTilesClicked():number{
    this.count=0;
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.columns;j++){
        if(this.board[i][j]!=0)
          this.count+=1;
      }
    }
    return this.count;
   }

  isValidLocation(col:number):boolean{
    return this.board[0][col]===0;
   }

  getVacantRow(col:number):number{
    for(let i=5;i>=0;i--){
      if(this.board[i][col]===0){
        return i;
      }
    }
    return 0;
   }
  
   getValidLocations():number[]{
    let valid_locations = []
	  for(let col=0;col<this.columns;col++){
		  if(this.isValidLocation(col)){
			    valid_locations.push(col);
          }
      }
	  return valid_locations;
  }

  manualMove(col:number):boolean{
    if(this.isValidLocation(col)){
      let newRow=this.getVacantRow(col);
      this.board[newRow][col]=this.currentPlayer;
      return true;
    }
    return false;
  }

  robotMove():void{
    let new_col=this.pick_best_move();
    this.manualMove(new_col);    
  }

  drop_piece(temp_board:number[][],row:number,col:number,playerNo:number):void{
    temp_board[row][col]=playerNo;
  }
  
  changePlayerTurn(idx:number):void{
    if((this.totalTilesClicked()>=7) && (this.DirectionsToCheck(idx)))
          this.currentPlayer=0;
    else if(this.totalTilesClicked()==42){
          this.modalTitle='Oops!!';
          this.modalText="It's a Draw Match";
          this.imageName='gametie.jpg';
          this.openModal();
    }
    else{ 
          this.currentPlayer=this.currentPlayer === 1?2:1;
          this.turnIndicator=this.playerNames[this.currentPlayer] + "'s turn";
        }
  }
  onTileClick(row:number,col:number):void{
    if(this.gameStatus!="gameOver"){
      //if one is manual and one is automated
      if(this.shared.getGameType()=='robot'){
          if(this.currentPlayer==1){
              if(this.manualMove(col)){
                  this.changePlayerTurn(this.currentPlayer);
                  setTimeout(()=>{
                              this.robotMove();
                              this.changePlayerTurn(this.currentPlayer);
                           },1000);
              }
            }
          }

      //if players are manual
      else if(this.shared.getGameType()=='manual'){
        console.log("hi");
        this.manualMove(col);
        this.changePlayerTurn(this.currentPlayer);
      }    
   }
  }

  pick_best_move():number{
    //take a temp board and check every possible move which benefits ai 
    let valid_locations =this.getValidLocations();
    let best_score=-1000,row,col,score;
    let best_col =valid_locations[Math.floor(Math.random() * valid_locations.length)];
    for(col in valid_locations){
        row=this.getVacantRow(valid_locations[col]);
        let temp_board = JSON.parse(JSON.stringify(this.board));
        this.drop_piece(temp_board,row,valid_locations[col],2);
        score=this.score_position(temp_board,2);
        if (score > best_score){
            best_score=score;
            best_col=valid_locations[col];
        }
    }
    return best_col;
  }

  score_position(temp_board:number[][],playerNo:number):number{
    let score=0;
    let center_array=[];
    for(let i=0;i<this.rows;i++){
        center_array.push(temp_board[i][3]);
      }
    let center_count=0;
    center_array.forEach(element => {
    if (element === playerNo) {
      center_count += 1;
    }});
    score+=center_count;
    for(let r=0;r<this.rows;r++){
      let row_array=[];
      for(let i=0;i<this.columns;i++){
        row_array.push(temp_board[r][i]);
      }
      score+=this.calculate_windowArray(row_array,this.columns-3)}
    for(let c=0;c<this.columns;c++){
      let col_array=[];
      for(let i=0;i<this.rows;i++){
         col_array.push(temp_board[i][c]);
      }
      score+=this.calculate_windowArray(col_array,this.rows-3);
    }
     score+=this.calculate_DiagonalwindowArray(temp_board,this.rows-3,this.columns-3,"down_slope");
     score+=this.calculate_DiagonalwindowArray(temp_board,this.rows-3,this.columns-3,"upward_slope");
     return score;
  }
  
  calculate_windowArray(temp_array:number[],totalColumns:number):number{
    let sum=0;
    let window_array=[];
    for(let c=0;c<totalColumns;c++){
         window_array=[];
        for(let i=0;i<this.Window_Length;i++){
            window_array.push(temp_array[c+i]);
        }
        sum+= this.evaluate_window(window_array);
      }
    return sum;
  }
  calculate_DiagonalwindowArray(temp_board:number[][],totalRows:number,totalColumns:number,slope:string):number{
    let sum=0;
     for(let r=0;r<totalRows;r++){
            for(let c=0;c<totalColumns;c++){
                let window_array=[];
                for(let i=0;i<this.Window_Length;i++){
                        if(slope==="upward-slope"){
                            window_array.push(temp_board[r+3-i][c+i]);
                        }
                        else
                            window_array.push(temp_board[r+i][c+i]);
                }
                sum+= this.evaluate_window(window_array);
            }
     } 
    return sum;
  }

evaluate_window(window_array:number[]):number{
  let score=0;
  let count_Array={0:0,1:0,2:0};
  window_array.forEach(element => {
      if(element==1){
        count_Array[1]+=1;
      }
      else if(element==2){
        count_Array[2]+=1;
      }
      else{
        count_Array[0]+=1;
      }
  });
  if(count_Array[2]==4)
      score+=200;
  else if(count_Array[2]==3 && count_Array[0]==1)
      score+=50;
  else if(count_Array[2]==2 && count_Array[0]==2)
      score+=10;
  if(count_Array[1]==3 && count_Array[0]==1)
      score-=80;
  if(count_Array[1]==2 && count_Array[0]==2)
      score-=15;
  return score;
}
  newGame():void{
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.columns;j++){
          this.board[i][j]=0;
      }
    }
    this.gameStatus="running";
    this.currentPlayer=1;
    this.turnIndicator=this.playerNames[this.currentPlayer] + "'s turn";
  }

  exitGame():void{
    this.newGame();
    for(let i=0;i<this.totalPlayers;i++){
      this.score[i]=0;
    }
    this.router.navigateByUrl('/connect');
  }

  DirectionsToCheck(playerNo:number):boolean{
    if(this.loopingBoard(0,this.rows,this.columns-3,playerNo))
      return true;
    else if(this.loopingBoard(0,this.rows-3,this.columns,playerNo))
      return true;
    else if(this.loopingBoard(3,this.rows,this.columns-3,playerNo))
      return true;
    else if(this.loopingBoard(0,this.rows-3,this.columns-3,playerNo))
      return true;
    return false;
   }

  loopingBoard(idx:number,totalRows:number,totalColumns:number,playerNo:number):boolean{
    for(let i=idx;i<totalRows;i++){
      for(let j=0;j<totalColumns;j++){
           if(totalRows===this.rows && totalColumns===this.columns-3 && idx===3){
               if(this.GameOver(i,j,i-1,j+1,i-2,j+2,i-3,j+3,playerNo))
                   return true;
               }
           else if(totalRows===this.rows-3 && totalColumns===this.columns){
               if(this.GameOver(i,j,i+1,j,i+2,j,i+3,j,playerNo))
                   return true;
           }
          else if(totalRows===this.rows && totalColumns===this.columns-3){
               if(this.GameOver(i,j,i,j+1,i,j+2,i,j+3,playerNo))
                   return true;
           }
          else if(totalRows===this.rows-3 && totalColumns===this.columns-3){
           if(this.GameOver(i,j,i+1,j+1,i+2,j+2,i+3,j+3,playerNo))
                return true;
          }
      }
   }
   return false;
   }

  GameOver(a1:number,a2:number,b1:number,b2:number,c1:number,c2:number,d1:number,d2:number,playerNo:number):boolean{
    if(this.board[a1][a2]==playerNo && this.board[b1][b2]==playerNo
      && this.board[c1][c2]==playerNo && this.board[d1][d2]==playerNo)
      {
        this.score[playerNo]+=1;
        this.gameStatus="gameOver";
        this.turnIndicator=this.playerNames[playerNo] + " won";
        this.modalTitle='Hurray!!'
        this.modalText=this.turnIndicator + ' the game';
        this.imageName="avathar"+playerNo+".png";
        setTimeout(()=>{
          this.openModal();
        },2000);
        return true;
      }
    return false;
   }
   openModal() {
    this.isopenModal=true;
    
}
  closeModal() {
    this.newGame();
    this.isopenModal=false;
}
  ngOnInit(): void {
    
  }
}

