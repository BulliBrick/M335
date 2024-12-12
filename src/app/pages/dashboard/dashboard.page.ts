import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GardensService } from '../../services/garden.service';
import { WeatherService } from '../../services/weather.service';
import { NetworkService } from '../../services/network.service';
import { Garden } from '../../data/gardens';
import { WeatherResponse } from '../../interfaces/weather.interfaces';
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
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { addOutline, cloudOfflineOutline, leafOutline, logInOutline, personAddOutline, water, speedometer, sunny, rainy, warning } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
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
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    
    
  ],
})
export class DashboardComponent implements OnInit {
  gardens: Garden[] = [];
  isWeatherExpanded = false;
  isOnline = true;
  weatherData: WeatherResponse | null = null;  
  constructor(
    private router: Router,
    private gardensService: GardensService,
    private networkService: NetworkService,
    private weatherService: WeatherService
  ) {
    addIcons({leafOutline,water,speedometer,sunny,rainy,warning,cloudOfflineOutline,personAddOutline});
  }

  ngOnInit() {
    this.setupNetworkListener();
    this.loadInitialData();
    this.loadWeatherData();
  }

  private setupNetworkListener() {
    this.networkService.onNetworkChange().subscribe(isOnline => {
      this.isOnline = isOnline;
      if (isOnline) {
        this.gardensService.syncGardens();
      }
    });
  }

  private async loadInitialData() {
    await this.loadGardens();
    if (this.isOnline) {
    }
  }

  private async loadGardens() {
    this.gardens = await this.gardensService.getGardens();
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
  loadWeatherData() {
    // Use Switzerland coordinates or get from user's garden location
    const lat = 46.8182;
    const lon = 8.2275;

    this.weatherService.getWeatherData(lat, lon).subscribe(
      data => {
        this.weatherData = data;
      },
      error => {
        console.error('Error loading weather data:', error);
      }
    );
  }
  
  getWeatherIcon(conditions: string): string {
    switch (conditions.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'cloudy';
      case 'rain':
        return 'rainy';
      case 'snow':
        return 'snow';
      default:
        return 'thermometer';
    }
  }
  
  getDayLabel(date: string): string {
    const today = new Date().toLocaleDateString();
    if (date === today) {
      return 'Today';
    }
    return new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
  }
}



