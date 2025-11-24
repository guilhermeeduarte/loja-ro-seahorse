package com.roseahorse.Amigurumi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    public String uploadImagem(MultipartFile file) throws IOException {
        String publicId = "produtos/" + UUID.randomUUID().toString();

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "folder", "roseahorse/produtos",
                        "resource_type", "image"
                )
        );

        return (String) uploadResult.get("secure_url");
    }

    public void deletarImagem(String imageUrl) {
        try {
            // Extrai public_id da URL
            String publicId = extrairPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            System.err.println("Erro ao deletar imagem: " + e.getMessage());
        }
    }

    private String extrairPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }

        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String path = parts[1];
                // Remove versão (v123456/)
                path = path.replaceFirst("v\\d+/", "");
                // Remove extensão
                return path.substring(0, path.lastIndexOf('.'));
            }
        } catch (Exception e) {
            System.err.println("Erro ao extrair public_id: " + e.getMessage());
        }

        return null;
    }
}