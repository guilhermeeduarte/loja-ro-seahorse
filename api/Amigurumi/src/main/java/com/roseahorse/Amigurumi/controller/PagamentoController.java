package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagamento")
@CrossOrigin(origins = "*")
public class PagamentoController {

    @Value("${VITE_API_PAGAMENTO}")
    private String asaasApiKey;

    @Value("${asaas.api.url:https://api-sandbox.asaas.com/v3}")
    private String asaasApiUrl;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/gerar-link")
    public ResponseEntity<?> gerarLinkPagamento(@RequestBody Map<String, Object> request) {
        try {
            Long pedidoId = Long.valueOf(request.get("pedidoId").toString());
            Double valor = Double.valueOf(request.get("valor").toString());
            String descricao = request.get("descricao") != null
                    ? request.get("descricao").toString()
                    : "Pagamento de produto";

            // Monta o corpo da requisição para Asaas
            Map<String, Object> asaasRequest = new HashMap<>();
            asaasRequest.put("billingType", "UNDEFINED"); // Permite todos os métodos
            asaasRequest.put("chargeType", "DETACHED");
            asaasRequest.put("name", "Pedido #" + pedidoId + " - RO SeaHorse");
            asaasRequest.put("description", descricao);
            asaasRequest.put("value", valor);
            asaasRequest.put("dueDateLimitDays", 10);

            asaasRequest.put("externalReference", pedidoId.toString());

            // Configura headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");
            headers.set("content-type", "application/json");
            headers.set("access_token", asaasApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(asaasRequest, headers);

            // Faz a requisição para Asaas
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                    asaasApiUrl + "/paymentLinks",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                return ResponseEntity.ok(Map.of(
                        "sucesso", true,
                        "pedidoId", pedidoId,
                        "url", responseBody.get("url"),
                        "id", responseBody.get("id")
                ));
            } else {
                throw new Exception("Erro na resposta da API de pagamento");
            }

        } catch (Exception e) {
            System.err.println("Erro ao gerar link de pagamento: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao gerar link de pagamento: " + e.getMessage()
            ));
        }
    }

    // Webhook para receber confirmação de pagamento da Asaas
    @PostMapping("/webhook")
    public ResponseEntity<?> receberWebhook(@RequestBody Map<String, Object> payload) {
        try {
            // Extrai informações do webhook
            String event = (String) payload.get("event");

            if ("PAYMENT_RECEIVED".equals(event)) {
                Map<String, Object> payment = (Map<String, Object>) payload.get("payment");
                String externalReference = (String) payment.get("externalReference");

                pedidoService.marcarComoPago(externalReference);

                System.out.println("✅ Pagamento recebido para: " + externalReference);
            }

            return ResponseEntity.ok(Map.of("received", true));
        } catch (Exception e) {
            System.err.println("Erro ao processar webhook: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }
}