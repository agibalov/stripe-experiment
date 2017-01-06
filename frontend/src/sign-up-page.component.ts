import {Component} from "@angular/core";
import {Http, Response} from "@angular/http";

@Component({
    template: `
<h1>Sign Up</h1>

<form (ngSubmit)="signUp()">
    <fieldset [disabled]="wip">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" placeholder="email" name="email" [(ngModel)]="email">
        </div>
        <div class="radio">
            <label>
                <input type="radio" name="plan" [(ngModel)]="plan" [value]="'free'" checked>
                Free
            </label>
        </div>
        <div class="radio">
            <label>
                <input type="radio" name="plan" [(ngModel)]="plan" [value]="'elite'" checked>
                Elite
            </label>
        </div>
        <button type="submit" class="btn btn-default">Sign Up</button>
    </fieldset>
</form>
`
})
export class SignUpPageComponent {
    wip: boolean;
    email: String = '';
    plan: String = 'free';

    constructor(private http: Http) {
    }

    async signUp(): Promise<void> {
        this.wip = true;
        try {
            console.log({
                email: this.email,
                plan: this.plan
            });
            const response = await this.http.post('/api/sign-up2', {
                email: this.email,
                plan: this.plan
            }).toPromise();
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
