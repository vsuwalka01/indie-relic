import type { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

/** Request the displayed resolution directly from the existing image CDN. CMS uploads retain their original URLs. */
export default function ProductImage({ src, alt, sizes = '(max-width: 639px) 92vw, (max-width: 1023px) 44vw, 360px', loading = 'lazy', ...props }: Props) {
  let source = src;
  let srcSet: string | undefined;
  try {
    const url = new URL(src);
    if (url.hostname === 'images.unsplash.com') {
      const sized = (width: number) => {
        const image = new URL(url);
        image.searchParams.set('w', String(width));
        image.searchParams.set('h', String(width));
        image.searchParams.set('auto', 'format');
        image.searchParams.set('q', '75');
        return image.toString();
      };
      source = sized(640);
      srcSet = [240, 400, 640, 900, 1200].map(w => `${sized(w)} ${w}w`).join(', ');
    }
  } catch { /* Relative CMS uploads use the same standard img fallback. */ }
  return <img width={900} height={900} decoding="async" {...props} src={source} srcSet={srcSet} sizes={srcSet ? sizes : undefined} loading={loading} alt={alt} />;
}
