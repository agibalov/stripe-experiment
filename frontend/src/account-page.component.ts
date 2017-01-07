import {Component, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";

export interface MeDto {
    email: string;
    stripeCustomerId: string;
};

@Component({
    template: `
<h1>Account</h1>
<p>Email: {{email}}</p>
<p>Stripe customer ID: {{stripeCustomerId}}</p>
`
})
export class AccountPageComponent implements OnInit {
    email: string = '';
    stripeCustomerId: string = '';

    constructor(private http: Http) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const response = await this.http.get('/api/me').toPromise();
            console.log('Got successful response', response);

            const meDto = <MeDto>response.json();
            this.email = meDto.email;
            this.stripeCustomerId = meDto.stripeCustomerId;
        } catch(e) {
            if (e instanceof Response) {
                const response = <Response>e;
                console.log('Got error response', response.status);
            } else {
                throw e;
            }
        }
    }
}
