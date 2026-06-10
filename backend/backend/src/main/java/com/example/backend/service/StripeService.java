package com.example.backend.service;

import com.example.backend.model.PlanType;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class StripeService {

    @Value("${stripe.secret.key:}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret:}")
    private String webhookSecret;

    @Value("${stripe.price.pro.monthly:}")
    private String proPriceId;

    @Value("${stripe.price.premium.monthly:}")
    private String premiumPriceId;

    private final UserRepository userRepository;

    public StripeService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        System.out.println("=== STRIPE CONFIG ===");
        System.out.println("Secret Key present: " + (stripeSecretKey != null && !stripeSecretKey.isEmpty()));
        System.out.println("Webhook Secret present: " + (webhookSecret != null && !webhookSecret.isEmpty()));
        System.out.println("Pro Price ID: " + proPriceId);
        System.out.println("Premium Price ID: " + premiumPriceId);
        System.out.println("=====================");
        
        if (stripeSecretKey == null || stripeSecretKey.isEmpty()) {
            System.err.println("ERROR: STRIPE_SECRET_KEY no está configurada. Stripe no funcionará.");
        } else {
            Stripe.apiKey = stripeSecretKey;
        }
    }

    public String createCheckoutSession(String plan, String email) throws Exception {
        String priceId;
        switch (plan.toLowerCase()) {
            case "pro":
                priceId = proPriceId;
                break;
            case "premium":
                priceId = premiumPriceId;
                break;
            default:
                throw new RuntimeException("Plan no válido: " + plan);
        }

        if (priceId == null || priceId.isEmpty()) {
            throw new RuntimeException("Price ID no configurado para el plan: " + plan + 
                ". ProPriceId=[" + proPriceId + "] PremiumPriceId=[" + premiumPriceId + "]");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = userOpt.get();
        String customerId = user.getStripeCustomerId();

        if (customerId == null) {
            Customer customer = Customer.create(
                new com.stripe.param.CustomerCreateParams.Builder()
                    .setEmail(email)
                    .build()
            );
            customerId = customer.getId();
            user.setStripeCustomerId(customerId);
            userRepository.save(user);
        }

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setCustomer(customerId)
            .setSuccessUrl("https://www.mockagentai.com/?success=true&session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl("https://www.mockagentai.com/pricing?canceled=true")
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice(priceId)
                    .setQuantity(1L)
                    .build()
            )
            .putMetadata("userId", String.valueOf(user.getId()))
            .putMetadata("plan", plan)
            .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    public void handleWebhook(String payload, String sigHeader) throws Exception {
        if (webhookSecret == null || webhookSecret.isEmpty()) {
            return;
        }

        Event event = com.stripe.net.Webhook.constructEvent(payload, sigHeader, webhookSecret);

        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutCompleted(event);
                break;
            case "invoice.payment_succeeded":
                handlePaymentSucceeded(event);
                break;
            case "customer.subscription.deleted":
                handleSubscriptionDeleted(event);
                break;
        }
    }

    private void handleCheckoutCompleted(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
        if (session != null) {
            String userId = session.getMetadata().get("userId");
            String plan = session.getMetadata().get("plan");
            
            if (userId != null) {
                userRepository.findById(Long.parseLong(userId)).ifPresent(user -> {
                    user.setPlan(PlanType.valueOf(plan.toUpperCase()));
                    userRepository.save(user);
                });
            }
        }
    }

    private void handlePaymentSucceeded(Event event) {
        // Actualizar fecha de renovación o similar
    }

    private void handleSubscriptionDeleted(Event event) {
        com.stripe.model.Subscription subscription = (com.stripe.model.Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
        if (subscription != null) {
            String customerId = subscription.getCustomer();
            userRepository.findByStripeCustomerId(customerId).ifPresent(user -> {
                user.setPlan(PlanType.STARTER);
                userRepository.save(user);
            });
        }
    }

    public Map<String, Object> getConfigInfo() {
        return Map.of(
            "secretKeyConfigured", stripeSecretKey != null && !stripeSecretKey.isEmpty(),
            "webhookSecretConfigured", webhookSecret != null && !webhookSecret.isEmpty(),
            "proPriceId", proPriceId != null ? proPriceId : "",
            "premiumPriceId", premiumPriceId != null ? premiumPriceId : "",
            "stripeApiKeyPrefix", stripeSecretKey != null ? stripeSecretKey.substring(0, Math.min(20, stripeSecretKey.length())) : ""
        );
    }

    public Map<String, Object> testStripeConnection() throws Exception {
        try {
            // Intentar recuperar el Price object de Stripe
            com.stripe.model.Price price = com.stripe.model.Price.retrieve(proPriceId);
            return Map.of(
                "success", true,
                "priceId", price.getId(),
                "productId", price.getProduct(),
                "amount", price.getUnitAmount()
            );
        } catch (com.stripe.exception.StripeException e) {
            return Map.of(
                "success", false,
                "error", e.getMessage(),
                "errorCode", e.getCode() != null ? e.getCode() : "unknown",
                "stripeApiKeyPrefix", stripeSecretKey != null ? stripeSecretKey.substring(0, Math.min(20, stripeSecretKey.length())) : ""
            );
        }
    }
}
