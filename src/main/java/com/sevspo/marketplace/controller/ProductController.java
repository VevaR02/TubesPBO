package com.sevspo.marketplace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sevspo.marketplace.model.Product;
import com.sevspo.marketplace.service.FileStorageService;
import com.sevspo.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private ObjectMapper objectMapper;

    // PERBAIKAN: Endpoint ini sekarang menerima parameter pencarian
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {
        return productService.searchProducts(keyword, categoryId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestParam("product") String productStr, @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        Product product = objectMapper.readValue(productStr, Product.class);
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/")
                    .path(fileName)
                    .toUriString();
            product.setImageUrl(fileDownloadUri);
        }
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestParam("product") String productStr, @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        Product productDetails = objectMapper.readValue(productStr, Product.class);
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/")
                    .path(fileName)
                    .toUriString();
            productDetails.setImageUrl(fileDownloadUri);
        }
        return productService.updateProduct(id, productDetails).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
