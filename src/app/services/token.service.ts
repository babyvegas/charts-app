// Logica para obter el token de autenticacion para spotify
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Injectable({  providedIn: 'root' })
export class TokenService {

profile: any;
  async getAuthCode(){
    const clientId = environment.clientId;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    /* La primera vez que accedamos, no tendremos un code, por lo que redirigiremos al usuario a la página de autenticación de Spotify.
     Si ya tenemos un code, lo usaremos para obtener un access token y, a continuación, obtendremos el perfil del usuario. */
    if (!code) {
      this.redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await this.getAccessToken(clientId, code);
      const profile = await this.fetchProfile(accessToken);
      return profile;
    }
  }

  async redirectToAuthCodeFlow(clientId: string) {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:4200/about");
    params.append("scope", "user-read-private user-read-email user-top-read" , );
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    document.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
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
    const verifier = localStorage.getItem("verifier");

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

}}
