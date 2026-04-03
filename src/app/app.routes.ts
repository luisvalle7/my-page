import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TelevisionsComponent } from './pages/televisions/televisions.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RemotesComponent } from './pages/remotes/remotes.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'televisions', component: TelevisionsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'remotes', component: RemotesComponent},
    {path: '**', redirectTo: ''} 
];