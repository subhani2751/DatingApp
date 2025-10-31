import { Routes } from '@angular/router';
import { Home } from '../Features/home/home';
import { MemberList } from '../Features/Members/member-list/member-list';
import { MemberDetailed } from '../Features/Members/member-detailed/member-detailed';
import { Lists } from '../Features/lists/lists';
import { Messages } from '../Features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';

export const routes: Routes = [
    {path:'', component: Home},
    {
        path:"",
        runGuardsAndResolvers:'always',
        canActivate: [authGuard],
        children:[
                {path:'Members', component: MemberList, canActivate: [authGuard] },
                {path:'Members/:id', component: MemberDetailed},
                {path:'lists', component: Lists},
                {path:'messages', component: Messages},
        ]
    },
    {path:'**', component: Home},
];
