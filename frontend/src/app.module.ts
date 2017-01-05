import {NgModule, Inject, OnInit} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from "@angular/core";
import {HttpModule, Http} from "@angular/http";

interface Config {
    stripePublishableKey: string;
}

@Component({
    selector: 'app',
    template: `
<nav class="navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Dummy</a>
        </div>
    </div>
</nav>
<div class="container">
    <button type="button" (click)="deploy()">Deploy</button>
    <button type="button" (click)="undeploy()">Undeploy</button>
    <button type="button" (click)="subscribe()">Subscribe</button>
</div>
`
})
class AppComponent implements OnInit {
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
        }, async (status: number, response: StripeTokenResponse) => {
            console.log(status, response);
            if(status == 200) {
                const token = response.id;

                const response2 = await this.http.post('/api/signup', {
                    token: token
                }).toPromise();
                console.log(response2);
            }
        });
    }
}

@NgModule({
    imports: [ BrowserModule, HttpModule ],
    declarations: [
        AppComponent
    ],
    providers: [ ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
