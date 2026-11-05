/* =====================================================================
   MERCH: LO QUE SALE EN LA SECCIÓN "MERCH"
   ---------------------------------------------------------------------
   El cliente elige tallas y cantidades y pulsa "Pedir por WhatsApp": se
   abre WhatsApp con el pedido ya escrito (qué, cuántas, qué talla y el
   total). El pago y la entrega se acuerdan por WhatsApp.

   Cada producto tiene:
     nombre / nombre_en           → cómo se llama, en español y en inglés
     precio                       → solo el número (10 = 10 USD)
     moneda                       → "USD"
     descripcion / descripcion_en → una frase sobre el producto
     fotos   → las fotos (en img/tienda/, cada una en -480.webp y -960.webp);
               texto es lo que sale debajo de la miniatura ("Delante"...)
     modelo  → el modelo 3D de la carpeta modelos/ (sin el ".glb"), con una
               imagen del mismo nombre en .webp; "" si no hay 3D
     tallas  → las tallas que hay; [] si no tiene tallas (sale "Cantidad")

   Para cambiar el precio, cambia el número de "precio".
   Para quitar una talla, bórrala de la lista (con sus comillas y su coma).
   Fíjate en que cada producto termina en coma: },
   ===================================================================== */

var TIENDA = [
  {
    nombre: "Camisa ER·INK",
    nombre_en: "ER·INK T-shirt",
    precio: 10,
    moneda: "USD",
    descripcion: "Negra, con el logo de ER·INK en rojo: pequeño en el pecho y grande en la espalda.",
    descripcion_en: "Black, with the ER·INK logo in red: small on the chest and large on the back.",
    fotos: [
      { foto: "camisa-frente", texto: "Delante", texto_en: "Front" },
      { foto: "camisa-espalda", texto: "Detrás", texto_en: "Back" },
    ],
    modelo: "camiseta_maniqui",
    tallas: ["M", "L", "XL"],
  },
];
