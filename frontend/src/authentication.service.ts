import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";

@Injectable()
export class AuthenticationService {
    isAuthenticated: boolean = false;

    constructor(private http: Http) {
    }

    async check(): Promise<void> {
        try {
            await this.http.get('/api/me').toPromise();
            this.isAuthenticated = true;
        } catch(e) {
            this.isAuthenticated = false;
        }
    }

    async signUp(details: {
        email: string,
        token: string,
        plan: string
    }): Promise<void> {
        try {
            const response = await this.http.post('/api/sign-up', {
                email: details.email,
                token: details.token,
                plan: details.plan
            }).toPromise();
            console.log('Got successful response', response);
            this.isAuthenticated = true;
        } catch(e) {
            if (e instanceof Response) {
                const response = <Response>e;
                console.log('Got error response', response.status);
            } else {
                throw e;
            }
        }
    }

    async signIn(details: {
        email: string
    }): Promise<void> {
        try {
            const response = await this.http.post('/api/sign-in', {
                email: details.email
            }).toPromise();
            console.log('Got successful response', response);
            this.isAuthenticated = true;
        } catch(e) {
            if (e instanceof Response) {
                const response = <Response>e;
                console.log('Got error response', response.status);
            } else {
                throw e;
            }
        }
    }

    async signOut(): Promise<void> {
        try {
            const response = await this.http.post('/api/sign-out', null).toPromise();
            console.log('Got successful response', response);
            this.isAuthenticated = false;
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
