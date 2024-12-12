// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CurrentWeather, DailyForecast, WeatherAlert } from '../interfaces/weather.interfaces';
export interface WeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'b3ad488c3712949ad51de52e95b43ec4';
  private baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  public getWeatherData(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return of({} as WeatherResponse);
      })
    );
  }
}