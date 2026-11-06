/* =====================================================================
   ER·INK · funcionamiento de la página
   ---------------------------------------------------------------------
   No hace falta tocar este archivo para el día a día: los tatuajes,
   los viajes y los datos de contacto están en la carpeta datos/.
   ===================================================================== */

(function () {
  "use strict";

  window.erinkListo = true; // avisa al <head> de que este archivo cargó (ver "animable")
  var idioma = document.documentElement.lang === "en" ? "en" : "es";
  var T = TEXTOS[idioma];
  // La página en inglés está en en/, así que las imágenes quedan una carpeta arriba.
  var raiz = idioma === "en" ? "../" : "";
  var enLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  // Si un archivo de datos tiene un error de escritura, su variable no existe.
  var config = window.CONFIG || {};
  var estilos = window.ESTILOS || {};
  var zonas = window.ZONAS || {};
  var galeria = Array.isArray(window.GALERIA) ? window.GALERIA.filter(Boolean) : null;
  // Lo publica la app Er Ink Agenda; null hasta la primera vez.
  var disponibilidad = window.DISPONIBILIDAD && window.DISPONIBILIDAD.dias ? window.DISPONIBILIDAD : null;
  // Viajes y eventos: los que apunta el tatuador en la app (llegan con los días
  // libres). Mientras la app no publique, los de datos/viajes.js.
  var viajesApp = disponibilidad && Array.isArray(disponibilidad.viajes) ? disponibilidad.viajes : null;
  var viajes = viajesApp ? viajesApp.filter(Boolean)
    : Array.isArray(window.VIAJES) ? window.VIAJES.filter(Boolean) : null;

  /* ---------- Utilidades ---------- */

  // Edad y años tatuando, siempre al día ("Sobre mí").
  function anosDesde(fecha) {
    var desde = new Date(fecha), ahora = new Date();
    var anos = ahora.getFullYear() - desde.getFullYear();
    var antes = ahora.getMonth() < desde.getMonth() ||
      (ahora.getMonth() === desde.getMonth() && ahora.getDate() < desde.getDate());
    return antes ? anos - 1 : anos;
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-edad]"), function (n) {
    n.textContent = anosDesde(n.getAttribute("data-edad") + "T12:00:00");
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-desde]"), function (n) {
    n.textContent = new Date().getFullYear() - Number(n.getAttribute("data-desde"));
  });

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] != null) n.setAttribute(k, attrs[k]);
      });
    }
    if (hijos != null) {
      (Array.isArray(hijos) ? hijos : [hijos]).forEach(function (h) {
        if (h != null) n.appendChild(typeof h === "string" ? document.createTextNode(h) : h);
      });
    }
    return n;
  }

  function rellenar(texto, datos) {
    return texto.replace(/\{(\w+)\}/g, function (_, k) { return datos[k] != null ? datos[k] : ""; });
  }

  // Busca la traducción de un estilo o una zona; si no está en la lista, devuelve lo escrito.
  function traducir(lista, clave) {
    var x = clave && lista[clave];
    return x ? (x[idioma] || x.es) : (clave || "");
  }

  function avisoError(contenedor, archivo) {
    console.error("ER·INK: " + rellenar(TEXTOS.es.errorDatos, { archivo: archivo }));
    if (enLocal && contenedor) {
      contenedor.parentNode.insertBefore(
        el("p", { class: "aviso-error", role: "alert" }, rellenar(T.errorDatos, { archivo: archivo })),
        contenedor
      );
    }
  }

  function telefonoBonito(num) {
    var n = String(num || "").replace(/\D/g, "");
    if (/^53\d{8}$/.test(n)) return "+53 " + n.slice(2, 6) + " " + n.slice(6);
    return "+" + n;
  }

  /* ---------- Idioma: recordar la elección ---------- */

  $$("[data-idioma]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("idioma", a.getAttribute("data-idioma")); } catch (e) {}
      // Mantiene la sección en la que estaba el visitante.
      a.href = a.getAttribute("href").split("#")[0] + location.hash;
    });
  });

  /* ---------- Menú del móvil ---------- */

  var menuBtn = $(".menu-btn");
  var nav = $("#nav");

  function cerrarMenu() {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", "false");
    nav.classList.remove("abierta");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var abrir = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", String(abrir));
      nav.classList.toggle("abierta", abrir);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrarMenu();
    });
    // Tocar fuera del panel (en la parte oscurecida) también lo cierra.
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("abierta") && !nav.contains(e.target) && !menuBtn.contains(e.target)) cerrarMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("abierta")) {
        cerrarMenu();
        menuBtn.focus();
      }
    });
  }

  /* ---------- Enlaces de contacto (salen de datos/config.js) ---------- */

  if (config.whatsapp) {
    $$("[data-wa]").forEach(function (a) {
      var texto = a.getAttribute("data-wa") === "saludo" ? T.waRapido : "";
      a.href = "https://wa.me/" + config.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");
    });
    $$("[data-texto='whatsapp']").forEach(function (n) { n.textContent = telefonoBonito(config.whatsapp); });
  }
  if (config.email) {
    $$("[data-email]").forEach(function (a) { a.href = "mailto:" + config.email; });
    $$("[data-texto='email']").forEach(function (n) { n.textContent = config.email; });
  }
  if (config.instagram) {
    $$("[data-ig]").forEach(function (a) { a.href = "https://www.instagram.com/" + config.instagram + "/"; });
    $$("[data-texto='instagram']").forEach(function (n) { n.textContent = "@" + config.instagram; });
  }
  $$("[data-anio]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- Galería ---------- */

  var listaGaleria = $("#galeria");
  var cajaFiltros = $("#filtros");
  var btnMas = $("#ver-mas");
  // Fotos que se cargan de golpe (el resto con "Ver más"): 6 en el móvil, 12 en pantallas grandes.
  var POR_TANDA = window.matchMedia && matchMedia("(max-width: 599px)").matches ? 6 : 12;
  var filtro = "todos";
  var visibles = [];
  var mostrados = 0;

  function rutaFoto(foto, ancho) {
    return raiz + "img/tatuajes/" + foto + "-" + ancho + ".webp";
  }

  function tituloDe(t) {
    return (idioma === "en" && t.titulo_en) ? t.titulo_en : (t.titulo || "");
  }

  function detalleDe(t) {
    return [traducir(estilos, t.estilo), traducir(zonas, t.zona)].filter(Boolean).join(" · ");
  }

  // Texto alternativo: "León. Tatuaje de realismo, antebrazo." / "Lion. Realism tattoo, forearm."
  function textoAlt(t) {
    var estilo = traducir(estilos, t.estilo);
    var zona = traducir(zonas, t.zona).toLowerCase();
    var frase = idioma === "en"
      ? (estilo ? estilo + " tattoo" : "Tattoo")
      : "Tatuaje" + (estilo ? " de " + estilo.toLowerCase() : "");
    return (tituloDe(t) ? tituloDe(t) + ". " : "") + frase + (zona ? ", " + zona : "") + ".";
  }

  // i: posición en la galería; orden: posición dentro de la tanda (para aparecer una tras otra)
  function tarjetaFoto(t, i, orden) {
    var img = el("img", {
      loading: "lazy",
      decoding: "async",
      width: "480",
      height: "600",
      alt: textoAlt(t),
      sizes: "(min-width: 1260px) 300px, (min-width: 960px) 25vw, (min-width: 600px) 33vw, 50vw",
      srcset: rutaFoto(t.foto, 480) + " 480w, " + rutaFoto(t.foto, 960) + " 960w",
      src: rutaFoto(t.foto, 480)
    });
    var boton = el("button", { type: "button", class: "galeria-item", "data-i": String(i) }, img);
    img.addEventListener("error", function () {
      img.style.visibility = "hidden";
      console.warn("ER·INK: falta la foto " + rutaFoto(t.foto, 480));
      boton.appendChild(el("span", { class: "sin-foto-txt" },
        enLocal ? "Falta " + rutaFoto(t.foto, 480) : tituloDe(t)));
    });
    return el("li", { style: "--i:" + orden }, boton);
  }

  function mostrarMas() {
    var desde = mostrados;
    var hasta = Math.min(mostrados + POR_TANDA, visibles.length);
    var frag = document.createDocumentFragment();
    for (var i = desde; i < hasta; i++) frag.appendChild(tarjetaFoto(visibles[i], i, i - desde));
    listaGaleria.appendChild(frag);
    mostrados = hasta;
    var quedan = visibles.length - mostrados;
    btnMas.hidden = quedan <= 0;
    btnMas.textContent = T.verMas + " (" + quedan + ")";
    return desde;
  }

  function aplicarFiltro(clave) {
    filtro = clave;
    $$(".filtro", cajaFiltros).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filtro") === clave));
    });
    visibles = clave === "todos" ? galeria : galeria.filter(function (t) { return t.estilo === clave; });
    mostrados = 0;
    listaGaleria.textContent = "";
    mostrarMas();
  }

  function pintarFiltros() {
    var cuenta = {};
    galeria.forEach(function (t) { if (t.estilo) cuenta[t.estilo] = (cuenta[t.estilo] || 0) + 1; });
    // Primero en el orden de ESTILOS; después cualquier estilo escrito que no esté en la lista.
    var claves = Object.keys(estilos).filter(function (k) { return cuenta[k]; });
    Object.keys(cuenta).forEach(function (k) { if (claves.indexOf(k) < 0) claves.push(k); });

    function boton(clave, nombre, n) {
      return el("button", {
        type: "button",
        class: "filtro",
        "data-filtro": clave,
        "aria-pressed": String(clave === filtro)
      }, [nombre, el("span", { class: "filtro-n" }, String(n))]);
    }

    cajaFiltros.appendChild(boton("todos", T.todos, galeria.length));
    claves.forEach(function (k) { cajaFiltros.appendChild(boton(k, traducir(estilos, k), cuenta[k])); });
    cajaFiltros.hidden = claves.length < 2;

    cajaFiltros.addEventListener("click", function (e) {
      var b = e.target.closest(".filtro");
      if (b && b.getAttribute("data-filtro") !== filtro) aplicarFiltro(b.getAttribute("data-filtro"));
    });
  }

  if (listaGaleria) {
    if (!galeria) {
      avisoError(listaGaleria, "datos/galeria.js");
      galeria = [];
    }
    galeria = galeria.filter(function (t) { return t.foto; });

    if (galeria.length) {
      pintarFiltros();
      aplicarFiltro("todos");
      btnMas.addEventListener("click", function () {
        var primeraNueva = mostrarMas();
        var b = listaGaleria.children[primeraNueva] && listaGaleria.children[primeraNueva].querySelector("button");
        if (b) b.focus();
      });
      listaGaleria.addEventListener("click", function (e) {
        var b = e.target.closest(".galeria-item");
        if (b) abrirVisor(visibles.map(fotoTatuaje), Number(b.getAttribute("data-i")), b);
      });
    } else {
      listaGaleria.parentNode.insertBefore(el("p", { class: "galeria-vacia" }, T.galeriaVacia), listaGaleria);
    }
  }

  /* ---------- Visor de fotos ---------- */

  var visor = $("#visor");
  var escenario = $(".visor-escenario");
  var visorImg = $("#visor-img");
  var enVisor = []; // las fotos que se recorren: { src, srcset, alt, titulo, detalle }
  var actual = 0;
  var disparador = null;
  var conHistoria = false;
  var huboDeslizamiento = false;
  // En el móvil carga la foto de 960 px para ahorrar datos; en escritorio la de 1600 px.
  var TAMANOS_VISOR = "(min-width: 1000px) 90vw, 320px";

  function fotoTatuaje(t) {
    return {
      src: rutaFoto(t.foto, 960),
      srcset: rutaFoto(t.foto, 960) + " 960w, " + rutaFoto(t.foto, 1600) + " 1600w",
      alt: textoAlt(t),
      titulo: tituloDe(t),
      detalle: detalleDe(t)
    };
  }

  function precargar(f) {
    if (!f) return;
    var p = new Image();
    p.sizes = TAMANOS_VISOR;
    p.srcset = f.srcset;
  }

  function mostrarEnVisor(i) {
    var n = enVisor.length;
    actual = (i + n) % n;
    var f = enVisor[actual];
    if (visorImg.getAttribute("srcset") !== f.srcset) {
      escenario.classList.add("cargando");
      visorImg.sizes = TAMANOS_VISOR;
      visorImg.srcset = f.srcset;
      visorImg.src = f.src;
    }
    visorImg.alt = f.alt;
    $("#visor-titulo").textContent = f.titulo;
    $("#visor-detalle").textContent = f.detalle;
    $("#visor-contador").textContent = (actual + 1) + " " + T.de + " " + n;
    if (n > 1) precargar(enVisor[(actual + 1) % n]);
  }

  function abrirVisor(fotos, i, desde) {
    if (!visor) return;
    enVisor = fotos;
    disparador = desde || null;
    mostrarEnVisor(i);
    var varias = enVisor.length > 1;
    $(".visor-ant").hidden = !varias;
    $(".visor-sig").hidden = !varias;
    if (typeof visor.showModal === "function") visor.showModal();
    else visor.setAttribute("open", "");
    document.documentElement.classList.add("visor-abierto");
    // Así el botón "atrás" del móvil cierra el visor en vez de salir de la página.
    try { history.pushState({ visor: true }, ""); conHistoria = true; } catch (e) {}
  }

  if (visor) {
    visorImg.addEventListener("load", function () { escenario.classList.remove("cargando"); });
    visorImg.addEventListener("error", function () { escenario.classList.remove("cargando"); });

    $(".visor-ant").addEventListener("click", function () { mostrarEnVisor(actual - 1); });
    $(".visor-sig").addEventListener("click", function () { mostrarEnVisor(actual + 1); });
    $(".visor-cerrar").addEventListener("click", function () { visor.close(); });

    visor.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") mostrarEnVisor(actual - 1);
      if (e.key === "ArrowRight") mostrarEnVisor(actual + 1);
    });

    visor.addEventListener("close", function () {
      document.documentElement.classList.remove("visor-abierto");
      if (conHistoria) { conHistoria = false; history.back(); }
      if (disparador) disparador.focus();
    });

    window.addEventListener("popstate", function () {
      if (visor.open) { conHistoria = false; visor.close(); }
    });

    // Deslizar con el dedo para pasar de foto.
    var x0 = null, y0 = null;
    escenario.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      x0 = e.clientX; y0 = e.clientY;
    });
    escenario.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) && enVisor.length > 1) {
        huboDeslizamiento = true;
        mostrarEnVisor(actual + (dx < 0 ? 1 : -1));
      }
    });
    escenario.addEventListener("pointercancel", function () { x0 = null; });

    // Tocar fuera de la foto la cierra.
    escenario.addEventListener("click", function (e) {
      if (huboDeslizamiento) { huboDeslizamiento = false; return; }
      if (e.target === escenario) visor.close();
    });
  }

  /* ---------- Premios (datos/premios.js) ---------- */

  // 3 → "3er" / "3rd" (lugar). Con femenino: 6 → "6ta" (edición).
  function ordinal(n, femenino) {
    n = Number(n);
    if (idioma === "en") {
      var dos = n % 100, uno = n % 10;
      return n + (dos > 10 && dos < 14 ? "th" : uno === 1 ? "st" : uno === 2 ? "nd" : uno === 3 ? "rd" : "th");
    }
    var fin = femenino
      ? ["ma", "ra", "da", "ra", "ta", "ta", "ta", "ma", "va", "na"]
      : ["mo", "er", "do", "er", "to", "to", "to", "mo", "vo", "no"];
    return n + fin[n % 10];
  }

  var cajaPremios = $("#lista-premios");
  var premios = Array.isArray(window.PREMIOS)
    ? window.PREMIOS.filter(function (p) { return p && p.categoria && Number(p.puesto) > 0; })
    : null;

  function categoriaDe(p) { return (idioma === "en" && p.categoria_en) ? p.categoria_en : p.categoria; }
  function ciudadPremio(p) { return (idioma === "en" && p.ciudad_en) ? p.ciudad_en : (p.ciudad || ""); }
  function rutaPremio(foto, ancho) { return raiz + "img/premios/" + foto + "-" + ancho + ".webp"; }

  // "6ta edición · 2026" / "6th edition · 2026"
  function edicionDe(p) {
    return [p.edicion ? ordinal(p.edicion, true) + " " + T.edicion : "", p.anio ? String(p.anio) : ""]
      .filter(Boolean).join(" · ");
  }

  function fotoPremio(p) {
    var lugar = ordinal(p.puesto) + " " + T.lugar;
    return {
      src: rutaPremio(p.foto, 960),
      srcset: rutaPremio(p.foto, 480) + " 480w, " + rutaPremio(p.foto, 960) + " 960w",
      alt: rellenar(T.trofeo, { puesto: ordinal(p.puesto), categoria: categoriaDe(p), evento: p.evento }) + ".",
      titulo: lugar + " · " + categoriaDe(p),
      detalle: [p.evento, edicionDe(p), ciudadPremio(p)].filter(Boolean).join(" · ")
    };
  }

  if (premios) {
    // El número de premios de "Sobre mí" se cuenta solo.
    $$("[data-premios]").forEach(function (n) { n.textContent = premios.length; });
  }

  if (cajaPremios && !premios) avisoError(cajaPremios, "datos/premios.js");

  if (cajaPremios && premios && !premios.length) {
    // Sin premios apuntados, la sección no sale (ni en el menú).
    $("#premios").hidden = true;
    $$('a[href="#premios"]').forEach(function (a) { a.parentNode.hidden = true; });
  }

  if (cajaPremios && premios && premios.length) {
    var conFoto = premios.filter(function (p) { return p.foto; });
    // Los del mismo evento y ciudad, juntos, en el orden en que salen en el archivo.
    var grupos = [];
    premios.forEach(function (p) {
      var clave = p.evento + "|" + (p.ciudad || "");
      var g = grupos.filter(function (x) { return x.clave === clave; })[0];
      if (!g) grupos.push(g = { clave: clave, evento: p.evento, ciudad: ciudadPremio(p), lista: [] });
      g.lista.push(p);
    });

    grupos.forEach(function (g) {
      var filas = g.lista.map(function (p) {
        var numero = ordinal(p.puesto);
        var hijos = [
          el("p", { class: "premio-puesto" }, [
            el("span", { class: "premio-n" }, [String(Number(p.puesto)), el("sup", null, numero.slice(String(Number(p.puesto)).length))]),
            el("span", { class: "premio-lugar" }, T.lugar)
          ]),
          el("div", { class: "premio-texto" }, [
            el("h4", { class: "premio-cat" }, categoriaDe(p)),
            edicionDe(p) ? el("p", { class: "premio-meta" }, edicionDe(p)) : null
          ])
        ];
        if (p.foto) {
          var f = fotoPremio(p);
          var img = el("img", {
            loading: "lazy", decoding: "async", width: "480", height: "480",
            sizes: "(min-width: 600px) 104px, 80px", srcset: f.srcset, src: rutaPremio(p.foto, 480), alt: f.alt
          });
          var boton = el("button", { type: "button", class: "premio-foto", "data-foto": String(conFoto.indexOf(p)) }, img);
          img.addEventListener("error", function () {
            console.warn("ER·INK: falta la foto " + rutaPremio(p.foto, 480));
            boton.hidden = true;
          });
          hijos.push(boton);
        }
        return el("li", { class: "premio" + (p.foto ? " con-foto" : "") }, hijos);
      });
      cajaPremios.appendChild(el("div", { class: "premio-grupo" }, [
        el("h3", { class: "premio-evento" }, g.evento),
        g.ciudad ? el("p", { class: "premio-ciudad" }, g.ciudad) : null,
        el("ol", { class: "premio-lista" }, filas)
      ]));
    });

    cajaPremios.addEventListener("click", function (e) {
      var b = e.target.closest(".premio-foto");
      if (b) abrirVisor(conFoto.map(fotoPremio), Number(b.getAttribute("data-foto")), b);
    });

    // Vitrina: los trofeos que tienen modelo 3D (modelos/<modelo>.glb).
    var vitrina = $("#vitrina");
    var con3D = premios.filter(function (p) { return p.modelo; });
    if (vitrina && con3D.length) {
      con3D.forEach(function (p) {
        var nombre = ordinal(p.puesto) + " " + T.lugar + " · " + categoriaDe(p);
        vitrina.appendChild(el("figure", { class: "vitrina-item" }, [
          caja3D(p.modelo, nombre),
          el("figcaption", null, [
            el("span", { class: "vitrina-puesto" }, ordinal(p.puesto) + " " + T.lugar),
            el("span", { class: "vitrina-cat" }, categoriaDe(p)),
            el("span", { class: "vitrina-evento" }, [p.evento, p.anio ? String(p.anio) : edicionDe(p)].filter(Boolean).join(" · "))
          ])
        ]));
      });
      vitrina.hidden = false;
    }
  }

  /* ---------- Merch (datos/tienda.js) ---------- */

  var cajaTienda = $("#lista-tienda");
  var productos = Array.isArray(window.TIENDA)
    ? window.TIENDA.filter(function (p) { return p && p.nombre && Number(p.precio) >= 0; })
    : null;

  function nombreProducto(p) { return (idioma === "en" && p.nombre_en) ? p.nombre_en : p.nombre; }
  function rutaTienda(foto, ancho) { return raiz + "img/tienda/" + foto + "-" + ancho + ".webp"; }
  function dinero(cantidad, moneda) { return cantidad + " " + (moneda || "USD"); }

  if (cajaTienda && !productos) avisoError(cajaTienda, "datos/tienda.js");
  if (cajaTienda && productos && !productos.length) {
    $("#merch").hidden = true;
    $$('a[href="#merch"]').forEach(function (a) { a.parentNode.hidden = true; });
  }

  function pintarProducto(p) {
    var nombre = nombreProducto(p);
    var fotos = (p.fotos || []).filter(function (f) { return f && f.foto; });
    var tallas = Array.isArray(p.tallas) && p.tallas.length ? p.tallas : [""];
    var pedido = {};
    tallas.forEach(function (t) { pedido[t] = 0; });

    // --- Vista: fotos (2D) o modelo 3D ---
    function vistaDe(f) {
      return (idioma === "en" && f.texto_en) ? f.texto_en : (f.texto || "");
    }
    function fotoVisor(f) {
      return {
        src: rutaTienda(f.foto, 960),
        srcset: rutaTienda(f.foto, 480) + " 480w, " + rutaTienda(f.foto, 960) + " 960w",
        alt: rellenar(T.fotoDe, { nombre: nombre, vista: vistaDe(f) }),
        titulo: nombre,
        detalle: vistaDe(f)
      };
    }
    var vista = el("div", { class: "producto-vista" });
    var zonaFotos = null, zona3D = null;

    function imagenTienda(f) {
      return el("img", {
        src: rutaTienda(f.foto, 960), srcset: fotoVisor(f).srcset, sizes: "(min-width: 900px) 520px, 100vw",
        alt: fotoVisor(f).alt, width: "960", height: "1200", loading: "lazy", decoding: "async"
      });
    }

    // Delante y detrás: la foto se da la vuelta como la tarjeta de la portada.
    function fotosVoltear() {
      var caras = fotos.slice(0, 2).map(function (f, i) {
        return el("div", { class: "foto-cara" + (i ? " foto-cara-dorso" : ""), "aria-hidden": i ? "true" : null }, [
          imagenTienda(f),
          vistaDe(f) ? el("span", { class: "foto-etiqueta" }, vistaDe(f)) : null,
          el("button", { type: "button", class: "voltear", "aria-pressed": "false", "aria-label": T.voltearFoto },
            [icono("i-girar"), el("span", null, T.voltear)])
        ]);
      });
      caras[1].setAttribute("inert", "");
      var giro = el("div", { class: "foto-giro", role: "group", "aria-label": nombre }, el("div", { class: "foto-giro-in" }, caras));
      giro.addEventListener("click", function () {
        var atras = !giro.classList.contains("volteada");
        giro.classList.toggle("volteada", atras);
        $$(".voltear", giro).forEach(function (b) { b.setAttribute("aria-pressed", String(atras)); });
        caras[0].toggleAttribute("inert", atras);
        caras[0].setAttribute("aria-hidden", String(atras));
        caras[1].toggleAttribute("inert", !atras);
        caras[1].setAttribute("aria-hidden", String(!atras));
      });
      return el("div", { class: "producto-fotos" }, giro);
    }

    // Las fotos se pasan de lado (con el dedo, las flechas o los botones de abajo).
    function fotosDeslizar() {
      var pista = el("div", { class: "slider-pista", tabindex: "0", role: "group", "aria-label": nombre });
      var puntos = el("div", { class: "slider-puntos" });
      var actual = 0;
      var ant = el("button", { type: "button", class: "slider-flecha slider-ant", "aria-label": T.fotoAnterior }, icono("i-izq"));
      var sig = el("button", { type: "button", class: "slider-flecha slider-sig", "aria-label": T.fotoSiguiente }, icono("i-der"));
      function ir(i) {
        i = Math.max(0, Math.min(fotos.length - 1, i));
        pista.scrollTo({ left: i * pista.clientWidth, behavior: "smooth" });
      }
      function marcar() {
        actual = Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
        $$("button", puntos).forEach(function (b, i) { b.setAttribute("aria-current", String(i === actual)); });
        ant.disabled = actual === 0;
        sig.disabled = actual === fotos.length - 1;
      }
      fotos.forEach(function (f, i) {
        var b = el("button", { type: "button", class: "foto-slide" }, imagenTienda(f));
        b.addEventListener("click", function () { abrirVisor(fotos.map(fotoVisor), i, b); });
        pista.appendChild(b);
        var punto = el("button", { type: "button", "aria-current": String(i === 0) }, vistaDe(f) || String(i + 1));
        punto.addEventListener("click", function () { ir(i); });
        puntos.appendChild(punto);
      });
      ant.addEventListener("click", function () { ir(actual - 1); });
      sig.addEventListener("click", function () { ir(actual + 1); });
      pista.addEventListener("scroll", function () { requestAnimationFrame(marcar); }, { passive: true });
      marcar();
      return el("div", { class: "producto-fotos foto-slider" }, [
        el("div", { class: "slider-marco" }, [pista, ant, sig]),
        fotos.length > 1 ? puntos : null
      ]);
    }

    if (fotos.length) zonaFotos = (p.vista === "voltear" && fotos.length === 2) ? fotosVoltear() : fotosDeslizar();
    if (p.modelo) zona3D = caja3D(p.modelo, nombre, p.orbita || "25deg 82deg auto");

    if (zonaFotos && zona3D) {
      // Las dos maneras de verla: fotos o 3D.
      var tabFotos = el("button", { type: "button", "aria-pressed": "true" }, T.fotos);
      var tab3D = el("button", { type: "button", "aria-pressed": "false" }, [icono("i-3d"), "3D"]);
      var tabs = el("div", { class: "vista-tabs", role: "group", "aria-label": nombre }, [tabFotos, tab3D]);
      zona3D.hidden = true;
      tabFotos.addEventListener("click", function () {
        tabFotos.setAttribute("aria-pressed", "true"); tab3D.setAttribute("aria-pressed", "false");
        zonaFotos.hidden = false; zona3D.hidden = true;
      });
      tab3D.addEventListener("click", function () {
        tab3D.setAttribute("aria-pressed", "true"); tabFotos.setAttribute("aria-pressed", "false");
        zonaFotos.hidden = true; zona3D.hidden = false;
        activar3D(zona3D); // quien elige 3D lo quiere ver ya
      });
      vista.appendChild(tabs);
    }
    if (zonaFotos) vista.appendChild(zonaFotos);
    if (zona3D) vista.appendChild(zona3D);

    // --- Tallas y cantidades ---
    var total = el("p", { class: "producto-total", "aria-live": "polite" });
    var pedir = el("a", { class: "btn", href: "#", target: "_blank", rel: "noopener", "aria-disabled": "true" },
      [icono("i-wa"), T.pedir]);
    var aviso = el("p", { class: "producto-aviso", hidden: "" }, T.eligeTalla);

    function unidades(n) { return n === 1 ? T.unidad : T.unidades; }
    function actualizar() {
      var n = 0;
      var lineas = [];
      tallas.forEach(function (t) {
        if (!pedido[t]) return;
        n += pedido[t];
        lineas.push(rellenar(t ? T.msgPedido.linea : T.msgPedido.lineaSin, { n: pedido[t], nombre: nombre, talla: t }));
      });
      var precio = dinero(n * Number(p.precio), p.moneda);
      total.textContent = n ? rellenar(T.totalPedido, { precio: precio, n: n, unidades: unidades(n) }) : "";
      if (n) {
        var texto = [T.msgPedido.saludo].concat(lineas, [
          rellenar(T.msgPedido.total, { precio: precio, n: n, unidades: unidades(n) }), "", T.msgPedido.pie
        ]).join("\n");
        pedir.href = "https://wa.me/" + (config.whatsapp || "5356363391") + "?text=" + encodeURIComponent(texto);
        pedir.removeAttribute("aria-disabled");
        aviso.hidden = true;
      } else {
        pedir.href = "#";
        pedir.setAttribute("aria-disabled", "true");
      }
    }
    pedir.addEventListener("click", function (e) {
      if (pedir.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        aviso.hidden = false;
        var primero = $(".contador-mas", lista);
        if (primero) primero.focus();
      }
    });

    var lista = el("div", { class: "tallas-lista" });
    tallas.forEach(function (t) {
      var valor = el("output", { "aria-live": "polite" }, "0");
      var menos = el("button", { type: "button", class: "contador-menos", disabled: "", "aria-label": t ? rellenar(T.menos, { talla: t }) : T.menosSin }, "−");
      var mas = el("button", { type: "button", class: "contador-mas", "aria-label": t ? rellenar(T.mas, { talla: t }) : T.masSin }, "+");
      var fila = el("div", { class: "talla" }, [
        el("span", { class: "talla-nombre" }, t || T.cantidad),
        el("span", { class: "contador" }, [menos, valor, mas])
      ]);
      function cambiar(d) {
        pedido[t] = Math.max(0, Math.min(20, pedido[t] + d));
        valor.textContent = String(pedido[t]);
        menos.disabled = pedido[t] === 0;
        mas.disabled = pedido[t] === 20;
        fila.classList.toggle("con-algo", pedido[t] > 0);
        actualizar();
      }
      menos.addEventListener("click", function () { cambiar(-1); });
      mas.addEventListener("click", function () { cambiar(1); });
      lista.appendChild(fila);
    });
    actualizar();

    var precio = el("p", { class: "producto-precio" }, [String(p.precio), el("span", null, " " + (p.moneda || "USD"))]);
    var desc = (idioma === "en" && p.descripcion_en) ? p.descripcion_en : (p.descripcion || "");
    var info = el("div", { class: "producto-info" }, [
      el("h3", null, nombre),
      precio,
      desc ? el("p", { class: "producto-desc" }, desc) : null,
      el("fieldset", { class: "tallas" }, [
        el("legend", null, tallas[0] ? T.tallaCantidad : T.cantidad),
        lista
      ]),
      total,
      pedir,
      aviso,
      el("p", { class: "producto-nota" }, T.notaPedido)
    ]);
    return el("article", { class: "producto" }, [vista, info]);
  }

  if (cajaTienda && productos && productos.length) {
    productos.forEach(function (p) { cajaTienda.appendChild(pintarProducto(p)); });
  }

  /* ---------- Próximas fechas ---------- */

  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  function fechaLocal(texto) {
    var p = String(texto || "").split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  var formatoFecha = null;
  try {
    formatoFecha = new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es-ES",
      { day: "numeric", month: "short", year: "numeric" });
  } catch (e) {}

  function rangoFechas(v) {
    var d = fechaLocal(v.desde), h = fechaLocal(v.hasta);
    if (!formatoFecha) return v.desde + " – " + v.hasta;
    if (formatoFecha.formatRange) return formatoFecha.formatRange(d, h);
    return formatoFecha.format(d) + " – " + formatoFecha.format(h);
  }

  var nombresPais = null;
  try { nombresPais = new Intl.DisplayNames([idioma], { type: "region" }); } catch (e) {}

  function nombrePais(codigo) {
    if (!codigo) return "";
    if (nombresPais && /^[A-Za-z]{2}$/.test(codigo)) {
      try { return nombresPais.of(codigo.toUpperCase()); } catch (e) {}
    }
    return codigo;
  }

  function ciudadDe(v) {
    return (idioma === "en" && v.ciudad_en) ? v.ciudad_en : v.ciudad;
  }

  function etiquetaViaje(v) {
    return ciudadDe(v) + ", " + nombrePais(v.pais) + " · " + rangoFechas(v);
  }

  var listaViajes = $("#viajes");
  if (listaViajes && !viajes) avisoError(listaViajes, "datos/viajes.js");

  // Solo los que no han terminado, ordenados por fecha de inicio.
  var proximos = (viajes || []).filter(function (v) {
    return v.ciudad && !isNaN(fechaLocal(v.desde)) && fechaLocal(v.hasta) >= hoy;
  }).sort(function (a, b) { return fechaLocal(a.desde) - fechaLocal(b.desde); });

  if (listaViajes) {
    if (!proximos.length) {
      // Sin ningún viaje ni evento planeado en la app, la sección no sale (ni en el menú).
      $("#fechas").hidden = true;
      $$('a[href="#fechas"]').forEach(function (a) { a.parentNode.hidden = true; });
    }
    proximos.forEach(function (v, i) {
      var fechas = el("p", { class: "ticket-fechas" }, el("time", { datetime: v.desde }, rangoFechas(v)));
      if (fechaLocal(v.desde) <= hoy) fechas.appendChild(el("span", { class: "ticket-ahora" }, T.ahora));
      if (v.tipo === "evento") fechas.appendChild(el("span", { class: "ticket-evento" }, T.evento));
      var lugar = [nombrePais(v.pais), v.estudio].filter(Boolean).join(" · ");
      listaViajes.appendChild(el("li", { class: "ticket marco relleno" }, [
        fechas,
        el("h3", { class: "ticket-ciudad" }, ciudadDe(v)),
        el("p", { class: "ticket-lugar" }, lugar),
        el("a", { class: "btn-linea", href: "#solicitud", "data-viaje": String(i) },
          rellenar(T.reservarEn, { ciudad: ciudadDe(v) }))
      ]));
    });
    listaViajes.addEventListener("click", function (e) {
      var a = e.target.closest("[data-viaje]");
      var sel = $("#f-ciudad");
      if (a && sel) sel.value = "viaje-" + a.getAttribute("data-viaje");
    });
  }

  /* ---------- Días libres (datos/disponibilidad.js) ---------- */

  var locale = idioma === "en" ? "en-US" : "es-ES";

  function aMinutos(hhmm) { var p = String(hhmm).split(":"); return Number(p[0]) * 60 + Number(p[1]); }
  function dosCifras(n) { return (n < 10 ? "0" : "") + n; }
  function deMinutos(min) { return dosCifras(Math.floor(min / 60)) + ":" + dosCifras(min % 60); }
  // Siempre con AM/PM, como en la app: "3:00 PM".
  function horaBonita(min) {
    var h = Math.floor(min / 60);
    return (h % 12 || 12) + ":" + dosCifras(min % 60) + " " + (h < 12 ? "AM" : "PM");
  }
  function claveFecha(d) { return d.getFullYear() + "-" + dosCifras(d.getMonth() + 1) + "-" + dosCifras(d.getDate()); }

  function formato(opciones) {
    try { return new Intl.DateTimeFormat(locale, opciones); } catch (e) { return null; }
  }
  var fmtMes = formato({ month: "long", year: "numeric" });
  var fmtDiaLargo = formato({ weekday: "long", day: "numeric", month: "long" });
  var fmtDiaSemana = formato({ weekday: "narrow" });
  function conFormato(fmt, f) { return fmt ? fmt.format(fechaLocal(f)) : f; }

  // Dónde trabaja cada día: el viaje que lo incluye o, si no, el estudio.
  function lugarDe(fecha) {
    var d = fechaLocal(fecha);
    for (var i = 0; i < proximos.length; i++) {
      if (fechaLocal(proximos[i].desde) <= d && d <= fechaLocal(proximos[i].hasta)) return "viaje-" + i;
    }
    return "estudio";
  }

  // Horario de trabajo: los turnos de cada día de la semana (1 = lunes), por
  // ejemplo {"3": [["10:00","12:00"], ["13:30","18:00"]]}. Versiones viejas
  // de la app mandaban un solo turno igual para todos los días: ["10:00","19:00"].
  var horario = disponibilidad ? disponibilidad.horario : null;
  function turnosDe(fecha) {
    if (Array.isArray(horario)) return [horario.map(aMinutos)];
    if (!horario) return [];
    var dia = fechaLocal(fecha).getDay() || 7;
    return (horario[String(dia)] || []).map(function (t) { return [aMinutos(t[0]), aMinutos(t[1])]; });
  }

  // [{ fecha, bloques: [[inicio, fin] en minutos], estado, lugar }] de hoy en adelante.
  var dias = !disponibilidad ? [] : Object.keys(disponibilidad.dias).sort().filter(function (f) {
    return /^\d{4}-\d{2}-\d{2}$/.test(f) && fechaLocal(f) >= hoy;
  }).map(function (f) {
    var bloques = (disponibilidad.dias[f] || []).map(function (b) {
      return [aMinutos(b[0]), aMinutos(b[1])];
    }).filter(function (b) { return b[1] - b[0] >= 60; });
    // Libre "todo el día" si están libres todos sus turnos enteros.
    var turnos = turnosDe(f);
    var entero = turnos.length > 0 && bloques.length === turnos.length && turnos.every(function (t, i) {
      return bloques[i][0] <= t[0] && bloques[i][1] >= t[1];
    });
    return { fecha: f, bloques: bloques, lugar: lugarDe(f), estado: !bloques.length ? "lleno" : (entero ? "libre" : "parcial") };
  });
  var porFecha = {};
  dias.forEach(function (d) { porFecha[d.fecha] = d; });

  function textoEstado(dia) {
    if (dia.estado === "lleno") return T.estadoLleno;
    if (dia.estado === "libre") return T.estadoLibre;
    return rellenar(T.estadoParcial, {
      horas: dia.bloques.map(function (b) { return horaBonita(b[0]) + " – " + horaBonita(b[1]); }).join(", ")
    });
  }

  /* ---------- Números de las secciones ---------- */

  // Seguidos aunque alguna sección esté oculta (Fechas sin viajes, Premios o
  // Merch vacíos): 01, 02, 03... sin saltos.
  var numSeccion = 0;
  $$(".seccion").forEach(function (s) {
    var num = $(".seccion-num", s);
    if (s.hidden || !num) return;
    numSeccion++;
    var texto = Array.prototype.filter.call(num.childNodes, function (c) {
      return c.nodeType === 3 && c.textContent.trim();
    }).pop();
    if (texto) texto.textContent = (numSeccion < 10 ? "0" : "") + numSeccion;
  });

  /* ---------- Animaciones al llegar con el scroll ---------- */

  // Los títulos de sección y la galería aparecen cuando llegan a la pantalla
  // (la animación está en css/estilos.css, sección "Animaciones").
  if (document.documentElement.classList.contains("animable")) {
    // Títulos letra a letra: cada letra va en su <span> (el texto entero queda
    // en aria-label para los lectores de pantalla).
    $$(".seccion-cab h2").forEach(function (h) {
      var texto = h.textContent.trim();
      var cont = el("span", { "aria-hidden": "true" });
      var n = 0;
      texto.split(/(\s+)/).forEach(function (trozo) {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { cont.appendChild(document.createTextNode(" ")); return; }
        var palabra = el("span", { class: "titulo-palabra" });
        Array.from(trozo).forEach(function (letra) {
          palabra.appendChild(el("span", { class: "titulo-letra", style: "--l:" + n++ }, letra));
        });
        cont.appendChild(palabra);
      });
      h.setAttribute("aria-label", texto);
      h.textContent = "";
      h.appendChild(cont);
      h.style.setProperty("--n", n);
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visto");
          observador.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    $$(".seccion-cab, .galeria").forEach(function (n) { observador.observe(n); });
  }

  /* ---------- Portada: la tarjeta se voltea ---------- */

  // Al tocar la tarjeta (o el botón "Voltear") se da la vuelta. La cara que
  // queda detrás se marca "inert" para que sus enlaces no se puedan tocar.
  var tarjetaGiro = $("#tarjeta-giro");
  if (tarjetaGiro) {
    var botonesVoltear = $$(".voltear", tarjetaGiro); // uno en cada cara: giran con ella
    var caraFrente = $(".cara-frente", tarjetaGiro);
    var caraDorso = $(".cara-dorso", tarjetaGiro);
    var voltearTarjeta = function () {
      var atras = !tarjetaGiro.classList.contains("volteada");
      tarjetaGiro.classList.toggle("volteada", atras);
      botonesVoltear.forEach(function (b) { b.setAttribute("aria-pressed", String(atras)); });
      caraFrente.toggleAttribute("inert", atras);
      caraFrente.setAttribute("aria-hidden", String(atras));
      caraDorso.toggleAttribute("inert", !atras);
      caraDorso.setAttribute("aria-hidden", String(!atras));
    };
    botonesVoltear.forEach(function (b) { b.addEventListener("click", voltearTarjeta); });
    tarjetaGiro.addEventListener("click", function (e) {
      if (!e.target.closest("a, button")) voltearTarjeta();
    });
  }

  /* ---------- Modelos 3D (trofeos y merch) ---------- */

  // El visor 3D (js/vendor/model-viewer-umd.min.js, unos 900 KB) solo se
  // descarga cuando alguien pide ver un modelo: así no gasta datos a nadie más.
  var promesa3D = null;
  function cargarVisor3D() {
    if (window.customElements && customElements.get("model-viewer")) return Promise.resolve();
    if (!promesa3D) {
      promesa3D = new Promise(function (ok, mal) {
        var s = document.createElement("script");
        s.src = raiz + "js/vendor/model-viewer-umd.min.js";
        s.onload = function () { ok(); };
        s.onerror = function () { promesa3D = null; mal(new Error("model-viewer")); };
        document.head.appendChild(s);
      });
    }
    return promesa3D;
  }

  // Icono del sprite de la página (<svg><use href="#..."/></svg>) creado desde JavaScript.
  function icono(id) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    var u = document.createElementNS(ns, "use");
    s.setAttribute("aria-hidden", "true");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
  }

  function rutaModelo(modelo, ext) { return raiz + "modelos/" + modelo + "." + ext; }

  // Caja con la imagen del modelo y el botón "Girar en 3D".
  function caja3D(modelo, nombre, orbita) {
    var boton = el("button", { type: "button", class: "btn-linea ver-3d" }, [icono("i-3d"), el("span", null, T.ver3d)]);
    var caja = el("div", { class: "vista-3d", "data-modelo": modelo, "data-orbita": orbita || "" }, [
      el("img", { src: rutaModelo(modelo, "webp"), alt: "", width: "480", height: "600", loading: "lazy", decoding: "async" }),
      boton
    ]);
    caja.setAttribute("data-nombre", nombre);
    boton.addEventListener("click", function () { activar3D(caja); });
    return caja;
  }

  // Cambia la imagen por el modelo 3D, que se gira con el dedo o el ratón.
  function activar3D(caja) {
    if (caja.classList.contains("activa") || caja.classList.contains("cargando")) return;
    var texto = $(".ver-3d span", caja);
    var boton = $(".ver-3d", caja);
    caja.classList.add("cargando");
    if (texto) texto.textContent = T.cargando3d;
    function fallo() {
      caja.classList.remove("cargando");
      if (texto) texto.textContent = location.protocol === "file:" ? T.error3dLocal : T.error3d;
      if (boton) boton.disabled = true;
    }
    cargarVisor3D().then(function () {
      var modelo = caja.getAttribute("data-modelo");
      var mv = document.createElement("model-viewer");
      var atributos = {
        src: rutaModelo(modelo, "glb"),
        poster: rutaModelo(modelo, "webp"),
        alt: rellenar(T.modelo3d, { nombre: caja.getAttribute("data-nombre") }),
        "camera-controls": "",
        "auto-rotate": "",
        "auto-rotate-delay": "0",
        "rotation-per-second": "24deg",
        "interaction-prompt": "none",
        "disable-zoom": "",
        "disable-pan": "",
        "touch-action": "pan-y",
        "environment-image": "legacy",
        "shadow-intensity": "1",
        "camera-orbit": caja.getAttribute("data-orbita") || "20deg 78deg auto"
      };
      Object.keys(atributos).forEach(function (k) { mv.setAttribute(k, atributos[k]); });
      mv.addEventListener("load", function () {
        caja.classList.remove("cargando");
        caja.classList.add("activa");
      });
      mv.addEventListener("error", fallo);
      caja.appendChild(mv);
    }).catch(fallo);
  }

  /* ---------- Estrella de contacto (portada) ---------- */

  // Al tocar la estrella de ER✦INK se abre la tarjeta de contacto debajo de ella.
  var estrella = $(".portada .estrella-btn");
  var tarjeta = $("#tarjeta-contacto");

  function colocarTarjeta() {
    var caja = tarjeta.parentNode.getBoundingClientRect();
    var e = estrella.getBoundingClientRect();
    var ancho = tarjeta.offsetWidth;
    var centro = e.left + e.width / 2 - caja.left;
    tarjeta.style.left = Math.max(0, Math.min(centro - ancho / 2, caja.width - ancho)) + "px";
    tarjeta.style.top = (e.bottom - caja.top + 12) + "px";
  }

  function abrirTarjeta(abrir) {
    estrella.setAttribute("aria-expanded", String(abrir));
    tarjeta.hidden = !abrir;
    if (abrir) {
      colocarTarjeta();
      requestAnimationFrame(function () { tarjeta.classList.add("abierta"); });
    } else {
      tarjeta.classList.remove("abierta");
    }
  }

  if (estrella && tarjeta) {
    estrella.addEventListener("click", function () { abrirTarjeta(tarjeta.hidden); });
    document.addEventListener("click", function (e) {
      if (!tarjeta.hidden && !tarjeta.contains(e.target) && !estrella.contains(e.target)) abrirTarjeta(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !tarjeta.hidden) { abrirTarjeta(false); estrella.focus(); }
    });
    window.addEventListener("resize", function () { if (!tarjeta.hidden) colocarTarjeta(); });
  }

  /* ---------- Formulario de solicitud ---------- */

  var form = $("#form-cita");

  function opcion(valor, texto) { return el("option", { value: valor }, texto); }

  function llenarSelect(id, lista, extra) {
    var sel = $(id);
    if (!sel) return;
    sel.appendChild(opcion("", T.elige));
    Object.keys(lista).forEach(function (k) { sel.appendChild(opcion(k, traducir(lista, k))); });
    if (extra) sel.appendChild(opcion(extra[0], extra[1]));
  }

  function valor(id) {
    var c = $("#" + id);
    if (!c) return "";
    if (c.tagName === "SELECT") return c.value ? c.options[c.selectedIndex].text : "";
    return c.value.trim();
  }

  // Día y hora elegidos de los días libres ("" si no hay o si eligió "Otra fecha").
  function diaElegido() {
    var c = $("#campo-fecha"), s = $("#f-dia");
    return c && !c.hidden && s && porFecha[s.value] ? s.value : "";
  }
  function horaElegida() { return diaElegido() && $("#f-hora") ? $("#f-hora").value : ""; }

  // Última línea del mensaje, para la app: al compartir el mensaje con
  // Er Ink Agenda, la cita se abre ya rellena. La idea no va aquí: la app
  // la lee del propio mensaje.
  function codigoReserva() {
    var partes = ["#ERINK"];
    function par(clave, texto) {
      texto = String(texto || "").replace(/[|\r\n]+/g, " ").trim();
      if (texto) partes.push(clave + "=" + texto);
    }
    var sel = $("#f-ciudad");
    var lugar = sel ? sel.value : "";
    par("n", valor("f-nombre"));
    par("t", telefonoCompleto());
    par("d", diaElegido());
    par("h", horaElegida());
    par("l", lugar.indexOf("viaje-") === 0 ? ciudadDe(proximos[Number(lugar.slice(6))]) : lugar);
    par("e", $("#f-estilo") ? $("#f-estilo").value : "");
    par("z", $("#f-zona") ? $("#f-zona").value : "");
    par("s", valor("f-tamano"));
    par("i", idioma);
    return partes.join("|");
  }

  // Prefijos de WhatsApp: [país, prefijo]. Solo Cuba y Panamá; cualquier otro
  // país, con "Otro" (el cliente escribe su número con el + delante).
  var PREFIJOS = [["CU", "53"], ["PA", "507"]];

  function llenarPrefijos() {
    var sel = $("#f-prefijo");
    if (!sel) return;
    sel.textContent = "";
    PREFIJOS.forEach(function (p) {
      var o = opcion(p[0], "+" + p[1]);
      o.setAttribute("data-prefijo", p[1]);
      o.setAttribute("data-largo", "+" + p[1] + " " + nombrePais(p[0]));
      sel.appendChild(o);
    });
    sel.appendChild(opcion("otro", T.prefijoOtro));
    sel.value = "CU"; // siempre empieza en Cuba

    // El campo es estrecho: cerrado enseña solo el prefijo ("+53") y, al
    // abrirlo, la lista lleva también el país ("+53 Cuba").
    function nombresLargos(largos) {
      Array.prototype.forEach.call(sel.options, function (o) {
        var largo = o.getAttribute("data-largo");
        if (largo) o.textContent = largos ? largo : "+" + o.getAttribute("data-prefijo");
      });
    }
    sel.addEventListener("mousedown", function () { nombresLargos(true); });
    sel.addEventListener("touchstart", function () { nombresLargos(true); }, { passive: true });
    sel.addEventListener("change", function () { nombresLargos(false); });
    sel.addEventListener("blur", function () { nombresLargos(false); });

    var tel = $("#f-tel");
    function marcador() { tel.placeholder = sel.value === "otro" ? "+34 612 345 678" : (sel.value === "CU" ? "5123 4567" : "6123 4567"); }
    sel.addEventListener("change", marcador);
    marcador();
  }

  // Número completo en formato internacional (+5356363391), como lo espera la app.
  function telefonoCompleto() {
    var tel = $("#f-tel"), sel = $("#f-prefijo");
    var escrito = tel ? tel.value.trim() : "";
    var cifras = escrito.replace(/\D/g, "");
    if (!cifras) return "";
    // Si escribió el número con +, o eligió "Otro", vale tal cual.
    if (!sel || sel.value === "otro" || escrito.charAt(0) === "+") return "+" + cifras;
    var prefijo = sel.options[sel.selectedIndex].getAttribute("data-prefijo");
    return "+" + prefijo + cifras.replace(/^0+/, "");
  }

  function paisDelPrefijo() {
    var sel = $("#f-prefijo"), tel = $("#f-tel");
    if (!sel || sel.value === "otro" || !tel || !tel.value.trim() || tel.value.trim().charAt(0) === "+") return "";
    return nombrePais(sel.value);
  }

  function componer(paraWhatsapp) {
    var m = T.msg;
    var b = paraWhatsapp ? "*" : ""; // en WhatsApp, *texto* sale en negrita
    var lineas = [m.saludo, ""];
    function linea(etiqueta, texto) { if (texto) lineas.push(b + etiqueta + ":" + b + " " + texto); }
    linea(m.nombre, valor("f-nombre"));
    var tel = telefonoCompleto();
    linea(m.tel, tel.indexOf("+53") === 0 ? telefonoBonito(tel) : tel);
    linea(m.pais, paisDelPrefijo());
    linea(m.ciudad, valor("f-ciudad"));
    var dia = diaElegido();
    if (dia) linea(m.dia, conFormato(fmtDiaLargo, dia));
    var hora = horaElegida();
    if (hora) linea(m.hora, horaBonita(aMinutos(hora)));
    linea(m.estilo, valor("f-estilo"));
    linea(m.zona, valor("f-zona"));
    linea(m.tamano, valor("f-tamano"));
    if (!$("#campo-fechas") || !$("#campo-fechas").hidden) linea(m.fechas, valor("f-fechas"));
    var idea = valor("f-idea");
    if (idea) lineas.push("", b + m.idea + ":" + b, idea);
    lineas.push("", m.pie, codigoReserva());
    return lineas.join(paraWhatsapp ? "\n" : "\r\n");
  }

  function copiar(texto, boton) {
    function listo() {
      boton.textContent = T.copiado;
      setTimeout(function () { boton.textContent = T.copiar; }, 2000);
    }
    function aMano() {
      var area = $("#aviso-texto");
      area.focus();
      area.select();
      try { if (document.execCommand("copy")) listo(); } catch (e) {}
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(listo, aMano);
    } else {
      aMano();
    }
  }

  function mostrarAviso(via, texto) {
    var aviso = $("#aviso");
    if (!aviso) return;
    var msg = via === "email" ? rellenar(T.avisoEmail, { email: config.email }) : T.avisoWa;
    $("#aviso-msg").textContent = msg;
    $("#aviso-texto").value = texto;
    aviso.hidden = false;
    // Lo lee en voz alta el lector de pantalla (el cuadro estaba oculto).
    var vivo = $("#aviso-vivo");
    if (vivo) vivo.textContent = msg;
  }

  if (form) {
    llenarPrefijos();
    llenarSelect("#f-estilo", estilos, ["no-se", T.noSe]);
    llenarSelect("#f-zona", zonas, ["otra", T.otraZona]);

    var selCiudad = $("#f-ciudad");
    if (selCiudad) {
      selCiudad.appendChild(opcion("estudio", (config.estudio && (config.estudio[idioma] || config.estudio.es)) || "Cuba"));
      proximos.forEach(function (v, i) { selCiudad.appendChild(opcion("viaje-" + i, etiquetaViaje(v))); });
      // Sin viajes solo queda el estudio: no hace falta preguntar dónde.
      if (!proximos.length) selCiudad.closest(".campo").hidden = true;
    }

    // Fecha preferida: si la app ya publicó los días libres, el campo abre un
    // calendario (como en la app) con los días ocupados en negro. Si no, queda
    // "Fechas preferidas" con texto libre, como siempre.
    var campoFecha = $("#campo-fecha");
    var btnFecha = $("#f-fecha");
    var inDia = $("#f-dia");
    var selHora = $("#f-hora");
    var campoFechas = $("#campo-fechas");
    var calendario = $("#calendario");
    var rejilla = $("#cal-rejilla");
    var usaCalendario = !!(dias.length && campoFecha && btnFecha && inDia && selHora && campoFechas && calendario && rejilla);

    function mesDe(f) { var d = fechaLocal(f); return new Date(d.getFullYear(), d.getMonth(), 1); }
    var primerMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    var ultimoMes = dias.length ? mesDe(dias[dias.length - 1].fecha) : primerMes;
    var mesVisible = primerMes;

    // Se puede elegir si le quedan horas libres y es en el sitio elegido.
    function elegible(f) {
      var d = porFecha[f];
      var lugar = selCiudad ? selCiudad.value : "";
      return !!d && d.estado !== "lleno" && (!lugar || d.lugar === lugar);
    }

    function llenarHoras() {
      selHora.textContent = "";
      selHora.appendChild(opcion("", T.horaIgual));
      var dia = porFecha[inDia.value];
      $("#campo-hora").hidden = !dia;
      if (!dia) return;
      dia.bloques.forEach(function (b) {
        // Cada media hora, dejando al menos una hora hasta el final del hueco.
        for (var m = b[0]; m + 60 <= b[1]; m += 30) selHora.appendChild(opcion(deMinutos(m), horaBonita(m)));
      });
    }

    function pintarCalendario() {
      $("#cal-mes").textContent = fmtMes ? fmtMes.format(mesVisible) : claveFecha(mesVisible).slice(0, 7);
      rejilla.textContent = "";
      for (var i = 0; i < 7; i++) {
        // El 1 de enero de 2024 fue lunes: la semana empieza en lunes.
        rejilla.appendChild(el("span", { class: "cal-dsem", "aria-hidden": "true" },
          fmtDiaSemana ? fmtDiaSemana.format(new Date(2024, 0, 1 + i)) : ""));
      }
      for (var h = (mesVisible.getDay() + 6) % 7; h > 0; h--) rejilla.appendChild(el("span", { class: "dia" }));
      for (var d = new Date(mesVisible); d.getMonth() === mesVisible.getMonth(); d.setDate(d.getDate() + 1)) {
        var f = claveFecha(d), num = String(d.getDate());
        if (elegible(f)) {
          var elegido = f === inDia.value;
          rejilla.appendChild(el("button", {
            type: "button",
            class: "dia " + porFecha[f].estado + (elegido ? " elegido" : ""),
            "data-fecha": f,
            "aria-pressed": String(elegido),
            "aria-label": conFormato(fmtDiaLargo, f) + ": " + textoEstado(porFecha[f])
          }, num));
        } else if (d < hoy) {
          rejilla.appendChild(el("span", { class: "dia pasado", "aria-hidden": "true" }, num));
        } else {
          // Ocupado, de descanso, en otro sitio o más allá de lo publicado: en negro.
          rejilla.appendChild(el("span", { class: "dia ocupado" },
            [num, el("span", { class: "visualmente-oculto" }, " " + T.estadoLleno)]));
        }
      }
      $("#cal-antes").disabled = mesVisible <= primerMes;
      $("#cal-despues").disabled = mesVisible >= ultimoMes;
      $("#cal-vacio").hidden = dias.some(function (x) { return elegible(x.fecha); });
    }

    // Al abrir: el mes del día elegido o, si no hay, el del primer día libre.
    function mesInicial() {
      if (porFecha[inDia.value]) return mesDe(inDia.value);
      for (var i = 0; i < dias.length; i++) if (elegible(dias[i].fecha)) return mesDe(dias[i].fecha);
      return primerMes;
    }

    function abierto() { return calendario.classList.contains("abierto"); }

    function abrirCalendario(abrir) {
      if (abrir) {
        mesVisible = mesInicial();
        pintarCalendario();
      }
      calendario.classList.toggle("abierto", abrir);
      btnFecha.setAttribute("aria-expanded", String(abrir));
      // Mientras está abierto, el botón flotante de WhatsApp no tapa los días.
      document.documentElement.classList.toggle("calendario-abierto", abrir);
      if (abrir) verCalendarioEntero();
    }

    // En el móvil el calendario puede quedar por debajo del borde de la
    // pantalla: sube lo justo para verlo entero, sin esconder la etiqueta
    // del campo debajo de la cabecera fija.
    function verCalendarioEntero() {
      var cabecera = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cabecera"), 10) || 56;
      var arriba = campoFecha.getBoundingClientRect().top - cabecera - 12;
      var abajo = btnFecha.getBoundingClientRect().bottom + $(".calendario", calendario).offsetHeight + 24 - innerHeight;
      var subir = Math.min(abajo, arriba);
      if (subir > 0) window.scrollBy({ top: subir, behavior: "smooth" });
    }

    function mostrarErrorFecha(si) {
      campoFecha.classList.toggle("con-error", si);
      var aviso = $("#error-fecha");
      if (aviso) aviso.hidden = !si;
    }

    // f: "2026-11-04", "otra" o "" (sin elegir).
    function elegirDia(f) {
      inDia.value = f;
      var texto = f === "otra" ? T.diaOtra : (f ? conFormato(fmtDiaLargo, f) : T.diaElige);
      btnFecha.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);
      btnFecha.classList.toggle("vacio", !f);
      $("#cal-otra").setAttribute("aria-pressed", String(f === "otra"));
      campoFechas.hidden = f !== "otra";
      if (f) mostrarErrorFecha(false);
      llenarHoras();
    }

    // Si cambia el sitio y el día elegido no es de ese sitio, se borra.
    function revisarDia() {
      if (porFecha[inDia.value] && !elegible(inDia.value)) elegirDia("");
      if (abierto()) {
        mesVisible = mesInicial();
        pintarCalendario();
      }
    }

    if (usaCalendario) {
      campoFecha.hidden = false;
      $("#cal-vacio").textContent = T.sinLibres;
      // Días de ejemplo hasta que la app publique los de verdad (ver datos/disponibilidad.js).
      if ($("#cal-ejemplo")) $("#cal-ejemplo").hidden = !disponibilidad.ejemplo;
      elegirDia("");

      btnFecha.addEventListener("click", function () { abrirCalendario(!abierto()); });
      $("#cal-antes").addEventListener("click", function () {
        mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
        pintarCalendario();
      });
      $("#cal-despues").addEventListener("click", function () {
        mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
        pintarCalendario();
      });
      rejilla.addEventListener("click", function (e) {
        var b = e.target.closest("[data-fecha]");
        if (!b) return;
        elegirDia(b.getAttribute("data-fecha"));
        abrirCalendario(false);
        btnFecha.focus();
      });
      $("#cal-otra").addEventListener("click", function () {
        elegirDia("otra");
        abrirCalendario(false);
        $("#f-fechas").focus();
      });

      // Se cierra al tocar fuera o con Escape.
      document.addEventListener("click", function (e) {
        if (abierto() && !campoFecha.contains(e.target)) abrirCalendario(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && abierto()) {
          abrirCalendario(false);
          btnFecha.focus();
        }
      });

      if (selCiudad) selCiudad.addEventListener("change", revisarDia);
      // "Reservar en {ciudad}" de las fechas de viaje también cambia el sitio.
      if (listaViajes) listaViajes.addEventListener("click", function (e) {
        if (e.target.closest("[data-viaje]")) revisarDia();
      });
    }

    // Con calendario hay que elegir un día (u "Otra fecha") antes de enviar.
    function faltaFecha() {
      if (!usaCalendario || inDia.value) return false;
      mostrarErrorFecha(true);
      btnFecha.focus();
      abrirCalendario(true);
      return true;
    }

    // Recuerda con qué botón se envió (WhatsApp o email) en navegadores sin e.submitter.
    var ultimoBoton = "whatsapp";
    $$("button[name='via']", form).forEach(function (b) {
      b.addEventListener("click", function () { ultimoBoton = b.value; });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || ultimoBoton;
      if (faltaFecha()) return;

      if (via === "email") {
        var texto = componer(false);
        location.href = "mailto:" + (config.email || "") +
          "?subject=" + encodeURIComponent(T.msg.asunto + valor("f-nombre")) +
          "&body=" + encodeURIComponent(texto);
        mostrarAviso("email", texto);
      } else {
        var mensaje = componer(true);
        var url = "https://wa.me/" + (config.whatsapp || "") + "?text=" + encodeURIComponent(mensaje);
        var ventana = window.open(url, "_blank");
        if (ventana) { try { ventana.opener = null; } catch (err) {} } else { location.href = url; }
        mostrarAviso("whatsapp", mensaje);
      }
    });

    var btnCopiar = $("#aviso-copiar");
    if (btnCopiar) {
      btnCopiar.textContent = T.copiar;
      btnCopiar.addEventListener("click", function () { copiar($("#aviso-texto").value, btnCopiar); });
    }
  }
})();
