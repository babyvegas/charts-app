import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TracksPageComponent } from './pages/tracks-page/tracks-page.component';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    HomePageComponent,
    AboutPageComponent,
    SidenavComponent,
    TracksPageComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatTableModule
  ],
  exports: [
    HomePageComponent,
    AboutPageComponent,
    SidenavComponent,
    TracksPageComponent
  ]
})
export class SharedModule { }
