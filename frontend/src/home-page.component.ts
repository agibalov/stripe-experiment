import {Http} from "@angular/http";
import {Component} from "@angular/core";

@Component({
    template: `
<h1>Home</h1>

<button type="button" (click)="deploy()" class="btn btn-default">Deploy</button>
<button type="button" (click)="undeploy()" class="btn btn-default">Undeploy</button>
`
})
export class HomePageComponent {
    constructor(private http: Http) {
    }

    async deploy(): Promise<void> {
        const response = await this.http.post('/api/deploy', null).toPromise();
        console.log(response);
    }

    async undeploy(): Promise<void> {
        const response = await this.http.post('/api/undeploy', null).toPromise();
        console.log(response);
    }
}
