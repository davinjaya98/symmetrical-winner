import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';

import { PagesRoutingModule } from './pages-routing.module';
import { IntroductionPageComponent } from './introduction-page/introduction-page.component';

import { ComponentModule } from '../shared/component/component.module';

@NgModule({
  declarations: [
    HomepageComponent, 
    IntroductionPageComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentModule,
  ]
})
export class PagesModule { }
