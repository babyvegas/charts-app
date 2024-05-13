// Logica para obter el token de autenticacion para spotify
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Injectable({  providedIn: 'root' })
export class TokenService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedIn.asObservable();
  profile: any;
  private authorizationEndpoint = 'https://accounts.spotify.com/authorize';
  private redirectUrl = 'http://localhost:4200/about';
  private scope = 'user-read-private user-read-email user-top-read';
  async getAuthCode(){
    const clientId = environment.clientId;
    const params = new URLSearchParams(window.location.search);

    /* La primera vez que accedamos, no tendremos un code, por lo que redirigiremos al usuario a la página de autenticación de Spotify.
     Si ya tenemos un code, lo usaremos para obtener un access token y, a continuación, obtendremos el perfil del usuario. */
/*     if (!code) {
      this.redirectToAuthCodeFlow(clientId);
    } else {
      try {
        const accessToken = await this.getAccessToken(clientId, code);
        const profile = await this.fetchProfile(accessToken);
        // Guarda el token de acceso y el estado de inicio de sesión solo si getAccessToken() se completa con éxito
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem('isLogged', 'true');
        this.loggedIn.next(true);
        return profile;
      } catch (error) {
        console.error('Error getting access token', error);
      }
    } */
    // On page load, try to fetch auth code from current browser search URL
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');
    if(code){
      const accessToken = await this.getAccessToken(clientId, code);
      this.loggedIn.next(true);
      const profile = await this.fetchProfile(accessToken);
      // Remove code from URL so we can refresh correctly.
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);
      return profile;
    } else {
      this.redirectToAuthCodeFlow(clientId);
    }
  }

  async redirectToAuthCodeFlow(clientId: string) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    window.localStorage.setItem('code_verifier', code_verifier);
    const authUrl = new URL(this.authorizationEndpoint);
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: this.redirectUrl,
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  generateCodeVerifier(length: number) {
    let text= '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '-')
      .replace(/=+$/, '');
  }


  async getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("code_verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:4200/about");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    return access_token;
  }

   /* Peticion para obtener el perfil del usuario, llamada una vez que tengamos el token de autenticación */
   async fetchProfile(accessToken: any): Promise<any> {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const profile = await response.json();
    localStorage.setItem("access_token", accessToken);
    return profile;
  }
    /* Se elimina de la memoria local el verificador y el access token, se redirige a pagina principal */
    logout() {
      sessionStorage.clear();
      localStorage.clear()
      window.location.href = window.location.origin;
      this.loggedIn.next(false);
    }

    /* Peticion a los tracks mas escuchados */
    async fetchTopTracks(accessToken: any): Promise<any> {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }
      const data = await response.json();
      return data;
    }

    /* Peticion a los artistas mas escuchados */
    async fetchTopArtists(accessToken: any): Promise<any> {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: { 'Authorization': `Bearer ${accessToken}`}
    });
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
    const data = await response.json();
    console.log("dataArtists",data)
    return data;

}
    isLoggedIn() {
      return localStorage.getItem('isLogged') === "true";
    }
}
