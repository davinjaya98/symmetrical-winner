import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { IntroductionPageComponent } from './introduction-page/introduction-page.component';
const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'intro', component: IntroductionPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }