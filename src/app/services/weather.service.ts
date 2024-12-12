// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WeatherResponse, WeatherAlert } from '../interfaces/weather.interfaces';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = 'b3ad488c3712949ad51de52e95b43ec4';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/3.0';

  constructor(private http: HttpClient) {}

  async getWeatherData(lat: number, lon: number) {
    const url = `${this.BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${this.API_KEY}`;
    
    try {
      const response = await firstValueFrom(this.http.get<WeatherResponse>(url));
      
      return {
        location: {
          lat: response.lat,
          lon: response.lon,
          timezone: response.timezone
        },
        current: {
          temp: Math.round(response.current.temp),
          feels_like: Math.round(response.current.feels_like),
          humidity: response.current.humidity,
          wind_speed: response.current.wind_speed,
          wind_deg: response.current.wind_deg,
          weather: response.current.weather[0],
          uvi: response.current.uvi,
          sunrise: new Date(response.current.sunrise * 1000),
          sunset: new Date(response.current.sunset * 1000)
        },
        daily: response.daily.map(day => ({
          date: new Date(day.dt * 1000),
          summary: day.summary,
          temp: {
            day: Math.round(day.temp.day),
            min: Math.round(day.temp.min),
            max: Math.round(day.temp.max)
          },
          weather: day.weather[0],
          pop: Math.round(day.pop * 100), // Probability of precipitation as percentage
          rain: day.rain || 0
        })),
        alerts: this.transformAlerts(response.alerts)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private transformAlerts(alerts: WeatherAlert[] | undefined): any[] {
    if (!alerts) return [];
    
    return alerts.map(alert => ({
      event: alert.event,
      start: new Date(alert.start * 1000),
      end: new Date(alert.end * 1000),
      description: alert.description,
      sender: alert.sender_name
    }));
  }
}