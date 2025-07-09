package com.sevspo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sevspo.marketplace.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
