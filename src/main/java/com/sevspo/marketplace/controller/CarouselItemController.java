package com.sevspo.marketplace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sevspo.marketplace.model.CarouselItem;
import com.sevspo.marketplace.repository.CarouselItemRepository;
import com.sevspo.marketplace.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/carousel-items")
public class CarouselItemController {

    @Autowired
    private CarouselItemRepository carouselItemRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<CarouselItem> getActiveCarouselItems() {
        return carouselItemRepository.findAllByIsActiveTrue();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CarouselItem> getAllCarouselItems() {
        return carouselItemRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CarouselItem createCarouselItem(@RequestParam("item") String itemStr, @RequestParam("file") MultipartFile file) throws IOException {
        CarouselItem carouselItem = objectMapper.readValue(itemStr, CarouselItem.class);
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/files/").path(fileName).toUriString();
        carouselItem.setImageUrl(fileDownloadUri);
        return carouselItemRepository.save(carouselItem);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarouselItem> updateCarouselItem(@PathVariable Long id, @RequestParam("item") String itemStr, @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        CarouselItem itemDetails = objectMapper.readValue(itemStr, CarouselItem.class);

        return carouselItemRepository.findById(id).map(itemToUpdate -> {
            
            itemToUpdate.setTitle(itemDetails.getTitle());
            itemToUpdate.setSubtitle(itemDetails.getSubtitle());
            itemToUpdate.setActive(itemDetails.isActive());

           
            if (file != null && !file.isEmpty()) {
                System.out.println(">>> [DEBUG] trying to update file. Filename: " + file.getOriginalFilename()); // LOG 1
                String fileName = fileStorageService.storeFile(file);
                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/files/")
                        .path(fileName)
                        .toUriString();
                System.out.println(">>> [DEBUG] new image URL generated: " + fileDownloadUri); // LOG 2
                itemToUpdate.setImageUrl(fileDownloadUri);
            }

            
            CarouselItem updatedItem = carouselItemRepository.save(itemToUpdate);
            return ResponseEntity.ok(updatedItem);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCarouselItem(@PathVariable Long id) {
        return carouselItemRepository.findById(id).map(item -> {
            carouselItemRepository.delete(item);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
