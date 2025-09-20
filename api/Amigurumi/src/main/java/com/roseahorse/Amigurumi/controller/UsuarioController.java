package com.roseahorse.Amigurumi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class UsuarioController {

    @GetMapping("/cadastro")
    public String cadastrarUsuario(){
        return "cadastro";
    }
}
