import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token.service';
@Component({
  selector: 'shared-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent implements OnInit {
  constructor(
    private tokenService: TokenService
  ) { }
  private profile: any;
  public name: string = '';
  public img: string = '';
  public email: string = '';
  async ngOnInit() {

    try {
      this.profile = await this.tokenService.getAuthCode();
      console.log(this.profile);
    } catch (error) {
      console.error('Error getting profile', error);
    }
  }
}
