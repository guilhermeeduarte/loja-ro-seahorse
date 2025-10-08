package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Query(value = "SELECT * FROM produto WHERE " +
            "nome ILIKE CONCAT('%', :termo, '%') OR " +
            "descricao ILIKE CONCAT('%', :termo, '%')",
            nativeQuery = true)
    List<Produto> buscarPorNomeOuDescricao(@Param("termo") String termo);
}
