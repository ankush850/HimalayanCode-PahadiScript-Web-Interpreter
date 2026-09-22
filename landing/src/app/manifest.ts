import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HimalayanCode - PahadiScript Web Interpreter',
    short_name: 'HimalayanCode',
    description:
      'A web-based interpreter for HimalayanCode / PahadiScript — learn coding concepts using Hindi keywords.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
