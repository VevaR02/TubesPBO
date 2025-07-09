package com.sevspo.marketplace.dto;

class ProductSummaryDTO {

    private String name;

    public ProductSummaryDTO(String name) {
        this.name = name;
    }

   
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
