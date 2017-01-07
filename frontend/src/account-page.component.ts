import {Component, OnInit} from "@angular/core";
import {Http, Response} from "@angular/http";

@Component({
    template: `
<h1>Account</h1>
<p>Email: {{email}}</p>
`
})
export class AccountPageComponent implements OnInit {
    email: String = '';

    constructor(private http: Http) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const response = await this.http.get('/api/me').toPromise();
            console.log('Got successful response', response);

            this.email = response.json().email;
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
