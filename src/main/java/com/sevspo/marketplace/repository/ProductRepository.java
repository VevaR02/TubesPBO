package com.sevspo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sevspo.marketplace.model.Product;

// PERBAIKAN: Menambahkan JpaSpecificationExecutor untuk query dinamis
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
}
