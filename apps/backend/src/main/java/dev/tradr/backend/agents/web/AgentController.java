package dev.tradr.backend.agents.web;
import dev.tradr.backend.agents.application.AgentService; import dev.tradr.backend.agents.web.dto.*; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/v1/agents")
public class AgentController { private final AgentService service; public AgentController(AgentService service){this.service=service;} private UUID user(Authentication a){return (UUID)a.getPrincipal();}
 @GetMapping public List<AgentResponse> list(Authentication a){return service.list(user(a));}
 @PostMapping public ResponseEntity<AgentResponse> create(Authentication a,@Valid @RequestBody CreateAgentRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(user(a),r));}
 @GetMapping("/{id}") public AgentResponse get(Authentication a,@PathVariable UUID id){return service.get(user(a),id);}
 @PatchMapping("/{id}") public AgentResponse update(Authentication a,@PathVariable UUID id,@RequestBody Map<String,String> body){return service.status(user(a),id,body.get("status"));}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(Authentication a,@PathVariable UUID id){service.delete(user(a),id);return ResponseEntity.noContent().build();}
 @GetMapping("/{id}/{field:character|budget|skills}") public String config(Authentication a,@PathVariable UUID id,@PathVariable String field){return service.config(user(a),id,field);}
 @GetMapping("/{id}/log") public List<DecisionResponse> log(Authentication a,@PathVariable UUID id,@RequestParam(defaultValue="50") int limit){return service.log(user(a),id,Math.min(200,Math.max(1,limit)));}
}
