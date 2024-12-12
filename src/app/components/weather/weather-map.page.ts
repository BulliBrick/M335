/*
import { Component, OnInit, Inject } from '@angular/core';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { LoadingController } from '@ionic/angular';
import * as L from 'leaflet';
import { IonItem,IonLabel,IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonCard,IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.page.html',
  styleUrls: ['./weather-map.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonCard,
    CommonModule,
    IonCardContent,
    IonItem,
    IonLabel,
    NgFor,
    NgIf,
    FormsModule,

  ],
})
export class WeatherComponent implements OnInit {
  private map: L.Map = L.map('');
  private weatherLayer: L.TileLayer = new L.TileLayer('');
  currentWeather: WeatherData | null = null;
  error: string | null = null;

  // Available map layers
  mapLayers: { value: WeatherMapLayer; label: string }[] = [
    { value: 'temp_new', label: 'Temperature' },
    { value: 'precipitation_new', label: 'Precipitation' },
    { value: 'clouds_new', label: 'Clouds' },
    { value: 'pressure_new', label: 'Pressure' },
    { value: 'wind_new', label: 'Wind' }
  ];

  constructor(
    @Inject(WeatherService) private weatherService: WeatherService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.initMap();
    this.loadCurrentWeather();
  }

  private initMap(): void {
    // Initialize the map centered on Switzerland
    this.map = L.map('map').setView([46.8182, 8.2275], 8);

    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add initial weather layer
    this.addWeatherLayer();
  }

  private addWeatherLayer(): void {
    // Remove existing weather layer if it exists
    if (this.weatherLayer) {
      this.map.removeLayer(this.weatherLayer);
    }

    // Add new weather layer
    this.weatherLayer = L.tileLayer(
      this.weatherService.getWeatherMapUrl(this.selectedLayer, 0, 0, 0),
      {
        opacity: 0.5,
        attribution: '© OpenWeatherMap'
      }
    ).addTo(this.map);
  }

  async loadCurrentWeather() {
    const loading = await this.loadingController.create({
      message: 'Loading weather data...'
    });
    await loading.present();

    try {
      const center = this.map.getCenter();
      this.weatherService.getCurrentWeather(center.lat, center.lng).subscribe(
        (data: any) => {
          this.currentWeather = data;
          this.error = null;
        },
        (error: any) => {
          this.error = 'Error loading weather data';
          console.error('Error loading weather data:', error);
        }
      );
    } finally {
      loading.dismiss();
    }
  }

  onLayerChange(event: any): void {
    this.selectedLayer = event.detail.value;
    this.addWeatherLayer();
  }
} */