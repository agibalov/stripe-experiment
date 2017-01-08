import {Response, Http} from "@angular/http";
import {RouterStateSnapshot, ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable} from "@angular/core";

export interface MeDto {
    email: string;
    stripeCustomerId: string;
};

@Injectable()
export class AccountResolver implements Resolve<MeDto> {
    constructor(private http: Http) {
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<MeDto> {
        try {
            const response = await this.http.get('/api/me').toPromise();
            console.log('Got successful response', response);

            const meDto = <MeDto>response.json();
            return meDto;
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
