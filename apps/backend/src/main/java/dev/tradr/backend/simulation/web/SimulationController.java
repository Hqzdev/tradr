package dev.tradr.backend.simulation.web;
import dev.tradr.backend.simulation.application.SimulationService; import dev.tradr.backend.simulation.web.dto.*; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/v1")
public class SimulationController { private final SimulationService service; public SimulationController(SimulationService service){this.service=service;} private UUID user(Authentication a){return (UUID)a.getPrincipal();}
 @GetMapping("/simulation/datasets") public List<Map<String,Object>> datasets(){return service.datasets();}
 @PostMapping("/simulation/datasets") public ResponseEntity<Map<String,Object>> dataset(@Valid @RequestBody CreateDatasetRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.dataset(r));}
 @PostMapping("/simulations") public ResponseEntity<Map<String,Object>> run(Authentication a,@RequestBody CreateSimulationRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.run(user(a),r));}
 @GetMapping("/simulations/{id}") public Map<String,Object> simulation(Authentication a,@PathVariable UUID id){return service.simulation(user(a),id);}
 @GetMapping("/simulations/{id}/results") public Map<String,Object> result(Authentication a,@PathVariable UUID id){return service.result(user(a),id);}
 @GetMapping(value="/simulations/{id}/export",produces="text/csv") public ResponseEntity<String> export(Authentication a,@PathVariable UUID id){return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=simulation-"+id+".csv").body(service.csv(user(a),id));}
}
