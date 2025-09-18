package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.repositories.ProdutoRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/produto")
public class ProdutoController {

    @Autowired
    ProdutoRepository repository;

    @GetMapping
    public ResponseEntity getAll() {
        List<Produto> listProdutos = repository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(listProdutos);
    }
}
