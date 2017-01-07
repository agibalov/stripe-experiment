package me.loki2302;

import com.stripe.Stripe;
import com.stripe.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {
    private final static Logger LOGGER = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public void cleanUp() {
        try {
            SubscriptionCollection subscriptionCollection = Subscription.list(new HashMap<>());
            for(Subscription subscription : subscriptionCollection.autoPagingIterable()) {
                HashMap<String, Object> cancellationParameters = new HashMap<>();
                cancellationParameters.put("at_period_end", false);
                subscription.cancel(cancellationParameters);
            }

            CustomerCollection customerCollection = Customer.list(new HashMap<>());
            for(Customer customer : customerCollection.autoPagingIterable()) {
                customer.delete();
            }

            PlanCollection planCollection = Plan.list(new HashMap<>());
            for (Plan plan : planCollection.autoPagingIterable()) {
                plan.delete();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void createPlans() {
        try {
            if (true) {
                Map<String, Object> planParameters = new HashMap<>();
                planParameters.put("id", "plan-free");
                planParameters.put("name", "Free");
                planParameters.put("amount", 0);
                planParameters.put("currency", "usd");
                planParameters.put("interval", "day");
                Plan plan = Plan.create(planParameters);
                LOGGER.info("Created a plan: {}", plan);
            }

            if (true) {
                Map<String, Object> planParameters = new HashMap<>();
                planParameters.put("id", "plan-elite");
                planParameters.put("name", "Elite");
                planParameters.put("amount", 500); // in cents
                planParameters.put("currency", "usd");
                planParameters.put("interval", "day");
                Plan plan = Plan.create(planParameters);
                LOGGER.info("Created a plan: {}", plan);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String createCustomer(String email) {
        try {
            // for testing only:
            /*Map<String, Object> source = new HashMap<>();
            source.put("object", "card");
            source.put("exp_month", "12");
            source.put("exp_year", "2018");
            source.put("number", "4242424242424242");
            source.put("cvc", "123");*/
            // in production they suggest using Stripe.js which
            // would accept CC number, send it to Stripe and then provide
            // a token in response. This token is safe to keep and transfer, so
            // I will never store any sensitive stuff
            // see https://stripe.com/docs

            Map<String, Object> customerParameters = new HashMap<>();
            customerParameters.put("email", email);
            //customerParameters.put("source", source);
            Customer customer = Customer.create(customerParameters);
            LOGGER.info("Created a customer for {}: {})", email, customer);

            return customer.getId();
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void setCustomerSource(String customerId, String sourceToken) {
        try {
            Map<String, Object> updateParameters = new HashMap<>();
            updateParameters.put("source", sourceToken);
            Customer customer = Customer.retrieve(customerId);
            customer.update(updateParameters);
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void subscribeCustomerToPlan(String planId, String customerId) {
        try {
            Map<String, Object> subscriptionParameters = new HashMap<>();
            subscriptionParameters.put("plan", planId);
            subscriptionParameters.put("customer", customerId);
            Subscription subscription = Subscription.create(subscriptionParameters);
            LOGGER.info("Created subscription: {}", subscription);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
