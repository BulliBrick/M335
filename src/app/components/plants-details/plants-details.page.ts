import { Component, Input, OnInit } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonButtons,
  ModalController,
  AlertController,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Plant } from '../../data/plants';
import { PlantsInGarden } from '../../data/plants_in_garden';
import { PlantService } from '../../services/plant.service';
import { PlantsInGardenService } from '../../services/plants-in-garden.service';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-plants-details',
  templateUrl: './plants-details.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonText
  ]
})

export class PlantDetailsComponent implements OnInit {
  @Input() plant?: Plant;
  @Input() gardenId!: number;
  
  isNewPlant = false;
  existingPlants: Plant[] = [];
  editedPlant: Plant = {
    id: 0,
    name: '',
    species: '',
    created_at: new Date().toISOString(),
    location_in_garden: '',
    care_instructions: '',
    notes: ''
  };
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private plantService: PlantService,
    private plantsInGardenService: PlantsInGardenService
  ) {
    addIcons({ addOutline, closeOutline });
  }
  async ngOnInit() {
    if (this.plant) {
      this.editedPlant = { ...this.plant };
    } else {
      this.isNewPlant = true;
      // Load existing plants for selection
      this.existingPlants = await this.plantService.getPlants();
    }
  }

  async dismiss(success = false) {
    await this.modalCtrl.dismiss({
      success: success
    });
  }

  async savePlant() {
    try {
      if (this.isNewPlant) {
        // Set creation date for new plants
        this.editedPlant.created_at = new Date().toISOString();
        const newPlant = await this.plantService.createPlant(this.editedPlant);
        
        // Create plants_in_garden relationship
        const plantsInGarden: PlantsInGarden = {
          id: 0, // Will be set by backend
          plant_id: this.editedPlant.id,
          garden_id: this.gardenId
        };
        await this.plantsInGardenService.addPlantToGarden(plantsInGarden);
      } else {
        await this.plantService.updatePlant(this.editedPlant.id,this.editedPlant);
      }
      await this.dismiss(true);
    } catch (error) {
      await this.showError('Failed to save plant');
    }
  }

  async addExistingPlant(existingPlant: Plant) {
    try {
      const plantsInGarden: PlantsInGarden = {
        id: 0, // Will be set by backend
        plant_id: existingPlant.id,
        garden_id: this.gardenId
      };
      await this.plantsInGardenService.addPlantToGarden(plantsInGarden);
      await this.dismiss(true);
    } catch (error) {
      await this.showError('Failed to add plant to garden');
    }
  }

  async removePlantFromGarden() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Removal',
      message: 'Are you sure you want to remove this plant from the garden?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          handler: async () => {
            try {
              if (this.plant && this.gardenId) {
                await this.plantsInGardenService.removePlantFromGarden(this.plant.id, this.gardenId);
                await this.dismiss(true);
              }
            } catch (error) {
              await this.showError('Failed to remove plant from garden');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}