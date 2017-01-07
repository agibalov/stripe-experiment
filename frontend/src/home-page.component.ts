import {Http} from "@angular/http";
import {Component} from "@angular/core";
import {StripeService} from "./stripe.service";

@Component({
    template: `
<h1>Home</h1>

<button type="button" (click)="deploy()" class="btn btn-default">Deploy</button>
<button type="button" (click)="undeploy()" class="btn btn-default">Undeploy</button>
<button type="button" (click)="subscribe()" class="btn btn-default">Subscribe</button>
`
})
export class HomePageComponent /*implements OnInit*/ {
    constructor(private http: Http, private stripeService: StripeService) {
    }

    async deploy(): Promise<void> {
        const response = await this.http.post('/api/deploy', null).toPromise();
        console.log(response);
    }

    async undeploy(): Promise<void> {
        const response = await this.http.post('/api/undeploy', null).toPromise();
        console.log(response);
    }

    async subscribe(): Promise<void> {
        // Test cards here: https://stripe.com/docs/testing#cards
        const token = this.stripeService.createToken({
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2018,
            cvc: '123'
        });

        const response = await this.http.post('/api/signup', {
            token: token
        }).toPromise();
        console.log(response);
    }
}
