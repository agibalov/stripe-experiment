import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

@Component({
    template: `
<h1>Sign In</h1>

<form (ngSubmit)="signIn()">
    <fieldset [disabled]="wip">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" placeholder="email" name="email" [(ngModel)]="email">
        </div>
        <button type="submit" class="btn btn-default">Sign In</button>
    </fieldset>
</form>
`
})
export class SignInPageComponent {
    wip: boolean;
    email: string = '';

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) {
    }

    async signIn(): Promise<void> {
        this.wip = true;
        try {
            await this.authenticationService.signIn({
                email: this.email
            });

            this.router.navigate(['/account']);
        } finally {
            this.wip = false;
        }
    }
}
