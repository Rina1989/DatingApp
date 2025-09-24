import { Routes } from '@angular/router';
import { AccountService } from '../Core/services/account-service';
import { Home } from '../Features/home/home';
import { MemberList } from '../Features/members/member-list/member-list';
import { MemberDetailed } from '../Features/members/member-detailed/member-detailed';
import { Lists } from '../Features/lists/lists';
import { Messages } from '../Features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';
import { TestErrors } from '../Features/test-errors/test-errors';
import { NotFound } from '../Shared/errors/not-found/not-found';
import { ServerError } from '../Shared/errors/server-error/server-error';

export const routes: Routes = [

    { path: '', component: Home },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberList, canActivate: [authGuard] },
            { path: 'members/:id', component: MemberDetailed },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    },
    {path:'errors',component:TestErrors},
    {path:'sever-error',component:ServerError},
    { path: '**', component: NotFound },
];


// export const routes: Routes = [

//     { path: '', component: Home },
//     { path: 'members', component: MemberList,canActivate:[authGuard] },
//     { path: 'members/:id', component: MemberDetailed },
//     { path: 'lists', component: Lists },
//     { path: 'messages', component: Messages },
//     { path: '**', component: Home },
// ];
