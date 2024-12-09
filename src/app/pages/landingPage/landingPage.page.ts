import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonIcon 
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { leafOutline, logInOutline, personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: 'landingPage.page.html',
  styleUrls: ['landingPage.page.scss'],
  standalone: true,
  imports: [

    IonContent, 
    IonButton,
    IonIcon,
    RouterLink
  ],
})
export class LandingPage {
  constructor() {}

  // Icons
  leafIcon = leafOutline;
  logInIcon = logInOutline;
  personAddIcon = personAddOutline;
}