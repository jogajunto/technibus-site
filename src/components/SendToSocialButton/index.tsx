"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useEffect, useState } from "react";
import "./styles.scss";

export default function SendToSocialButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  // Garante que a leitura dos campos só ocorra no Client-Side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pegamos os campos do formulário para saber o ID e se já foi publicado
  const { id } = useDocumentInfo() || {};
  const status = useFormFields(([fields]) => fields._status?.value) as string;
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

  if (!mounted) return null;

  if (!id || status !== "published") {
    return (
      <div style={{ padding: "10px 0", borderTop: "1px solid var(--theme-elevation-100)" }}>
        <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "var(--theme-elevation-400)" }}>Integração Social - Facebook</h4>
        <p style={{ fontSize: "13px", color: "var(--theme-elevation-500)", fontStyle: "italic", margin: 0 }}>⚠️ Publique este post para habilitar o envio ao Facebook.</p>
        <span style={{ fontSize: "10px", opacity: 0.3 }}>Status atual lido: {status || "nenhum"}</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 0", borderTop: "1px solid var(--theme-elevation-100)" }}>
      <h4 style={{ marginBottom: "10px", fontSize: "14px" }}>Integração Social - Facebook</h4>

      {socialPublished ? (
        <div style={{ color: "var(--theme-success-400)", fontWeight: "bold" }}>✓ Já enviado para redes sociais</div>
      ) : (
        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          className="send-to-social-button"
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Enviando..." : "Enviar para Facebook"}
        </button>
      )}

      {message && <p style={{ marginTop: "10px", fontSize: "13px" }}>{message}</p>}
    </div>
  );
}
