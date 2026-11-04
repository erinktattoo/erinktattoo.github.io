/* =====================================================================
   PREMIOS: LOS QUE SALEN EN LA SECCIÓN "PREMIOS"
   ---------------------------------------------------------------------
   CÓMO AÑADIR UN PREMIO NUEVO
   1. Si tienes foto del trofeo: abre herramientas/convertir-fotos.html
      en Chrome o Edge, elige "Foto de un premio", rellena los datos y
      convierte la foto. Te da 2 archivos (nombre-480.webp y
      nombre-960.webp) que van en la carpeta img/premios/ y la línea
      para pegar aquí.
      Sin foto: copia una de las líneas de abajo y cambia los datos.
   2. Pega la línea debajo de "AÑADE LOS PREMIOS NUEVOS AQUÍ".
      Los de arriba salen primero, y los premios del mismo evento y la
      misma ciudad salen juntos.

   Cada línea tiene:
     puesto       → el lugar en que quedaste: 1, 2 o 3
     categoria    → la categoría en español ("Blackwork", "Realismo B&G"...)
     categoria_en → la categoría en inglés (si la dejas vacía "" usa la española)
     evento       → el nombre del evento o la convención
     edicion      → el número de la edición (6 = "6ta edición"); "" si no tiene
     ciudad       → dónde fue; ciudad_en → en inglés ("" = igual que en español)
     anio         → el año; "" si no lo quieres poner
     foto         → el nombre de la foto del trofeo, SIN el "-480.webp" del
                    final; "" si no tienes foto
     modelo       → (opcional) el trofeo en 3D: el nombre del archivo de la
                    carpeta modelos/ sin el ".glb". Necesita también una
                    imagen con el mismo nombre en .webp (la que se ve antes
                    de girarlo). Los que tienen modelo salen en la vitrina.

   El número de premios de "Sobre mí" se cuenta solo.
   Fíjate en que cada línea termina en coma: },
   ===================================================================== */

var PREMIOS = [
  // ↓↓↓ AÑADE LOS PREMIOS NUEVOS AQUÍ (los de arriba salen primero) ↓↓↓

  { puesto: 3, categoria: "Tradicional americano", categoria_en: "American traditional", evento: "Lienzo Vivo", edicion: 6, ciudad: "La Habana", ciudad_en: "Havana", anio: 2026, foto: "lienzo-vivo-6", modelo: "trofeo_trad" },
  { puesto: 2, categoria: "Neotradicional",        categoria_en: "Neo-traditional",      evento: "Lienzo Vivo", edicion: 5, ciudad: "La Habana", ciudad_en: "Havana", anio: "",   foto: "lienzo-vivo-5", modelo: "trofeo_neo" },
  { puesto: 3, categoria: "Blackwork",             categoria_en: "Blackwork",            evento: "Lienzo Vivo", edicion: 3, ciudad: "La Habana", ciudad_en: "Havana", anio: "",   foto: "lienzo-vivo-3", modelo: "trofeo_black" },
  { puesto: 2, categoria: "Realismo B&G",          categoria_en: "Black & grey realism", evento: "UFC Tattoo",  edicion: "", ciudad: "Pinar del Río", ciudad_en: "", anio: "", foto: "" },
  { puesto: 2, categoria: "Neotradicional",        categoria_en: "Neo-traditional",      evento: "UFC Tattoo",  edicion: "", ciudad: "Pinar del Río", ciudad_en: "", anio: "", foto: "" },
];
