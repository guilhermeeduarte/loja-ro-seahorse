package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/imagem")
@CrossOrigin(origins = "*")
public class ImagemController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload")
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

            // Upload para Cloudinary
            String imageUrl = cloudinaryService.uploadImagem(file);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Upload realizado com sucesso",
                    "url", imageUrl
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao fazer upload: " + e.getMessage());
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deletarImagem(@PathVariable String filename) {
        try {
            // Como agora usamos URLs completas, precisamos reconstruir a URL
            // ou aceitar a URL completa como parâmetro
            cloudinaryService.deletarImagem(filename);
            return ResponseEntity.ok(Map.of("mensagem", "Imagem deletada com sucesso"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar imagem: " + e.getMessage());
        }
    }
}