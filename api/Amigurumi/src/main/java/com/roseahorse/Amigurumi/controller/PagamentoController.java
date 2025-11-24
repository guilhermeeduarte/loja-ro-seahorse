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

    @Value("${ASAAS_API_KEY}")
    private String asaasApiKey;

    @Value("${asaas.api.url:https://api-sandbox.asaas.com/v3}")
    private String asaasApiUrl;

    @Value("${app.frontend.url:http://loja-ro-seahorse.vercel.app}")
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

    @PostMapping("/webhook")
    public ResponseEntity<?> receberWebhook(@RequestBody String rawPayload) {
        try {
            System.out.println("🔔 Webhook recebido (raw): " + rawPayload);

            Map<String, Object> payload = new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(rawPayload, Map.class);

            System.out.println("🔔 Webhook parseado: " + payload);

            String event = (String) payload.get("event");

            // Eventos que indicam pagamento confirmado
            if ("PAYMENT_RECEIVED".equals(event) ||
                    "PAYMENT_CONFIRMED".equals(event) ||
                    "PAYMENT_APPROVED".equals(event) ||
                    "PAYMENT_UPDATED".equals(event)) {

                // Asaas envia os dados diretamente no payload, não em um objeto "payment"
                String externalReference = null;
                String status = null;

                // Tenta pegar do objeto "payment" (alguns webhooks)
                if (payload.containsKey("payment")) {
                    Map<String, Object> payment = (Map<String, Object>) payload.get("payment");
                    externalReference = (String) payment.get("externalReference");
                    status = (String) payment.get("status");
                }
                // Tenta pegar diretamente do payload (outros webhooks)
                else {
                    externalReference = (String) payload.get("externalReference");
                    status = (String) payload.get("status");
                }

                System.out.println("📋 externalReference: " + externalReference);
                System.out.println("📋 status: " + status);

                if (externalReference == null || externalReference.isEmpty()) {
                    System.err.println("❌ externalReference não encontrado no payload");
                    return ResponseEntity.ok(Map.of("received", true, "warning", "externalReference ausente"));
                }

                if ("RECEIVED".equals(status) || "CONFIRMED".equals(status)) {
                    pedidoService.marcarComoPago(externalReference);
                    System.out.println("✅ Pagamento confirmado para pedido: " + externalReference);
                } else {
                    System.out.println("ℹ️ Status do pagamento: " + status + " - Aguardando confirmação");
                }
            } else {
                System.out.println("ℹ️ Evento ignorado: " + event);
            }

            return ResponseEntity.ok(Map.of("received", true));
        } catch (Exception e) {
            System.err.println("❌ Erro ao processar webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("received", true, "error", e.getMessage()));
        }
    }

    @GetMapping("/verificar-status/{pedidoId}")
    public ResponseEntity<?> verificarStatusPagamento(@PathVariable Long pedidoId) {
        try {
            boolean pago = pedidoService.verificarSePago(pedidoId);
            return ResponseEntity.ok(Map.of(
                    "pedidoId", pedidoId,
                    "pago", pago
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }
}