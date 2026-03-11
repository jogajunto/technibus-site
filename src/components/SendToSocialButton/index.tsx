"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useState } from "react";

export default function SendToSocialButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Pegamos os campos do formulário para saber o ID e se já foi publicado
  const { id } = useDocumentInfo() || {};

  const socialPublished = useFormFields(([fields]) => fields.socialPublished?.value) as boolean;

  const handleSend = async () => {
    if (!id) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/posts/${id}/send-to-social`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Sucesso!");
        // Opcional: Atualizar a página para refletir o checkbox marcado
        window.location.reload();
      } else {
        setMessage(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Se o post ainda não foi salvo (novo post sem ID), não mostramos o botão
  if (!id) return null;

  return (
    <div style={{ padding: "10px 0", borderTop: "1px solid var(--theme-elevation-100)" }}>
      <h4 style={{ marginBottom: "10px", fontSize: "14px" }}>Integração Social</h4>

      {socialPublished ? (
        <div style={{ color: "var(--theme-success-400)", fontWeight: "bold" }}>✓ Já enviado para redes sociais</div>
      ) : (
        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--theme-elevation-800)",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Enviando..." : "Enviar para Zapier"}
        </button>
      )}

      {message && <p style={{ marginTop: "10px", fontSize: "13px" }}>{message}</p>}
    </div>
  );
}
