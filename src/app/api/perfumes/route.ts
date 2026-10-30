import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    .filter((p: any) => p.published !== false) // show if published true or undefined/null
    .map((p: any) => ({
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
