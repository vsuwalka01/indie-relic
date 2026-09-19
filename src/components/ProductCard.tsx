'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import ProductImage from './ProductImage';
import TiltCard from './TiltCard';

export default function ProductCard({ product, paused = false, sizes = '(max-width: 639px) 92vw, (max-width: 1023px) 44vw, 390px' }: { product: Product; paused?: boolean; sizes?: string }) {
  const add = useCart(state=>state.add);
  const show = useToast(state=>state.show);
  return <TiltCard maxTilt={2} disabled={paused} className="relic-card-shell">
    <article className="collection-card relic-card">
      <Link href={`/products/${product.id}`} className="relic-photo" aria-label={`Explore ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} sizes={sizes} />
        <span className="relic-photo-corners" aria-hidden="true" />
        <span className="relic-explore">Explore piece <span aria-hidden="true">↗</span></span>
      </Link>
      <div className="relic-info">
        <p className="relic-craft">{product.craft}<span aria-hidden="true">✧</span></p>
        <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
        <div className="relic-purchase"><p className="relic-price">₹{product.price.toLocaleString('en-IN')}</p><motion.button type="button" whileTap={{ scale: .96 }} aria-label={`Add ${product.name} to cart`} onClick={()=>{add({id:product.id,name:product.name,price:product.price,image:product.image,craft:product.craft});show(`Added ${product.name} to cart`);}}>Add to cart <span aria-hidden="true">+</span></motion.button></div>
      </div>
    </article>
  </TiltCard>;
}
