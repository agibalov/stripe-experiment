import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

export interface ConfigDto {
    stripePublishableKey: string;
}

@Injectable()
export class StripeService {
    private initialized: boolean = false;

    constructor(private http: Http) {
    }

    async createToken(tokenData: StripeTokenData): Promise<string> {
        await this.initializeIfNotInitialized();

        const token = await new Promise<string>((resolve, reject) => {
            Stripe.card.createToken(tokenData, async(status: number, response: StripeTokenResponse) => {
                // TODO: what's the correct way to learn if everything is OK or not?
                console.log(response);
                if (status == 200) {
                    resolve(response.id);
                } else {
                    reject(response);
                }
            });
        });

        console.log(`Got token: ${token}`);

        return token;
    }

    private async initializeIfNotInitialized(): Promise<void> {
        if(!this.initialized) {
            const configResponse = await this.http.get('/api/config').toPromise();
            const config = <ConfigDto>configResponse.json();
            const stripePublishableKey = config.stripePublishableKey;
            Stripe.setPublishableKey(stripePublishableKey);
            this.initialized = true;
        }
    }
}
