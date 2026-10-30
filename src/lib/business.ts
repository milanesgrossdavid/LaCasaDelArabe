export const business = {
  name: "La Casa Del Arabe",
  whatsapp: "5356911031",
  phone: "+53 56911031",
  address: "Calle 2da entre 20 y 21, Bahía, Habana del Este, Edif La Muralla",
  hours: "Martes - Lunes (10:00 am - 7:00 pm)",
  story:
    "La Casa Del Arabe nace del deseo de acercar fragancias de autor a quienes buscan algo único. Seleccionamos aromas con carácter, cuidando cada detalle para convertir el acto de perfumarse en un ritual.",
  instagram: "https://www.instagram.com/la_casa_del_arabe_",
};

export function money(value: number) {
  return `$${value.toLocaleString("es-MX")}`;
}
