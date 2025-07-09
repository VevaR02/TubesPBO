package com.sevspo.marketplace.service;

import org.imgscalr.Scalr; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO; 
import java.awt.image.BufferedImage; 
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private static final int TARGET_WIDTH = 1200; 
    private static final int TARGET_HEIGHT = 1200;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Tidak dapat membuat direktori untuk menyimpan file upload.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Maaf! Nama file mengandung path yang tidak valid " + originalFileName);
            }


            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            BufferedImage resizedImage = Scalr.resize(originalImage, Scalr.Method.QUALITY, Scalr.Mode.AUTOMATIC, TARGET_WIDTH, TARGET_HEIGHT, Scalr.OP_ANTIALIAS);

            String fileExtension = "";
            try {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } catch (Exception e) {
                fileExtension = ".jpg"; 
            }
            
            String outputFormat = (fileExtension.equalsIgnoreCase(".png")) ? "png" : "jpg";

            String newFileName = UUID.randomUUID().toString() + "." + outputFormat;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            System.out.println(">>> [DEBUG] Attempting to save file to: " + targetLocation.toString()); // LOG 3


            boolean success = ImageIO.write(resizedImage, outputFormat, targetLocation.toFile()); // Tangkap status
            System.out.println(">>> [DEBUG] ImageIO.write success status: " + success); // LOG 4

            if (!success) {
                throw new IOException("ImageIO failed to write image, but no exception was thrown.");
            }

            return newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Tidak dapat menyimpan file " + originalFileName + ". Silakan coba lagi!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File tidak ditemukan " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File tidak ditemukan " + fileName, ex);
        }
    }
}
