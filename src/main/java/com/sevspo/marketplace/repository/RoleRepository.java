package com.sevspo.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sevspo.marketplace.model.Erole;
import com.sevspo.marketplace.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(Erole name);
}
