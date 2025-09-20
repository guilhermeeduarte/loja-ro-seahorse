package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
