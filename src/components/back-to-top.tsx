'use client';
import { useEffect, useState } from 'react';
import { ArrowUp, ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '5.5rem',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'var(--gold)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
      aria-label="Volver arriba"
    >
      <ChevronUp size={20} />
    </button>
  );
}
