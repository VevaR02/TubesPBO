package com.sevspo.marketplace.dto;

import java.math.BigDecimal;

class OrderItemResponseDTO {

    private Long id;
    private ProductSummaryDTO product;
    private int quantity;
    private BigDecimal priceAtPurchase;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductSummaryDTO getProduct() {
        return product;
    }

    public void setProduct(ProductSummaryDTO product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }
}
