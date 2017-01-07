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
import org.springframework.security.core.Authentication;
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

    @PostMapping(path = "/signup")
    public ResponseEntity signUp(@RequestBody SignUpRequestDto signUpRequestDto) {
        LOGGER.info("Got sign-up request! token={}", signUpRequestDto.token);

        String customerId = stripeService.createCustomer("andrey.agibalov@gmail.com");
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

    @PostMapping(path = "/sign-in")
    public ResponseEntity signIn(@Valid @RequestBody AppSignInRequestDto requestDto) {
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

    @PostMapping(path = "/sign-up2")
    public ResponseEntity signUp2(@Valid @RequestBody AppSignUpRequestDto requestDto) {
        LOGGER.info("Got sign-up request, email={}, token={}, plan={}", requestDto.email, requestDto.token, requestDto.plan);

        String email = requestDto.email;
        User user = userRepository.findByEmail(email);
        if(user != null) {
            return ResponseEntity.badRequest().body("User already registered");
        }

        user = new User();
        user.email = email;
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
        return ResponseEntity.ok(meDto);
    }

    @GetMapping(path = "/insecure")
    public String insecure() {
        return "I am insecure";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(path = "/secure")
    public String secure() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return "I am secure: " + authentication.getPrincipal();
    }
}
