package com.sevspo.marketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Erole name;

    // --- Getters and Setters Manual ---
    // Pastikan semua metode ini ada persis seperti ini.
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Ini adalah metode yang paling penting yang dicari oleh compiler
    public Erole getName() {
        return name;
    }

    public void setName(Erole name) {
        this.name = name;
    }
}
