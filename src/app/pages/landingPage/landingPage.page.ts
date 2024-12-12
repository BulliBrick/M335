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
import { addIcons } from 'ionicons';

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
  constructor() {
      addIcons({leafOutline,logInOutline,personAddOutline});}

  // Icons
  leafIcon = leafOutline;
  logInIcon = logInOutline;
  personAddIcon = personAddOutline;
}