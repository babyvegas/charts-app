import { Component } from '@angular/core';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-tracks-page',
  templateUrl: './tracks-page.component.html',
  styleUrl: './tracks-page.component.css'
})
export class TracksPageComponent {
  constructor(
    private tokenService: TokenService
  ) { }

  displayedColumns: string[] = ['trackName', 'trackArtist', 'img'];
  dataSource: any[] = [];
  private profile: any;
  public trackName: string = '';
  public trackArtist: string = '';
  public img: string = '';
  public email: string = '';
  public datos: any;
  tracks: any[] = []; // Add the 'tracks' property with an empty array as its initial value
  artists: any[] = []; // Add the 'artists' property with an empty array as its initial value

  async ngOnInit() {
        let token = localStorage.getItem('access_token');
        try {
          this.datos = await this.tokenService.fetchTopTracks(token).then((data) => {
            this.tracks = data.items; // Explicitly type dataSource as any[];

            this.tracks = this.tracks.map((track) => {
              return {
                trackName: track.name,
                trackArtist: track.artists[0].name,
                img: track.album.images[0].url, // Assign the 'tracks' array to the 'dataSource' property
              };
            });
        });
        } catch (error) {
          console.error('Error getting profile', error);
        }
      }

    }
