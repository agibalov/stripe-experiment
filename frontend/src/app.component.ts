import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app',
    template: `
<nav class="navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Dummy</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['']">Home</a></li>
                <li *ngIf="!authenticationService.isAuthenticated" [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['sign-in']">Sign In</a></li>
                <li *ngIf="!authenticationService.isAuthenticated" [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['sign-up']">Sign Up</a></li>
                <li *ngIf="authenticationService.isAuthenticated" [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['account']">Account</a></li>
            </ul>
            <form class="navbar-form navbar-right" (ngSubmit)="signOut()" *ngIf="authenticationService.isAuthenticated">
                <fieldset [disabled]="wip">
                    <div class="form-group">
                        <button type="submit" class="btn btn-default">Sign Out</button>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</nav>
<div class="container">
    <router-outlet></router-outlet>
</div>
`
})
export class AppComponent implements OnInit {
    wip: boolean;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) {
    }

    async ngOnInit(): Promise<void> {
        await this.authenticationService.check();
    }

    async signOut(): Promise<void> {
        this.wip = true;
        try {
            await this.authenticationService.signOut();
            this.router.navigate(['/']);
        } finally {
            this.wip = false;
        }
    }
}
