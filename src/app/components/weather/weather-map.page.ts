// weather.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService } from '../../services/weather.service';
import { NetworkService } from '../../services/network.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-weather',
  template: `
    <div class="weather-container">
      <div *ngIf="isOnline && weatherData; else offlineTemplate">
        <!-- Current Weather -->
        <div class="current-weather">
          <div class="weather-header">
            <h3>Current Weather</h3>
            <p class="location">{{ weatherData.location.timezone }}</p>
          </div>
          <div class="weather-content">
            <div class="main-info">
              <img [src]="getWeatherIcon(weatherData.current.weather.icon)" alt="Weather icon">
              <div class="temperature">{{ weatherData.current.temp }}°C</div>
              <div class="description">{{ weatherData.current.weather.description }}</div>
            </div>
            <div class="details">
              <div class="detail-item">
                <ion-icon name="thermometer-outline"></ion-icon>
                <span>Feels like: {{ weatherData.current.feels_like }}°C</span>
              </div>
              <div class="detail-item">
                <ion-icon name="water-outline"></ion-icon>
                <span>Humidity: {{ weatherData.current.humidity }}%</span>
              </div>
              <div class="detail-item">
                <ion-icon name="speedometer-outline"></ion-icon>
                <span>Wind: {{ weatherData.current.wind_speed }} m/s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Alerts -->
        <div class="alerts" *ngIf="weatherData.alerts?.length">
          <div class="alert" *ngFor="let alert of weatherData.alerts">
            <ion-icon name="warning-outline" color="danger"></ion-icon>
            <div class="alert-content">
              <h4>{{ alert.event }}</h4>
              <p>{{ alert.description }}</p>
              <small>Valid: {{ alert.start | date:'short' }} - {{ alert.end | date:'short' }}</small>
            </div>
          </div>
        </div>

        <!-- Daily Forecast -->
        <div class="forecast">
          <h3>7-Day Forecast</h3>
          <div class="forecast-list">
            <div class="forecast-item" *ngFor="let day of weatherData.daily">
              <div class="day">{{ day.date | date:'EEE' }}</div>
              <img [src]="getWeatherIcon(day.weather.icon)" alt="Weather icon">
              <div class="temp-range">
                <span class="max">{{ day.temp.max }}°</span>
                <span class="min">{{ day.temp.min }}°</span>
              </div>
              <div class="precipitation" *ngIf="day.pop > 0">
                <ion-icon name="rainy-outline"></ion-icon>
                {{ day.pop }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #offlineTemplate>
        <div class="offline-warning">
          <ion-icon name="cloud-offline-outline" size="large"></ion-icon>
          <p>Weather information is not available offline</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .weather-container {
      padding: 16px;
    }
    .current-weather {
      background: var(--ion-card-background);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .weather-header {
      margin-bottom: 16px;
    }
    .location {
      color: var(--ion-color-medium);
    }
    .main-info {
      text-align: center;
      margin-bottom: 16px;
    }
    .temperature {
      font-size: 48px;
      font-weight: bold;
    }
    .description {
      text-transform: capitalize;
      color: var(--ion-color-medium);
    }
    .details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .alerts {
      margin: 16px 0;
    }
    .alert {
      background: var(--ion-color-danger-tint);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      display: flex;
      gap: 12px;
    }
    .forecast-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
    }
    .forecast-item {
      text-align: center;
      padding: 12px;
      background: var(--ion-card-background);
      border-radius: 8px;
    }
    .temp-range {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .min {
      color: var(--ion-color-medium);
    }
    .offline-warning {
      text-align: center;
      padding: 32px;
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class WeatherComponent implements OnInit {
  weatherData: any = null;
  isOnline = false;

  constructor(
    private weatherService: WeatherService,
    private networkService: NetworkService
  ) {}

  async ngOnInit() {
    this.setupNetworkListener();
    await this.getCurrentLocation();
  }

  private setupNetworkListener() {
    this.networkService.onNetworkChange().subscribe(isOnline => {
      this.isOnline = isOnline;
      if (isOnline) {
        this.getCurrentLocation();
      }
    });
  }

  private async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      await this.loadWeatherData(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  private async loadWeatherData(lat: number, lon: number) {
    try {
      this.weatherData = await this.weatherService.getWeatherData(lat, lon);
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  }

  getWeatherIcon(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}