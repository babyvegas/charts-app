import { Component } from '@angular/core';
import { TokenService } from '../../../services/token.service';
@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent {
  constructor(
    private tokenService: TokenService
  ) { }
  displayedColumns: string[] = ['position','artistName', 'artistGenres', 'img'];
  dataSource: any[] = [];
  public datos: any;
  artists: any[] = [];
  public artistName: string = '';
  public artistGenres: string = '';
  public img: string = '';
  async ngOnInit() {
    let token = localStorage.getItem('access_token');
    try {
      this.datos = await this.tokenService.fetchTopArtists(token).then((data) => {
        this.artists = data.items; // Explicitly type dataSource as any[];
        this.artists = this.artists.map((artist, index) => {
          return {
            position: index + 1,
            artistName: artist.name,
            artistGenres: artist.genres,
            img: artist.images[0].url, // Assign the 'tracks' array to the 'dataSource' property
          };
        });
    });
   } catch (error) {
      console.error('Error getting profile', error);
    }
  }
}
