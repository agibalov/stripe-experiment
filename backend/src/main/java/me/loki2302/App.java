package me.loki2302;

import com.stripe.Stripe;
import com.stripe.exception.*;
import com.stripe.model.*;
import com.stripe.net.APIResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Autowired
    private StripeService stripeService;

    @RestController
    public static class DummyController {
        private final static Logger LOGGER = LoggerFactory.getLogger(DummyController.class);

        @Value("${stripe.publishable.key}")
        private String stripePublishableKey;

        @Autowired
        private StripeService stripeService;

        @GetMapping(path = "/config")
        public ResponseEntity getConfig() {
            ConfigDto configDto = new ConfigDto();
            configDto.stripePublishableKey = stripePublishableKey;
            return ResponseEntity.ok(configDto);
        }

        @PostMapping(path = "/deploy")
        public ResponseEntity deploy() {
            stripeService.createPlans();
            return ResponseEntity.ok().build();
        }

        @PostMapping(path = "/undeploy")
        public ResponseEntity undeploy() {
            stripeService.cleanUp();
            return ResponseEntity.ok().build();
        }

        @PostMapping(path = "/signup")
        public ResponseEntity signUp(@RequestBody SignUpRequestDto signUpRequestDto) {
            LOGGER.info("Got sign-up request! token={}", signUpRequestDto.token);

            String customerId = stripeService.createCustomer();
            stripeService.setCustomerSource(customerId, signUpRequestDto.token);
            stripeService.subscribeCustomerToPlan("plan-elite", customerId);

            return ResponseEntity.ok().build();
        }

        @RequestMapping("/webhook")
        public ResponseEntity webhook(@RequestBody String json) throws CardException, APIException, AuthenticationException, InvalidRequestException, APIConnectionException {
            Event event = APIResource.GSON.fromJson(json, Event.class);
            Event event2 = Event.retrieve(event.getId());
            LOGGER.info("Got event type={} {}", event.getType(), event);
            LOGGER.info("Got event2 type={} {}", event2.getType(), event2);
            return ResponseEntity.ok("Good!");
        }
    }

    public static class SignUpRequestDto {
        public String token;
    }

    public static class ConfigDto {
        public String stripePublishableKey;
    }

    @Service
    public static class StripeService {
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

        public String createCustomer() {
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
                customerParameters.put("email", "andrey.agibalov@gmail.com");
                //customerParameters.put("source", source);
                Customer customer = Customer.create(customerParameters);
                LOGGER.info("Created a customer: {}", customer);

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
}
