package com.sevspo.marketplace.dto;
class UserSummaryDTO {

    private String username;

    public UserSummaryDTO(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
