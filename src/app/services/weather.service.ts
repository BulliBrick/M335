// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WeatherResponse, WeatherAlert } from '../interfaces/weather.interfaces';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = 'b3ad488c3712949ad51de52e95b43ec4'; // Replace with your actual API key
  private readonly BASE_URL = 'https://api.openweathermap.org/data/3.0';

  constructor(private http: HttpClient) {}

  async getWeatherData(lat: number, lon: number) {
    const url = `${this.BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${this.API_KEY}`;
    
    try {
      const response = await firstValueFrom(this.http.get<WeatherResponse>(url));
      return this.transformWeatherData(response);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private transformWeatherData(data: WeatherResponse) {
    const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

    return {
      location: {
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone
      },
      current: {
        temp: Math.round(kelvinToCelsius(data.current.temp)),
        feels_like: Math.round(kelvinToCelsius(data.current.feels_like)),
        humidity: data.current.humidity,
        wind_speed: data.current.wind_speed,
        wind_deg: data.current.wind_deg,
        weather: data.current.weather[0],
        uvi: data.current.uvi,
        sunrise: new Date(data.current.sunrise * 1000),
        sunset: new Date(data.current.sunset * 1000)
      },
      daily: data.daily.map(day => ({
        date: new Date(day.dt * 1000),
        summary: day.summary,
        temp: {
          day: Math.round(kelvinToCelsius(day.temp.day)),
          min: Math.round(kelvinToCelsius(day.temp.min)),
          max: Math.round(kelvinToCelsius(day.temp.max))
        },
        weather: day.weather[0],
        pop: Math.round(day.pop * 100), // Probability of precipitation as percentage
        rain: day.rain || 0
      })),
      alerts: this.transformAlerts(data.alerts)
    };
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