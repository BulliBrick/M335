import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService } from './network.service';
import { firstValueFrom } from 'rxjs';

interface WeatherResponse {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

interface ForecastResponse {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'YOUR_API_KEY';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    private http: HttpClient,
    private networkService: NetworkService
  ) {}

  async getWeatherData(lat: number, lon: number) {
    if (!await this.networkService.isOnline()) {
      throw new Error('No internet connection');
    }

    try {
      const weatherPromise = firstValueFrom(
        this.http.get<WeatherResponse>(
          `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        )
      );

      const forecastPromise = firstValueFrom(
        this.http.get<ForecastResponse>(
          `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        )
      );

      const [weather, forecast] = await Promise.all([weatherPromise, forecastPromise]);

      // Format the daily forecast (one entry per day)
      const dailyForecast = this.processForecast(forecast.list);

      return {
        location: weather.name,
        temp: Math.round(weather.main.temp),
        condition: weather.weather[0].main,
        forecast: dailyForecast
      };
    } catch (error) {
      console.error('Weather fetch failed:', error);
      throw error;
    }
  }

  private processForecast(forecastList: ForecastResponse['list']) {
    const dailyForecasts = new Map();
    
    forecastList.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main
        });
      }
    });

    return Array.from(dailyForecasts.values()).slice(1, 4); // Next 3 days
  }
}
