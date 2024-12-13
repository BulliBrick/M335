// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  private readonly API_KEY = 'b3ad488c3712949ad51de52e95b43ec4'; // Replace with your API key

  constructor(private http: HttpClient) {}

  public async getPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }

  getForecast(lat: number, lon: number): Observable<any> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: this.API_KEY,
      units: 'metric'
    };

    return this.http.get(this.API_URL, { params });
  }

  public async getForecastForCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return this.getForecast(
        position.coords.latitude,
        position.coords.longitude
      ).toPromise();
    } catch (error) {
      console.error('Error getting location or forecast:', error);
      throw error;
    }
  }
}