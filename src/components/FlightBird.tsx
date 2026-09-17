'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { BIRD_VIEWBOX, head, beak, tail, diamond, squares, feathers, type BirdShape } from './birdPaths';

function Shapes({ shapes }: { shapes: BirdShape[] }) {
  return <>{shapes.map((shape, index) => <path key={index} d={shape.d} fill={shape.fill} />)}</>;
}

/** Animate the original source-artwork paths without replacing the brand mark. */
export default function FlightBird({ flying = false, perched = false }: { flying?: boolean; perched?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  return <svg ref={ref} viewBox={BIRD_VIEWBOX}
    className={`flight-bird brand-bird ${flying ? 'is-flying' : ''} ${perched ? 'is-perched' : ''} ${inView ? '' : 'is-offscreen'}`}
    aria-hidden="true">
    <g className="brand-tail"><Shapes shapes={tail} /></g>
    <g className="brand-wing"><Shapes shapes={feathers} /></g>
    <Shapes shapes={diamond} />
    <Shapes shapes={squares} />
    <Shapes shapes={head} />
    <Shapes shapes={beak} />
  </svg>;
}
