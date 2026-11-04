/* =====================================================================
   DÍAS LIBRES
   ---------------------------------------------------------------------
   NO HACE FALTA TOCAR ESTE ARCHIVO: lo escribe la app Er Ink Agenda
   (Más > Días libres en la web) con los huecos de la agenda, y lo vuelve
   a escribir sola cada vez que cambia una cita. Solo dice qué días y
   horas están libres: ningún nombre ni dato de clientes.

   Hasta que la app publique por primera vez, aquí hay días DE EJEMPLO
   para ver cómo queda el calendario (la web avisa de que son de
   ejemplo). La primera publicación de la app borra todo esto y deja
   algo así:

   var DISPONIBILIDAD = {
     actualizado: "2026-11-03T09:40",
     horario: ["10:00", "19:00"],
     dias: {
       "2026-11-04": [["10:00", "19:00"]],   // libre todo el día
       "2026-11-05": [["15:00", "19:00"]],   // libre por la tarde
       "2026-11-06": []                      // ocupado o descanso
     }
   };

   Si este archivo vale null, la web pide "Fechas preferidas" con texto
   libre, sin calendario.
   ===================================================================== */

var DISPONIBILIDAD = (function () {
  function dosCifras(n) { return (n < 10 ? "0" : "") + n; }
  // El horario de ER·INK: tardes de 1:30 a 6:00; miércoles y domingo también
  // de 10:00 a 12:00 (1 = lunes ... 7 = domingo).
  var tarde = ["13:30", "18:00"], manana = ["10:00", "12:00"];
  var horario = { "1": [tarde], "2": [tarde], "3": [manana, tarde], "4": [tarde], "5": [tarde], "6": [tarde], "7": [manana, tarde] };
  var dias = {};
  for (var i = 0; i < 60; i++) {
    var d = new Date();
    d.setDate(d.getDate() + i);
    var clave = d.getFullYear() + "-" + dosCifras(d.getMonth() + 1) + "-" + dosCifras(d.getDate());
    var turnos = horario[String(d.getDay() || 7)];
    if (i % 4 === 1) dias[clave] = [];                     // ocupado
    else if (i % 4 === 3) dias[clave] = [["15:30", "18:00"]]; // algunas horas
    else dias[clave] = turnos;                             // libre todo el día
  }
  return { ejemplo: true, horario: horario, dias: dias };
})();
