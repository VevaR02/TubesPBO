package com.sevspo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sevspo.marketplace.model.CarouselItem;

public interface CarouselItemRepository extends JpaRepository<CarouselItem, Long> {

    List<CarouselItem> findAllByIsActiveTrue();
}
