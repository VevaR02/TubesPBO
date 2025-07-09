package com.sevspo.marketplace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sevspo.marketplace.model.GalleryImage;
import com.sevspo.marketplace.repository.GalleryImageRepository;
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
@RequestMapping("/api/gallery-images")
public class GalleryImageController {

    @Autowired
    private GalleryImageRepository galleryImageRepository;
    @Autowired
    private FileStorageService fileStorageService;

    // READ (Sudah ada dan bersifat publik)
    @GetMapping
    public List<GalleryImage> getAllGalleryImages() {
        return galleryImageRepository.findAll();
    }

    // CREATE (Sudah ada dan hanya untuk ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public GalleryImage createGalleryImage(@RequestParam("caption") String caption, @RequestParam("file") MultipartFile file) throws IOException {
        GalleryImage galleryImage = new GalleryImage();
        galleryImage.setCaption(caption);

        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/")
                .path(fileName)
                .toUriString();
        galleryImage.setImageUrl(fileDownloadUri);

        return galleryImageRepository.save(galleryImage);
    }

    // UPDATE (Endpoint baru untuk mengubah caption, hanya untuk ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GalleryImage> updateGalleryImage(@PathVariable Long id, @RequestBody GalleryImage imageDetails) {
        return galleryImageRepository.findById(id)
                .map(image -> {
                    image.setCaption(imageDetails.getCaption());
                    GalleryImage updatedImage = galleryImageRepository.save(image);
                    return ResponseEntity.ok(updatedImage);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE (Sudah ada dan hanya untuk ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable Long id) {
        // TODO: Hapus juga file fisik dari storage jika diperlukan
        return galleryImageRepository.findById(id)
                .map(item -> {
                    galleryImageRepository.delete(item);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
