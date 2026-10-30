'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Perfume } from '@/types';
type CartLine={id:string;quantity:number};
type Store={cart:CartLine[];favorites:string[];perfumes:Perfume[];perfumesLoading:boolean;perfumesError:string|null;add:(id:string)=>void;setQty:(id:string,n:number)=>void;remove:(id:string)=>void;toggleFavorite:(id:string)=>void;clear:()=>void;reload:()=>Promise<void>};
const Ctx=createContext<Store|null>(null);
export function StoreProvider({children}:{children:ReactNode}){
  const [cart,setCart]=useState<CartLine[]>([]);const [favorites,setFavorites]=useState<string[]>([]);const [products,setProducts]=useState<Perfume[]>([]);const [ready,setReady]=useState(false);
  const [perfumesLoading,setPerfumesLoading]=useState(true);const [perfumesError,setPerfumesError]=useState<string|null>(null);
  async function load(): Promise<void> {
    setPerfumesLoading(true);
    setPerfumesError(null);
    try {
      const response=await fetch('/api/perfumes',{cache:'no-store'});
      if(!response.ok)throw new Error(`Error al cargar perfumes (${response.status}).`);
      const data=await response.json();
      if(data.warning)throw new Error(data.warning);
      if(!Array.isArray(data.perfumes))throw new Error('La respuesta del catálogo no es válida.');
      setProducts(data.perfumes);
    } catch (error) {
      const message=error instanceof Error?error.message:'No se pudo cargar el catálogo.';
      console.error('No se pudieron cargar los perfumes:',error);
      setPerfumesError(message);
    } finally {
      setPerfumesLoading(false);
    }
  }
  useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem('perfumeria-cart')||'[]'));setFavorites(JSON.parse(localStorage.getItem('perfumeria-favorites')||'[]'))}catch{}setReady(true);load();},[]);
  useEffect(()=>{if(ready)localStorage.setItem('perfumeria-cart',JSON.stringify(cart))},[cart,ready]);useEffect(()=>{if(ready)localStorage.setItem('perfumeria-favorites',JSON.stringify(favorites))},[favorites,ready]);
  const value=useMemo<Store>(()=>({cart,favorites,perfumes:products,perfumesLoading,perfumesError,add:(id)=>setCart(old=>{const p=products.find(x=>x.id===id);if(!p||p.stock<1)return old;const line=old.find(x=>x.id===id);return line?old.map(x=>x.id===id?{...x,quantity:Math.min(p.stock,x.quantity+1)}:x):[...old,{id,quantity:1}]}),setQty:(id,n)=>setCart(old=>{const p=products.find(x=>x.id===id);if(!p||n<1)return old.filter(x=>x.id!==id);return old.map(x=>x.id===id?{...x,quantity:Math.min(p.stock,n)}:x)}),remove:(id)=>setCart(old=>old.filter(x=>x.id!==id)),toggleFavorite:(id)=>setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]),clear:()=>setCart([]),reload:load}),[cart,favorites,products,perfumesLoading,perfumesError]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useStore(){const v=useContext(Ctx);if(!v)throw new Error('useStore debe usarse dentro de StoreProvider');return v}
