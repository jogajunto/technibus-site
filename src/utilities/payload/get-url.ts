export const getClientSideURL = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "";
};
