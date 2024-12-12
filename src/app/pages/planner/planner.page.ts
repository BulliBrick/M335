import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../data/tasks';
import { Plant } from '../../data/plants';
import { PlantsInGarden } from '../../data/plants_in_garden';
import { LocalStorageService } from '../../services/local-storage.service';
import { PlantService } from '../../services/plant.service';
import { PlantsInGardenService } from '../../services/plants-in-garden.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  AlertController, 
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonItemSliding,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  IonRouterOutlet,
  IonCard,
  IonCardContent, 
  IonCardTitle,
  IonCardHeader,
  IonButton
} from '@ionic/angular/standalone';
import { PlantDetailsComponent } from '../../components/plants-details/plants-details.page';
import { addIcons } from 'ionicons';
import { addOutline, add, leafOutline, flag } from 'ionicons/icons';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonButton,
  ]
})
export class PlannerPage implements OnInit {
  gardenId: number | undefined;
  tasks: Task[] = [];
  plants: Plant[] = [];
  plantsInGarden: PlantsInGarden[] = [];
  selectedSegment = 'tasks';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private plantService = inject(PlantService);
  private plantsInGardenService = inject(PlantsInGardenService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({leafOutline,add,addOutline,flag});
  }

  ngOnInit() {
    this.gardenId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTasks();
    this.loadPlants();
  }

  async loadTasks() {
    const allTasks = this.localStorageService.getTasks();
    this.tasks = allTasks.filter(task => task.garden_id === this.gardenId);
  }

  async loadPlants() {
    if (this.gardenId !== undefined) {
      this.plantsInGarden = await this.plantsInGardenService.getPlantsInGarden(this.gardenId);
      const plantsArray = await Promise.all(
        this.plantsInGarden.map(pig => this.plantService.getPlantById(pig.plant_id))
      );
      this.plants = plantsArray.flat().filter((plant): plant is Plant => plant !== null);
    }
  }

  async openTaskDetails(task?: Task) {
    const alert = await this.alertCtrl.create({
      header: task ? 'Edit Task' : 'New Task',
      inputs: [
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Task Notes',
          value: task?.notes
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: task ? 'Delete' : 'Save',
          handler: (data) => {
            if (task) {
              this.confirmDeleteTask(task);
            } else {
              this.saveTask(data);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteTask(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteTask(task);
          }
        }
      ]
    });

    await alert.present();
  }

  async saveTask(data: any) {
    if (this.gardenId === undefined) {
      throw new Error('Garden ID is undefined');
    }

    const newTask: Task = {
      id: Date.now(),
      notes: data.notes,
      created_at: new Date().toISOString(),
      garden_id: this.gardenId
    };

    const allTasks = this.localStorageService.getTasks();
    allTasks.push(newTask);
    this.localStorageService.saveTasks(allTasks);
    this.loadTasks();
  }

  deleteTask(task: Task) {
    const allTasks = this.localStorageService.getTasks();
    const updatedTasks = allTasks.filter(t => t.id !== task.id);
    this.localStorageService.saveTasks(updatedTasks);
    this.loadTasks();
  }

  async openPlantDetails(plant?: Plant) {
    const modal = await this.modalCtrl.create({
      component: PlantDetailsComponent,
      componentProps: {
        plant: plant,
        gardenId: this.gardenId
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.success) {
      this.loadPlants();
    }
  }
}