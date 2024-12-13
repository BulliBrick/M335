import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  AlertController,
  IonButtons,
  IonBackButton,
  
} from '@ionic/angular/standalone';
import { GardensService } from '../../services/garden.service';
import { Garden } from '../../data/gardens';
import { addIcons } from 'ionicons';
import { addOutline, locationOutline, resizeOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-garden-select',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs"></ion-back-button>
        </ion-buttons>
        <ion-title>My Gardens</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="garden-container">
        <div class="header">
          <h2>Select a Garden</h2>
        </div>

        <div class="gardens-list" *ngIf="gardens.length > 0">
          <ion-card *ngFor="let garden of gardens" (click)="selectGarden(garden)">
            <ion-card-header>
              <ion-card-title>{{garden.name}}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>
                <ion-icon name="location-outline"></ion-icon>
                {{garden.location}}
              </p>
              <p>
                <ion-icon name="resize-outline"></ion-icon>
                {{garden.size}}
              </p>
              <p class="garden-date">Created: {{garden.created_at | date}}</p>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="no-items" *ngIf="gardens.length === 0">
          <ion-icon name="leaf-outline" size="large"></ion-icon>
          <p>You haven't created any gardens yet</p>
          <ion-button (click)="openNewGardenDialog()">Create Your First Garden</ion-button>
        </div>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openNewGardenDialog()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .garden-container {
      padding: 16px;
    }

    .header {
      margin-bottom: 20px;
      text-align: center;
    }

    .gardens-list ion-card {
      margin-bottom: 16px;
      cursor: pointer;
    }

    .garden-date {
      color: var(--ion-color-medium);
      font-size: 0.9em;
      margin-top: 8px;
    }

    .no-items {
      text-align: center;
      padding: 32px;
      color: var(--ion-color-medium);
    }

    ion-icon {
      margin-right: 8px;
      vertical-align: middle;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonButtons,
    IonBackButton
  ]
})
export class GardenSelectPage implements OnInit {
  gardens: Garden[] = [];

  constructor(
    @Inject(GardensService) 
    private gardensService: GardensService,
    private router: Router,
    private alertCtrl: AlertController,
    
  ) {
    addIcons({ addOutline, locationOutline, resizeOutline, add });
  }

  async ngOnInit() {
    await this.loadGardens();
  }

  async loadGardens() {
    this.gardens = await this.gardensService.getGardens();
  }

  selectGarden(garden: Garden) {
    this.router.navigate([`tabs/planner/${garden.id}`]);
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
}