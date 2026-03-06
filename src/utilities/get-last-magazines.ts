type Magazines = {
  cover_year: string;
  edition: number;
  id: number;
  name: string;
  release_month: string;
  release_year: string;
  status: string;
  publication: {
    value: {
      slug: string;
    };
  };
  magazineFile: {
    url: string;
    thumbnail: {
      url: string;
    };
  };
};

export const getShortMonthName = (monthStr: string) => {
  if (!monthStr) return "";
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const m = parseInt(monthStr, 10);
  return !isNaN(m) && m >= 1 && m <= 12 ? months[m - 1] : "";
};

export const getLastMagazines = async () => {
  const request = await fetch(process.env.ACERVO_DIGITAL_MAGAZINES_ENDPOINT_URL!, {
    headers: {
      Origin: process.env.SITE_URL || "http://localhost",
    },
  });
  const data = await request.json();
  let revistas: Magazines[] = [];

  if (data.success) {
    revistas = data.data;
    return revistas;
  } else {
    return revistas;
  }
};
