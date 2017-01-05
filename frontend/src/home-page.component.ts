import {Http} from "@angular/http";
import {OnInit, Component} from "@angular/core";

interface Config {
    stripePublishableKey: string;
}

@Component({
    template: `
<h1>I am home page component</h1>
<button type="button" (click)="deploy()" class="btn btn-default">Deploy</button>
<button type="button" (click)="undeploy()" class="btn btn-default">Undeploy</button>
<button type="button" (click)="subscribe()" class="btn btn-default">Subscribe</button>
`
})
export class HomePageComponent implements OnInit {
    constructor(private http: Http) {
    }

    async ngOnInit(): Promise<void> {
        const response = await this.http.get('/api/config').toPromise();
        const config = <Config>response.json();
        var stripePublishableKey = config.stripePublishableKey;
        console.log(`Got stripePublishableKey=${stripePublishableKey}`);
        Stripe.setPublishableKey(stripePublishableKey);
    }

    async deploy(): Promise<void> {
        const response = await this.http.post('/api/deploy', null).toPromise();
        console.log(response);
    }

    async undeploy(): Promise<void> {
        const response = await this.http.post('/api/undeploy', null).toPromise();
        console.log(response);
    }

    subscribe(): void {
        // https://stripe.com/docs/testing#cards
        Stripe.card.createToken({
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2018,
            cvc: '123'
        }, async(status: number, response: StripeTokenResponse) => {
            console.log(status, response);
            if (status == 200) {
                const token = response.id;

                const response2 = await this.http.post('/api/signup', {
                    token: token
                }).toPromise();
                console.log(response2);
            }
        });
    }
}
