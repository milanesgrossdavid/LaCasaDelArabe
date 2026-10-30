export type Perfume = {
  id: string; slug: string; name: string; brand: string; price: number; size: number;
  gender: "Mujer" | "Hombre" | "Unisex"; family: string; description: string;
  image: string; images: string[]; stock: number; featured: boolean; isNew?: boolean;
  notes: { top: string[]; heart: string[]; base: string[] };
  occasions: string[]; season: string[]; intensity: string;
};
