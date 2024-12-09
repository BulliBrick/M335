import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GardensService } from '../../services/garden.service';
import { WeatherService } from '../../services/weather.service';
import { NetworkService } from '../../services/network.service';
import { Garden } from '../../data/gardens';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
  }>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    CommonModule
  ]
})
export class DashboardComponent implements OnInit {
  gardens: Garden[] = [];
  weatherData: WeatherData | null = null;
  isWeatherExpanded = false;
  isOnline = true;

  constructor(
    private router: Router,
    private gardensService: GardensService,
    private weatherService: WeatherService,
    private networkService: NetworkService
  ) {}

  ngOnInit() {
    this.setupNetworkListener();
    this.loadInitialData();
  }

  private setupNetworkListener() {
    this.networkService.onNetworkChange().subscribe(isOnline => {
      this.isOnline = isOnline;
      if (isOnline) {
        this.loadWeatherData();
        this.gardensService.syncGardens();
      }
    });
  }

  private async loadInitialData() {
    await this.loadGardens();
    if (this.isOnline) {
      await this.loadWeatherData();
    }
  }

  private async loadGardens() {
    this.gardens = await this.gardensService.getGardens();
  }

  private async loadWeatherData() {
    try {
      // Switzerland coordinates as default
      const lat = 47.3769;
      const lon = 8.5417;
      this.weatherData = await this.weatherService.getWeatherData(lat, lon);
    } catch (error) {
      console.error('Weather data loading failed:', error);
    }
  }

  toggleWeather() {
    if (this.isOnline) {
      this.isWeatherExpanded = !this.isWeatherExpanded;
    }
  }

  async createNewGarden() {
    this.router.navigate(['/create-garden']);
  }

  openGarden(gardenId: number) {
    this.router.navigate(['/garden-planner', gardenId]);
  }
}