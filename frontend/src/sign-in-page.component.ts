import {Component} from "@angular/core";
import {Http, Response} from "@angular/http";

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
    email: String = '';

    constructor(private http: Http) {
    }

    async signIn(): Promise<void> {
        this.wip = true;
        try {
            console.log({
                email: this.email
            });
            const response = await this.http.post('/api/sign-in', {
                email: this.email
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
