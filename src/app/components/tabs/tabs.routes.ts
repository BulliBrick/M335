import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../pages/dashboard/dashboard.page').then((m) => m.DashboardComponent),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../../pages/planner/planner.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../../pages/katalog/katalog.page').then((m) => m.Tab3Page),
      },
      {
        path: 'landingPage',
        loadComponent: () =>
          import('../../pages/landingPage/landingPage.page').then((m) => m.LandingPage),
      },
      {
        path: '',
        redirectTo: 'tabs/landingPage',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/landingPage',
    pathMatch: 'full',
  },
];
