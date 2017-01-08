import {Component, OnInit, Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MeDto} from "./account-resolver.service";

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

    constructor(private route: ActivatedRoute) {
    }

    async ngOnInit(): Promise<void> {
        this.route.data.subscribe((data: { meDto: MeDto }) => {
            this.email = data.meDto.email;
            this.stripeCustomerId = data.meDto.stripeCustomerId;
        });

        /*
        // why does this not work?
        const data = await this.route.data.toPromise();
        console.log('data');
        */
    }
}
