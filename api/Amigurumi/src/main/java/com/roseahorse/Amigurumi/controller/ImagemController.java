package com.roseahorse.Amigurumi.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/imagem")
@CrossOrigin(origins = "*")
public class ImagemController {

    @Value("${app.upload.dir:uploads/produtos}")
    private String uploadDir;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImagem(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Arquivo vazio");
            }

            // Validar tipo de arquivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Apenas imagens são permitidas");
            }

            // Criar diretório se não existir
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Salvar arquivo
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retornar URL da imagem
            String imageUrl = "/api/imagem/" + filename;

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Upload realizado com sucesso",
                    "filename", filename,
                    "url", imageUrl
            ));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao fazer upload: " + e.getMessage());
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImagem(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] image = Files.readAllBytes(filePath);

            // Determinar tipo de conteúdo baseado na extensão
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "image/jpeg"; // fallback
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(image);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deletarImagem(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return ResponseEntity.ok(Map.of("mensagem", "Imagem deletada com sucesso"));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar imagem: " + e.getMessage());
        }
    }
}