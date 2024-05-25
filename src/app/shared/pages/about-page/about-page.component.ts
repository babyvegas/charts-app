import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token.service';
@Component({
  selector: 'shared-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent implements OnInit {
  isLogged: boolean = false;
  constructor(
    private tokenService: TokenService
  ) { }
  private profile: any;
  public name: string = '';
  public img: string = '';
  public email: string = '';
  async ngOnInit() {
    this.tokenService.loggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
    this.tokenService.profileData.subscribe(profile => {
      if(profile){
        this.name = profile.display_name;
        this.img = profile.images[1].url;
        this.email = profile.email;
      }
    });
    if(!this.isLogged){
    try {
      this.profile = await this.tokenService.getAuthCode();
    } catch (error) {
      console.error('Error getting profile', error);
    }
  }
}
}
