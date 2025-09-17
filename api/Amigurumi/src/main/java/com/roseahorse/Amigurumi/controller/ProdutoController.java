package com.roseahorse.Amigurumi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Produto")
public class ProdutoController {

    @GetMapping
    public String guilherme(){
        return("É MAFIA FAMILIA");
    }
}
