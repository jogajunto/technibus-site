type SearchAreaProps = {
  searchTerm: string;
};

export function SearchArea({ searchTerm }: SearchAreaProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between border-b-2 border-blue-600 pb-2">
        <h1 className="text-2xl font-bold text-gray-800 uppercase">Resultados da busca por &ldquo;{searchTerm || "Todos os posts"}&rdquo;</h1>
        <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
          <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z" />
          <path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
      </div>

      <p className="mb-4 text-gray-600 italic">Se você não está feliz com os resultados, por favor, faça outra busca.</p>

      {/* O formulário sempre aponta para /pesquisar para resetar a página em novas buscas */}
      <form action="/pesquisar" method="GET" className="relative mb-10">
        <input
          type="text"
          name="s"
          defaultValue={searchTerm}
          placeholder="Busque aqui..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 transition-colors outline-none focus:border-blue-500"
        />
        <button type="submit" className="absolute top-3 right-4 text-gray-400">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </>
  );
}
