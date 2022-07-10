package com.nexum.teste;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//Controla o fluxo de informações.
@RestController
//Mapeia as requisições vinda no caminho /colaborador
@RequestMapping("/colaborador")
@CrossOrigin("*")
public class ColaboradorController {
    private ColaboradorRepository repository;
    public ColaboradorController(ColaboradorRepository repository){
        this.repository = repository;
    };

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Colaborador> criaColaborador(@RequestBody Colaborador colaborador) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(colaborador));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Iterable<Colaborador>> listaColaboradores() {
        return ResponseEntity.ok(repository.findAll());
    }

    @DeleteMapping(path = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deletaColaborador(@PathVariable Integer id) {
        Colaborador colaborador = new Colaborador();
        colaborador.setId(id);
        repository.delete(colaborador);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Colaborador> editaColaborador(@PathVariable Integer id, @RequestBody Colaborador colaborador) {
        colaborador.setId(id);
        repository.save(colaborador);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Colaborador> retornaColaborador(@PathVariable Integer id) {
        Optional<Colaborador> colaborador = repository.findById(id);
        if (colaborador.isPresent()) {
            return ResponseEntity.ok(colaborador.get());
        }
        return ResponseEntity.notFound().build();
    }
}