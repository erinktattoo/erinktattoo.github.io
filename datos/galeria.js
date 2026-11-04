/* =====================================================================
   PORTAFOLIO: LOS TATUAJES QUE SALEN EN LA GALERÍA
   ---------------------------------------------------------------------
   CÓMO AÑADIR UN TATUAJE NUEVO
   1. Abre herramientas/convertir-fotos.html en Chrome o Edge y convierte
      la foto. Te da 3 archivos (nombre-480.webp, nombre-960.webp,
      nombre-1600.webp) que van en la carpeta img/tatuajes/
   2. Copia la línea que te da el conversor y pégala abajo, debajo de
      "AÑADE LOS TATUAJES NUEVOS AQUÍ". Los de arriba salen primero.

   Cada línea tiene:
     foto      → el nombre de la foto, SIN el "-480.webp" del final
     titulo    → título en español
     titulo_en → título en inglés (si lo dejas vacío "" usa el español)
     estilo    → uno de los estilos de la lista ESTILOS de aquí abajo
     zona      → una de las zonas de la lista ZONAS (o escribe otra)

   Fíjate en que cada línea termina en coma: },
   Si algo deja de verse, casi siempre es una coma o unas comillas que
   faltan. Abre index.html en tu ordenador: si hay un error, sale un
   aviso rojo arriba de la galería.
   ===================================================================== */


/* ---------- ESTILOS (los botones para filtrar la galería) ----------
   ✏️ MODIFICAR: pon aquí los estilos que haces.
   Izquierda: la palabra que usas en cada tatuaje (minúsculas, sin
   espacios ni tildes). Derecha: cómo se ve en español y en inglés.
   Solo salen como filtro los estilos que tengan al menos un tatuaje. */
var ESTILOS = {
  "realismo":       { es: "Realismo",       en: "Realism" },
  "blackwork":      { es: "Blackwork",      en: "Blackwork" },
  "neotradicional": { es: "Neotradicional", en: "Neo-traditional" },
  "tradicional":    { es: "Tradicional",    en: "Traditional" },
  "japones":        { es: "Japonés",        en: "Japanese" },
  "fine-line":      { es: "Fine line",      en: "Fine line" },
  "anime":          { es: "Anime",          en: "Anime" }
};


/* ---------- ZONAS DEL CUERPO ----------
   Se usan en la galería y en el formulario de reserva.
   Puedes añadir más copiando una línea. */
var ZONAS = {
  "brazo":     { es: "Brazo",     en: "Arm" },
  "antebrazo": { es: "Antebrazo", en: "Forearm" },
  "hombro":    { es: "Hombro",    en: "Shoulder" },
  "mano":      { es: "Mano",      en: "Hand" },
  "pecho":     { es: "Pecho",     en: "Chest" },
  "espalda":   { es: "Espalda",   en: "Back" },
  "costillas": { es: "Costillas", en: "Ribs" },
  "pierna":    { es: "Pierna",    en: "Leg" },
  "muslo":     { es: "Muslo",     en: "Thigh" },
  "tobillo":   { es: "Tobillo",   en: "Ankle" },
  "cuello":    { es: "Cuello",    en: "Neck" }
};


/* ---------- LOS TATUAJES ----------
   Los trabajos de ER·INK. El estilo de cada uno se puede cambiar
   aquí mismo: tiene que ser una de las palabras de ESTILOS. */
var GALERIA = [

  // ↓↓↓ AÑADE LOS TATUAJES NUEVOS AQUÍ (los de arriba salen primero) ↓↓↓

  { foto: "grulla-sol-rojo", titulo: "Grulla y sol rojo", titulo_en: "Crane and red sun", estilo: "japones", zona: "espalda" },
  { foto: "zeus-brazo", titulo: "Zeus", titulo_en: "Zeus", estilo: "realismo", zona: "brazo" },
  { foto: "muerte-a-caballo", titulo: "La muerte a caballo", titulo_en: "Death on horseback", estilo: "tradicional", zona: "espalda" },
  { foto: "flores-en-negativo", titulo: "Flores en negativo", titulo_en: "Negative-space flowers", estilo: "blackwork", zona: "pierna" },
  { foto: "calavera-demoniaca", titulo: "Calavera demoníaca", titulo_en: "Demon skull", estilo: "realismo", zona: "espalda" },
  { foto: "cisne-y-peonias", titulo: "Cisne y peonías", titulo_en: "Swan and peonies", estilo: "neotradicional", zona: "brazo" },
  { foto: "dioses-griegos", titulo: "Dioses griegos", titulo_en: "Greek gods", estilo: "realismo", zona: "pierna" },
  { foto: "dragon-y-cerezos", titulo: "Dragón y cerezos", titulo_en: "Dragon and cherry blossoms", estilo: "fine-line", zona: "espalda" },
  { foto: "cardenal", titulo: "Cardenal", titulo_en: "Cardinal", estilo: "neotradicional", zona: "brazo" },
  { foto: "elefante", titulo: "Elefante", titulo_en: "Elephant", estilo: "realismo", zona: "antebrazo" },
  { foto: "rostro-y-calavera", titulo: "Rostro y calavera", titulo_en: "Face and skull", estilo: "realismo", zona: "brazo" },
  { foto: "llamas-negras", titulo: "Llamas negras", titulo_en: "Black flames", estilo: "blackwork", zona: "pierna" },
  { foto: "mascara-oni", titulo: "Máscara oni", titulo_en: "Oni mask", estilo: "japones", zona: "antebrazo" },
  { foto: "batman", titulo: "Batman", titulo_en: "Batman", estilo: "realismo", zona: "antebrazo" },
  { foto: "calavera-y-arana", titulo: "Calavera y araña", titulo_en: "Skull and spider", estilo: "realismo", zona: "antebrazo" },
  { foto: "crisantemo", titulo: "Crisantemo", titulo_en: "Chrysanthemum", estilo: "neotradicional", zona: "antebrazo" },
  { foto: "fenix", titulo: "Fénix", titulo_en: "Phoenix", estilo: "fine-line", zona: "hombro" },
  { foto: "polilla", titulo: "Polilla", titulo_en: "Moth", estilo: "neotradicional", zona: "antebrazo" },
  { foto: "serpiente-y-peonias", titulo: "Serpiente y peonías", titulo_en: "Snake and peonies", estilo: "fine-line", zona: "muslo" },
  { foto: "medusa", titulo: "Medusa", titulo_en: "Jellyfish", estilo: "fine-line", zona: "muslo" },
  { foto: "peonia", titulo: "Peonía", titulo_en: "Peony", estilo: "fine-line", zona: "muslo" },
  { foto: "ramo-de-flores", titulo: "Ramo de flores", titulo_en: "Flowers", estilo: "fine-line", zona: "antebrazo" },
  { foto: "murcielago-esqueleto", titulo: "Murciélago esqueleto", titulo_en: "Bat skeleton", estilo: "fine-line", zona: "espalda" },
  { foto: "trazos-negros", titulo: "Trazos negros", titulo_en: "Black strokes", estilo: "blackwork", zona: "antebrazo" },
  { foto: "brazo-blackwork", titulo: "Brazo en blackwork", titulo_en: "Blackwork sleeve", estilo: "blackwork", zona: "brazo" },
  { foto: "blackout-antebrazo", titulo: "Blackout", titulo_en: "Blackout", estilo: "blackwork", zona: "antebrazo" },
  { foto: "blackout-pierna", titulo: "Blackout de pierna", titulo_en: "Leg blackout", estilo: "blackwork", zona: "pierna" },
  { foto: "blast-over", titulo: "Blast over", titulo_en: "Blast over", estilo: "blackwork", zona: "pierna" },
  { foto: "estatua-en-llamas", titulo: "Estatua en llamas", titulo_en: "Statue in flames", estilo: "realismo", zona: "antebrazo" },
  { foto: "espartano", titulo: "Espartano", titulo_en: "Spartan", estilo: "realismo", zona: "antebrazo" },
  { foto: "flor-oscura", titulo: "Flor oscura", titulo_en: "Dark flower", estilo: "blackwork", zona: "antebrazo" },
  { foto: "flor-y-petalos", titulo: "Flor y pétalos", titulo_en: "Flower and petals", estilo: "fine-line", zona: "pierna" },
  { foto: "personaje-anime", titulo: "Personaje de anime", titulo_en: "Anime character", estilo: "anime", zona: "pierna" },
  { foto: "grulla-de-cerca", titulo: "Grulla y sol rojo, de cerca", titulo_en: "Crane and red sun, close-up", estilo: "japones", zona: "espalda" },

];
