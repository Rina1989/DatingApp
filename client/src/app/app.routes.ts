import { Routes } from '@angular/router';
import { AccountService } from '../Core/services/account-service';
import { Home } from '../Features/home/home';
import { MemberList } from '../Features/members/member-list/member-list';
import { MemberDetailed } from '../Features/members/member-detailed/member-detailed';
import { Lists } from '../Features/lists/lists';
import { Messages } from '../Features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';

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
    { path: '**', component: Home },
];


// export const routes: Routes = [

//     { path: '', component: Home },
//     { path: 'members', component: MemberList,canActivate:[authGuard] },
//     { path: 'members/:id', component: MemberDetailed },
//     { path: 'lists', component: Lists },
//     { path: 'messages', component: Messages },
//     { path: '**', component: Home },
// ];
