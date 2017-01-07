package me.loki2302;

import com.stripe.exception.*;
import com.stripe.model.Event;
import com.stripe.net.APIResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class DummyController {
    private final static Logger LOGGER = LoggerFactory.getLogger(DummyController.class);

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private UserRepository userRepository;

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

    @RequestMapping("/webhook")
    public ResponseEntity webhook(@RequestBody String json) throws CardException, APIException, AuthenticationException, InvalidRequestException, APIConnectionException {
        Event event = APIResource.GSON.fromJson(json, Event.class);
        Event event2 = Event.retrieve(event.getId());
        LOGGER.info("Got event type={} {}", event.getType(), event);
        LOGGER.info("Got event2 type={} {}", event2.getType(), event2);
        return ResponseEntity.ok("Good!");
    }

    @PostMapping(path = "/sign-in")
    public ResponseEntity signIn(@Valid @RequestBody SignInRequestDto requestDto) {
        LOGGER.info("Got sign-in request, email={}", requestDto.email);

        String email = requestDto.email;
        User user = userRepository.findByEmail(email);
        if(user == null) {
            return ResponseEntity.badRequest().body("User not registered");
        }

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                email,
                "",
                AuthorityUtils.NO_AUTHORITIES);
        SecurityContextHolder.getContext().setAuthentication(token);

        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/sign-up")
    public ResponseEntity signUp(@Valid @RequestBody SignUpRequestDto requestDto) {
        LOGGER.info("Got sign-up request, email={}, token={}, plan={}", requestDto.email, requestDto.token, requestDto.plan);

        String email = requestDto.email;
        User user = userRepository.findByEmail(email);
        if(user != null) {
            return ResponseEntity.badRequest().body("User already registered");
        }

        String stripeCustomerId = stripeService.createCustomer("andrey.agibalov@gmail.com");
        stripeService.setCustomerSource(stripeCustomerId, requestDto.token);
        stripeService.subscribeCustomerToPlan(requestDto.plan, stripeCustomerId);

        user = new User();
        user.email = email;
        user.stripeCustomerId = stripeCustomerId;
        user = userRepository.save(user);

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                email,
                "",
                AuthorityUtils.NO_AUTHORITIES);
        SecurityContextHolder.getContext().setAuthentication(token);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(path = "/sign-out")
    public void signOut() {
        SecurityContextHolder.clearContext();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(path = "/me")
    public ResponseEntity getMe() {
        String email = (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email);
        MeDto meDto = new MeDto();
        meDto.email = user.email;
        meDto.stripeCustomerId = user.stripeCustomerId;
        return ResponseEntity.ok(meDto);
    }
}
