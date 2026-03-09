"use client";

type FilterExibithorsProps = {
  categories: any[];
  initialCategory?: string;
  initialSearch?: string;
};

export function FilterExibithors({ categories, initialCategory, initialSearch }: FilterExibithorsProps) {
  return (
    <form method="GET" action="/expositores" className="mb-12 flex flex-col justify-between gap-4 md:flex-row">
      {/* Select de Categoria Dinâmico */}
      <div className="relative w-full md:max-w-xs">
        <select
          name="categoria"
          defaultValue={initialCategory || ""}
          // Agora o onChange funciona perfeitamente!
          //   onChange={(e) => e.currentTarget.form?.submit()}
          className="w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <option value="">Selecionar categoria</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
        {/* Ícone */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Input de Pesquisa */}
      <div className="relative w-full md:max-w-md">
        <input
          type="text"
          name="s"
          defaultValue={initialSearch || ""}
          placeholder="Pesquisar"
          className="w-full rounded-md border border-gray-200 bg-white py-3 pr-12 pl-4 text-gray-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <button type="submit" className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
