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


  private profile: any;
  public name: string = '';
  public img: string = '';
  public email: string = '';
  async getCodeForToken() {
    try {
      await this.tokenService.getAuthCode();
    } catch (error) {
      console.error('Error getting token', error);
    }
  }

  logout(){
    this.tokenService.logout();
  }

  menuItems: MenuItem[] = [
    {
      icon: 'dataset',
      label: 'Dashboard',
      route: '/home'
    },    {
      icon: 'account_circle',
      label: 'About me',
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
