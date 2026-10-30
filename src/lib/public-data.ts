import { createClient } from '@/lib/supabase/server';
import type { Perfume } from '@/types';

type PerfumeRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number | string;
  size_ml: number;
  gender: Perfume['gender'];
  family: string;
  description: string | null;
  images: string[] | null;
  stock: number;
  featured: boolean;
  is_new: boolean;
  notes: Perfume['notes'] | null;
  occasions: string[] | null;
  season: string[] | null;
  intensity: string | null;
};

function toPerfume(p: PerfumeRow): Perfume {
  return {
    id: p.id, slug: p.slug, name: p.name, brand: p.brand, price: Number(p.price), size: p.size_ml,
    gender: p.gender, family: p.family, description: p.description ?? '', image: p.images?.[0] ?? '', images: p.images ?? [],
    stock: p.stock, featured: p.featured, isNew: p.is_new, notes: p.notes ?? { top: [], heart: [], base: [] },
    occasions: p.occasions ?? [], season: p.season ?? [], intensity: p.intensity ?? 'Moderada',
  };
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getPublicPerfumes(): Promise<Perfume[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('perfumes').select('*').eq('published', true).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(toPerfume);
}

export async function getFeaturedPerfumes(): Promise<Perfume[] | null> {
  const supabase = await createClient();
  if (!supabase) {
    console.error('No se pudieron cargar los destacados: faltan las variables de Supabase.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select('id,slug,name,brand,price,size_ml,gender,family,description,images,stock,featured,is_new,notes,occasions,season,intensity')
      .eq('published', true)
      .eq('featured', true)
      .gt('stock', 0);

    if (error) {
      console.error('No se pudieron cargar los perfumes destacados:', error);
      return null;
    }

    return shuffle((data ?? []).map(toPerfume)).slice(0, 12);
  } catch (error) {
    console.error('No se pudieron cargar los perfumes destacados:', error);
    return null;
  }
}

export async function getRelatedPerfumes(productId: string): Promise<Perfume[] | null> {
  const supabase = await createClient();
  if (!supabase) {
    console.error('No se pudieron cargar los productos recomendados: faltan las variables de Supabase.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select('id,slug,name,brand,price,size_ml,gender,family,description,images,stock,featured,is_new,notes,occasions,season,intensity')
      .eq('published', true)
      .gt('stock', 0)
      .neq('id', productId);

    if (error) {
      console.error('No se pudieron cargar los productos recomendados:', error);
      return null;
    }

    return shuffle((data ?? []).map(toPerfume)).slice(0, 8);
  } catch (error) {
    console.error('No se pudieron cargar los productos recomendados:', error);
    return null;
  }
}
