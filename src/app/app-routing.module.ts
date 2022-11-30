import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path: '', redirectTo: 'connect',pathMatch:'full'},
  {path: 'connect',component:DetailsComponent},
  {path: 'game', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
