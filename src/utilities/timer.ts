export async function timeIt<T>(label: string, fn: () => Promise<T>): Promise<T> {
  // Pega o tempo inicial
  const start = performance.now();

  // Executa a função do Payload
  const result = await fn();

  // Pega o tempo final
  const end = performance.now();
  const timeMs = (end - start).toFixed(2);

  // Imprime no terminal de forma destacada
  console.log(`⏱️ [${label}] levou ${timeMs}ms`);

  return result;
}
