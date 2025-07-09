package com.sevspo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sevspo.marketplace.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_UsernameOrderByOrderDateDesc(String username);

    List<Order> findAllByOrderByOrderDateDesc();
}
