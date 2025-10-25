package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario buscarEmail(String email);
}
