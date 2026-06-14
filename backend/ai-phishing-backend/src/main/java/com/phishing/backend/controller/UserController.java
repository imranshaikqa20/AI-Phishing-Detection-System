package com.phishing.backend.controller;

import com.phishing.backend.entity.User;
import com.phishing.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // UPGRADE USER TO PRO PLAN
    @PutMapping("/{id}/upgrade")
    public ResponseEntity<?> upgradeToPro(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "User not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            User user = userOptional.get();

            // Flip the premium subscription status flag
            user.setPro(true);
            userRepository.save(user);

            // Construct polished response layout matching your dashboard needs
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Congratulations " + user.getName() + ", you have successfully upgraded to Pro!");
            response.put("isPro", user.isPro());
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred during upgrade: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/upgrade-session")
    public ResponseEntity<?> createStripeSession(@PathVariable Long id) {
        try {
            // Build Stripe parameters for a one-time $10 USD premium upgrade
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/dashboard?payment=success&userId=" + id)
                    .setCancelUrl("http://localhost:3000/dashboard?payment=cancel")
                    .addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(1000L) // Amount in cents ($10.00)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Anti-Phishing Shield Pro Plan")
                                            .setDescription("Unlocks unlimited daily AI scanning updates.")
                                            .build())
                                    .build())
                            .build())
                    .build();

            // Generate the official session with Stripe's cloud API
            Session session = Session.create(params);
            // Pass the secure URL back to the frontend
            return ResponseEntity.ok(Map.of("checkoutUrl", session.getUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}