import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-katalog',
  templateUrl: 'katalog.page.html',
  styleUrls: ['katalog.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent ],
})
export class Tab3Page {
  constructor() {}
}
