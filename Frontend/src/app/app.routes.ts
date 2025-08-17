import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreationSeance } from './pages/creation-seance/creation-seance';
import { ProfilComponent } from './pages/profil/profil';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { SeanceEnCours } from './pages/seance-en-cours/seance-en-cours';
import { SeancesEnregistrees } from './pages/seances-enregistrees/seances-enregistrees';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [GuestGuard]
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'creation-seance', component: CreationSeance },
      { path: 'profil', component: ProfilComponent },
      { path: 'seance-en-cours', component: SeanceEnCours },
      { path: 'seances-enregistrees', component: SeancesEnregistrees },
      // Ajoute ici d'autres pages
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
