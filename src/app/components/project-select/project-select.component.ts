import { Component, OnInit } from '@angular/core';
import { GardensService } from '../../services/garden.service';
import { Garden } from '../../data/gardens';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-project-select',
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Garden</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openNewGardenDialog()">
            <ion-icon name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let garden of gardens" (click)="selectGarden(garden)">
          <ion-label>
            <h2>{{garden.name}}</h2>
            <p>Location: {{garden.location}}</p>
            <p>Size: {{garden.size}}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
    imports: [
        CommonModule,
        FormsModule,
        NgFor,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonButton,
        IonButtons,
        IonIcon,
        
    ]
    })
export class ProjectSelectPage implements OnInit {
  gardens: Garden[] = [];

  constructor(
    private projectService: GardensService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadGardens();
  }

  async loadGardens() {
    this.gardens = await this.projectService.getGardens();
  }

  selectGarden(garden: Garden) {
    this.router.navigate(['/planner', garden.id]);
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
          placeholder: 'Size'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: (data) => {
            this.createGarden(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async createGarden(data: any) {
    const newGarden: Garden = {
      id: 0, // This will be set by the backend
      name: data.name,
      location: data.location,
      size: data.size,
      created_at: new Date().toISOString()
    };
    await this.projectService.addGarden(newGarden);
    this.loadGardens();
  }
}