package com.sevspo.marketplace;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.sevspo.marketplace.model.Erole;
import com.sevspo.marketplace.model.Role;
import com.sevspo.marketplace.repository.RoleRepository;

@SpringBootApplication
public class MarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketplaceApplication.class, args);
    }

    //Memastikan peran ROLE_USER dan ROLE_ADMIN ada di database saat aplikasi dimulai
    @Bean
    CommandLineRunner run(RoleRepository roleRepository) {
        return args -> {
            // Periksa apakah ROLE_USER sudah ada
            if (roleRepository.findByName(Erole.ROLE_USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(Erole.ROLE_USER);
                roleRepository.save(userRole);
                System.out.println(">>> Peran ROLE_USER berhasil dibuat. <<<");
            }

            // Periksa apakah ROLE_ADMIN sudah ada
            if (roleRepository.findByName(Erole.ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(Erole.ROLE_ADMIN);
                roleRepository.save(adminRole);
                System.out.println(">>> Peran ROLE_ADMIN berhasil dibuat. <<<");
            }
        };
    }
}
