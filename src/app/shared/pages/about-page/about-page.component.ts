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

    if(this.tokenService.profileData){
      this.tokenService.profileData.subscribe(data => {
        if(data){
          this.name = data.display_name;
          this.img = data.images && data.images[1] ? data.images[1].url : '';
          this.email = data.email;
        }
      });
    }

    if(!this.isLogged){
      try {
        this.profile = await this.tokenService.getAuthCode();
      } catch (error) {
        console.error('Error getting profile', error);
      }
    }
  }
}
