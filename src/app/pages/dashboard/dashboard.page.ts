import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GardensService } from '../../services/garden.service';
import { WeatherService } from '../../services/weather.service';
import { NetworkService } from '../../services/network.service';
import { Garden } from '../../data/gardens';
import { WeatherComponent } from '../../components/weather/weather-map.page';
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
import { addOutline, cloudOfflineOutline, leafOutline, logInOutline, personAddOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
    WeatherComponent,
    NgIf,
    NgFor,
    
  ]
})
export class DashboardComponent implements OnInit {
  gardens: Garden[] = [];
  isWeatherExpanded = false;
  isOnline = true;

  constructor(
    private router: Router,
    private gardensService: GardensService,
    private networkService: NetworkService
  ) {
    addIcons({leafOutline,cloudOfflineOutline,personAddOutline});
  }

  ngOnInit() {
    this.setupNetworkListener();
    this.loadInitialData();
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
}