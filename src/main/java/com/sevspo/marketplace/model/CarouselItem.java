package com.sevspo.marketplace.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carousel_items")
public class CarouselItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    private String title;
    private String subtitle;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @JsonProperty("isActive")
    public boolean isActive() {
        return isActive;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // PERBAIKAN: Mengganti nama setter dari setIsActive menjadi setActive
    // Ini adalah konvensi standar yang dipahami oleh Jackson.
    public void setActive(boolean active) {
        this.isActive = active;
    }
}
