package com.roseahorse.Amigurumi.repositories;

import com.roseahorse.Amigurumi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
