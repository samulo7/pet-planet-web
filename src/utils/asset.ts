export const resolveAssetUrl = (url?: string): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const assetBase = (import.meta.env.VITE_ASSET_BASE_URL as string | undefined) || '';
  const inferredBase = apiBase ? apiBase.replace(/\/api\/v\d+\/?$/i, '') : '';
  const base = (assetBase || inferredBase).replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;

  return base ? `${base}${path}` : url;
};
