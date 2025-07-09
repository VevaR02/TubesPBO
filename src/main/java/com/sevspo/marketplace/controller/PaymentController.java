package com.sevspo.marketplace.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sevspo.marketplace.model.OrderStatus;
import com.sevspo.marketplace.service.OrderService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private OrderService orderService;

    
    @PostMapping("/create-transaction")
    public ResponseEntity<?> createPaymentTransaction(@RequestBody Map<String, Long> payload) {
        Long orderId = payload.get("orderId");
        
        String fakeTransactionId = "sevspo-tx-" + UUID.randomUUID().toString();
        String fakePaymentUrl = "http://localhost:3000/payment-status?order_id=" + orderId + "&transaction_id=" + fakeTransactionId + "&status=pending";

       
        return ResponseEntity.ok(Map.of("paymentUrl", fakePaymentUrl));
    }

   
    @PostMapping("/notification")
    public ResponseEntity<String> handlePaymentNotification(@RequestBody Map<String, String> notification) {
        String orderIdStr = notification.get("order_id");
        String status = notification.get("transaction_status");

        System.out.println("Menerima notifikasi untuk Order ID: " + orderIdStr + " dengan status: " + status);

        if (orderIdStr != null && "settlement".equalsIgnoreCase(status)) {
            
            Long orderId = Long.parseLong(orderIdStr);
            orderService.updateOrderStatus(orderId, OrderStatus.PAID.name());
            System.out.println("Order ID: " + orderId + " status diperbarui menjadi PAID.");
        }

        return ResponseEntity.ok("Notification received.");
    }
}
