## Como rodar

Dry-run é o padrão:

```bash
npx payload run scripts/reprocessMediaSizes.ts
```

Para execução real em staging:

```bash
REPROCESS_EXECUTE=true npx payload run scripts/reprocessMediaSizes.ts
```

Para forçar todas as mídias:

```bash
REPROCESS_EXECUTE=true REPROCESS_FORCE=true npx payload run scripts/reprocessMediaSizes.ts
```

Para produção:

```bash
ALLOW_PRODUCTION_REPROCESS=true REPROCESS_EXECUTE=true npx payload run scripts/reprocessMediaSizes.ts
```
