package com.sevspo.marketplace.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sevspo.marketplace.dto.OrderRequest;
import com.sevspo.marketplace.dto.UpdateStatusRequestDTO;
import com.sevspo.marketplace.model.Order;
import com.sevspo.marketplace.service.OrderService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Endpoint untuk membuat pesanan (sudah ada)
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            String username = authentication.getName();
            Order createdOrder = orderService.createOrder(orderRequest, username);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- ENDPOINT BARU UNTUK RIWAYAT PESANAN PENGGUNA ---
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Order>> getCurrentUserOrders(Authentication authentication) {
        String username = authentication.getName();
        List<Order> orders = orderService.findOrdersByUsername(username);
        return ResponseEntity.ok(orders);
    }

    // --- ENDPOINT BARU UNTUK MANAJEMEN PESANAN ADMIN ---
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')") // <-- INI PENTING UNTUK KEAMANAN!
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateStatusRequestDTO request) {
        try {
            orderService.updateOrderStatus(orderId, request.getStatus());
            return ResponseEntity.ok("Status pesanan berhasil diperbarui.");
        } catch (IllegalArgumentException e) {
            // Ini terjadi jika status yang dikirim tidak ada di Enum OrderStatus
            return ResponseEntity.badRequest().body("Error: Status tidak valid.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
