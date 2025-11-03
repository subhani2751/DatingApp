import { Routes } from '@angular/router';
import { Home } from '../Features/home/home';
import { MemberList } from '../Features/Members/member-list/member-list';
import { MemberDetailed } from '../Features/Members/member-detailed/member-detailed';
import { Lists } from '../Features/lists/lists';
import { Messages } from '../Features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';
import { TestErrors } from '../Features/test-errors/test-errors';
import { NotFound } from '../Shared/errors/not-found/not-found';
import { ServerError } from '../Shared/errors/server-error/server-error';
import { MemberProfile } from '../Features/Members/member-profile/member-profile';
import { MemberPhotos } from '../Features/Members/member-photos/member-photos';
import { MemberMessages } from '../Features/Members/member-messages/member-messages';
import { memberResolver } from '../Features/Members/member-resolver';

export const routes: Routes = [
    {path:'', component: Home},
    {
        path:"",
        runGuardsAndResolvers:'always',
        canActivate: [authGuard],
        children:[
                {path:'Members', component: MemberList },
                {
                    path:'Members/:id', 
                    resolve: {member: memberResolver},
                    runGuardsAndResolvers : 'always',
                    component: MemberDetailed,
                    children:[
                        {path:'',redirectTo: 'profile', pathMatch: 'full' },
                        {path:'profile',component: MemberProfile, title: 'Profile' },
                        {path:'photos',component: MemberPhotos, title: 'Photos' },
                        {path:'messages',component: MemberMessages, title: 'Messages' },
                    ]
                },
                {path:'lists', component: Lists},
                {path:'messages', component: Messages},
        ]
    },
    {path:'errors', component: TestErrors},
    {path:'server-error', component: ServerError},
    {path:'**', component: NotFound},
];
