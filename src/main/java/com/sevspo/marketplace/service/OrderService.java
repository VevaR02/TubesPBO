package com.sevspo.marketplace.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sevspo.marketplace.dto.OrderRequest;
import com.sevspo.marketplace.model.Order;
import com.sevspo.marketplace.model.OrderItem;
import com.sevspo.marketplace.model.OrderStatus;
import com.sevspo.marketplace.model.Product;
import com.sevspo.marketplace.model.User;
import com.sevspo.marketplace.repository.OrderRepository;
import com.sevspo.marketplace.repository.ProductRepository;
import com.sevspo.marketplace.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan: " + username));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING); // Status awal adalah PENDING
        order.setShippingAddress(orderRequest.getShippingAddress());

        List<OrderItem> orderItems = orderRequest.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produk dengan ID " + itemDto.getProductId() + " tidak ditemukan."));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Stok produk " + product.getName() + " tidak mencukupi.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setOrder(order);

            // Kurangi stok produk
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product); // Simpan perubahan stok

            return orderItem;
        }).collect(Collectors.toList());

        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    // --- FITUR BARU UNTUK PENGGUNA ---
    public List<Order> findOrdersByUsername(String username) {
        return orderRepository.findByUser_UsernameOrderByOrderDateDesc(username);
    }

    // --- FITUR BARU UNTUK ADMIN ---
    public List<Order> findAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String paid) {
        // Cari pesanan berdasarkan ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Error: Pesanan tidak ditemukan dengan id: " + orderId));

        // Ubah String menjadi Enum. Ini akan error jika string tidak valid.
        OrderStatus statusEnum = OrderStatus.valueOf(paid.toUpperCase());

        // Set status baru dan simpan
        order.setStatus(statusEnum);
        return orderRepository.save(order);
    }

    private void restoreStockForOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }
    }
}
