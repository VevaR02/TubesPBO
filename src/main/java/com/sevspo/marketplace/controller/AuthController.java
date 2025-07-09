package com.sevspo.marketplace.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sevspo.marketplace.dto.JwtResponse;
import com.sevspo.marketplace.dto.LoginRequest;
import com.sevspo.marketplace.dto.SignUpRequest;
import com.sevspo.marketplace.model.Erole;
import com.sevspo.marketplace.model.Role;
import com.sevspo.marketplace.model.User;
import com.sevspo.marketplace.repository.RoleRepository;
import com.sevspo.marketplace.repository.UserRepository;
import com.sevspo.marketplace.security.jwt.JwtUtils;
import com.sevspo.marketplace.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority()).collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        System.out.println(">>> PERMINTAAN DITERIMA DI ENDPOINT /api/auth/signup <<<");
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username sudah digunakan!");
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email sudah digunakan!");
        }
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            roles.add(roleRepository.findByName(Erole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role tidak ditemukan.")));
        } else {
            strRoles.forEach(role -> {
                if (role.equals("admin")) {
                    roles.add(roleRepository.findByName(Erole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Error: Role tidak ditemukan.")));
                } else {
                    roles.add(roleRepository.findByName(Erole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role tidak ditemukan.")));
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok("User berhasil didaftarkan!");
    }
}
