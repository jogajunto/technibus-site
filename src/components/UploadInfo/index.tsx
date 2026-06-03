const UploadInfo = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--theme-elevation-50)",
        padding: "12px 16px",
        borderRadius: "4px",
        borderLeft: "4px solid var(--theme-warning-400)",
        marginBottom: "20px",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
        <strong>⚠️ Limites de Imagem:</strong> O arquivo deve ter no mínimo <strong>480px</strong> de largura e altura. Imagens com mais de <strong>1920px</strong> serão
        redimensionadas automaticamente pelo sistema para otimizar o carregamento.
      </p>
    </div>
  );
};

export default UploadInfo;
