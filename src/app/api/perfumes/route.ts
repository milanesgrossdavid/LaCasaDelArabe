import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type PerfumeRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number | string;
  size_ml: number;
  gender: string;
  family: string;
  description: string | null;
  images: string[] | null;
  stock: number;
  featured: boolean;
  is_new: boolean;
  notes: { top: string[]; heart: string[]; base: string[] } | null;
  occasions: string[] | null;
  season: string[] | null;
  intensity: string | null;
  published?: boolean | null;
};

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ perfumes: [], source: 'none' });
  let { data, error } = await supabase
    .from('perfumes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ perfumes: [], source: 'none', warning: error.message });
  // If no data or all filtered out, try without published filter
  if (!data || data.length === 0) {
    const res = await supabase.from('perfumes').select('*').order('created_at', { ascending: false });
    data = res.data;
    error = res.error;
  }
  const normalized = (data ?? [])
    .filter((p: PerfumeRow) => p.published !== false)
    .map((p: PerfumeRow) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      size: p.size_ml,
      gender: p.gender,
      family: p.family,
      description: p.description ?? '',
      image: p.images?.[0] ?? '',
      images: p.images ?? [],
      stock: p.stock,
      featured: p.featured,
      isNew: p.is_new,
      notes: p.notes ?? { top: [], heart: [], base: [] },
      occasions: p.occasions ?? [],
      season: p.season ?? [],
      intensity: p.intensity ?? 'Moderada',
    }));
  return NextResponse.json({ perfumes: normalized, source: 'supabase' });
}
