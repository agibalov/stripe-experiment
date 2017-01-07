import {Component} from "@angular/core";
import {Http, Response} from "@angular/http";
import {StripeService} from "./stripe.service";

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
                <input type="radio" name="plan" [(ngModel)]="plan" [value]="'plan-free'" checked>
                Free
            </label>
        </div>
        <div class="radio">
            <label>
                <input type="radio" name="plan" [(ngModel)]="plan" [value]="'plan-elite'" checked>
                Elite
            </label>
        </div>
        <div class="form-group">
            <label for="email">Card</label>
            <input type="text" class="form-control" id="card" placeholder="card" name="card" [(ngModel)]="card">
        </div>
        <div class="form-group">
            <label for="expMonth">Exp Month</label>
            <input type="text" class="form-control" id="expMonth" placeholder="expMonth" name="expMonth" [(ngModel)]="expMonth">
        </div>
        <div class="form-group">
            <label for="expYear">Exp Year</label>
            <input type="text" class="form-control" id="expYear" placeholder="expYear" name="expYear" [(ngModel)]="expYear">
        </div>
        <div class="form-group">
            <label for="email">Cvc</label>
            <input type="text" class="form-control" id="cvc" placeholder="cvc" name="cvc" [(ngModel)]="cvc">
        </div>
        <button type="submit" class="btn btn-default">Sign Up</button>
    </fieldset>
</form>
`
})
export class SignUpPageComponent {
    wip: boolean;
    email: string = '';
    plan: string = 'plan-elite';
    card: string = '4242424242424242';
    expMonth: number = 12;
    expYear: number = 2018;
    cvc: string = '123';

    constructor(
        private http: Http,
        private stripeService: StripeService) {
    }

    async signUp(): Promise<void> {
        this.wip = true;
        try {
            const token = await this.stripeService.createToken({
                number: this.card,
                exp_month: this.expMonth,
                exp_year: this.expYear,
                cvc: this.cvc
            });

            const response = await this.http.post('/api/sign-up', {
                email: this.email,
                token: token,
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
