import { Component, Input, computed, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}


@Component({
  selector: 'shared-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  constructor(
    private tokenService: TokenService
  ) { }
  public name: string = '';
  public img: string = '';
  public email: string = '';
  public isLogged: boolean = false;
  ngOnInit() {
    this.tokenService.loggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
    this.tokenService.profileData.subscribe(profile => {
      if(profile){
        this.name = profile.display_name;
        this.img = profile.images[1].url;
        this.email = profile.email;
      }
    }
  )};
  async getCodeForToken() {
    try {
      const token = await this.tokenService.getAuthCode();
      this.isLogged = this.tokenService.isLoggedIn();
    } catch (error) {
      console.error('Error getting token', error);
    }
  }

  logout(){
    this.tokenService.logout();
    this.isLogged = this.tokenService.isLoggedIn();
  }

  menuItems: MenuItem[] = [
    {
      icon: 'dataset',
      label: 'Dashboard',
      route: '/home'
    },    {
      icon: 'account_circle',
      label: 'About',
      route: '/about'
    },
    {
      icon: 'grade',
      label: 'Top Artists',
      route: '/artists'
    },
    {
      icon: 'sync',
      label: 'Top Tracks',
      route: '/tracks',
    }
  ]

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');


}
