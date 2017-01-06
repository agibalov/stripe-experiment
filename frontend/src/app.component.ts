import {Component} from "@angular/core";
import {Http, Response} from "@angular/http";

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
                <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['sign-in']">Sign In</a></li>
                <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['sign-up']">Sign Up</a></li>
            </ul>
            <form class="navbar-form navbar-right" (ngSubmit)="signOut()">
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
export class AppComponent {
    wip: boolean;

    constructor(private http: Http) {
    }

    async signOut(): Promise<void> {
        this.wip = true;
        try {
            const response = await this.http.post('/api/sign-out', null).toPromise();
            console.log('Got successful response', response);
        } catch(e) {
            if (e instanceof Response) {
                const response = <Response>e;
                console.log('Got error response', response.status);
            } else {
                throw e;
            }
        } finally {
            this.wip = false;
        }
    }
}
