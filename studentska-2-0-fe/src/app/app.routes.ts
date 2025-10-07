import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { authGuard, roleGuard } from './services';
import { Shell } from './features/shell/shell';
import { Welcome } from './features/welcome/welcome';
import { PrijavaIspita } from './features/prijava-ispita/prijava-ispita';
import { UzimanjePotvrde } from './features/uzimanje-potvrde/uzimanje-potvrde';
import { PredmetiAdmin } from './features/predmeti-admin/predmeti-admin';

export const routes: Routes = [
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },

	{
		path: 'app',
		component: Shell,
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'welcome' },
			{ path: 'welcome', component: Welcome },
			{ path: 'prijava-ispita', component: PrijavaIspita },
			{ path: 'uzimanje-potvrde', component: UzimanjePotvrde },
			{ path: 'predmeti-admin', component: PredmetiAdmin, canActivate: [roleGuard], data: { roles: ['admin'] } },
		],
	},

	{ path: '', pathMatch: 'full', redirectTo: 'app' },
	{ path: '**', redirectTo: 'app' },
];
