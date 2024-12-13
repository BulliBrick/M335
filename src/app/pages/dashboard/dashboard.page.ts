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
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { addOutline, cloudOfflineOutline, leafOutline, logInOutline, personAddOutline, water, speedometer, sunny, rainy, warning, location } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Geolocation } from '@capacitor/geolocation';
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
    
  ]
})
export class DashboardComponent implements OnInit {
  gardens: Garden[] = [];
  isWeatherExpanded = false;
  isOnline = true;
  weatherData: WeatherResponse | null = null;
  constructor(
    private router: Router,
    private gardensService: GardensService,
     private weatherService: WeatherService,
    private networkService: NetworkService,
    private alertCtrl: AlertController,
  ) {
    addIcons({leafOutline,water,speedometer,rainy,location,sunny,warning,cloudOfflineOutline,personAddOutline});
  }

  ngOnInit() {
    this.setupNetworkListener();
    this.loadInitialData();
    this.loadWeatherData();
    const coordinates = Geolocation.getCurrentPosition();
    console.log(coordinates)
  }

  async openNewGardenDialog() {
    const alert = await this.alertCtrl.create({
      header: 'New Garden',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Garden Name'
        },
        {
          name: 'location',
          type: 'text',
          placeholder: 'Location'
        },
        {
          name: 'size',
          type: 'text',
          placeholder: 'Size (e.g., 10x20m)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: async (data) => {
            const newGarden: Garden = {
              id: Date.now(),
              name: data.name,
              location: data.location,
              size: data.size,
              created_at: new Date().toISOString()
            };
            
            await this.gardensService.addGarden(newGarden);
            await this.loadGardens();
          }
        }
      ]
    });

    await alert.present();
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
    this.router.navigate(['/planner']);
  }

  openGarden(gardenId: number) {
    this.router.navigate([`/planner:${gardenId}`]);
  }

 public async loadWeatherData() {
    try {
      const position = await this.weatherService.getPosition();
      this.weatherService.getForecast(
        position.coords.latitude,
        position.coords.longitude
      ).subscribe({
        next: (data) => {
          this.weatherData = data;
          console.log('Weather data:', data);
        },
        error: (error) => {
          console.error('Error fetching weather data:', error);
        }
      });
    } catch (error) {
      console.error('Error getting location:', error);
      this.weatherService.getForecast(49.5,8.0)
    }
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



