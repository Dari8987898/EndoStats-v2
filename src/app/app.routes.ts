import { Routes } from '@angular/router';

import { AmbulatorioTableComponent } from './tables/ambulatorio/ambulatorio-table.component';
import { DaDecidereTableComponent } from './tables/da-decidere/da-decidere-table.component';
//import { DetailComponent } from './details/detail.component';
import { GmTableComponent } from './tables/gm/gm-table.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'gm-table',
        component: GmTableComponent,
        title: 'Gruppi multidisciplinari'
    },
    {
        path: 'ambulatorio-table',
        component: AmbulatorioTableComponent,
        title: 'Ambulatorio'
    },
    {
        path: 'da-decidere-table',
        component: DaDecidereTableComponent,
        title: '(?)'
    },
    //{
        //path: 'detail/:id',
        //component: DetailComponent,
        //title: "Dettaglio"
    //}
];