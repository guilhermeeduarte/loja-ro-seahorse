package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM usuario u WHERE u.email = :email AND u.excluido = false")
    Usuario findByEmailAndNotDeleted(String email);


    Usuario findByEmail(String email);

    @Query("SELECT u FROM usuario u WHERE u.excluido = false")
    List<Usuario> findAllActive();

    @Query("SELECT u FROM usuario u WHERE u.id = :id AND u.excluido = false")
    Optional<Usuario> findByIdAndNotDeleted(Long id);
}
