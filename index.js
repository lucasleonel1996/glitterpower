/**
 * GlitterPower - Scripts principales
 */

var WHATSAPP_NUMBER = '59891683527';

document.addEventListener('DOMContentLoaded', function () {
  initSwiper();
  initReserva();
});

/**
 * Carrusel de testimonios (Swiper)
 */
function initSwiper() {
  var el = document.querySelector('.swiper-testimonios');
  if (!el) return;
  new Swiper('.swiper-testimonios', {
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroup: 1,
    loop: true,
    speed: 400,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-testimonios .swiper-button-next',
      prevEl: '.swiper-testimonios .swiper-button-prev'
    },
    pagination: {
      el: '.swiper-testimonios .swiper-pagination',
      clickable: true
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      992: { slidesPerView: 4 }
    }
  });
}

/**
 * Sección Reserva: Flatpickr (fecha y hora) y botón que abre WhatsApp con mensaje
 */
function initReserva() {
  var input = document.getElementById('reservaDateTime');
  var btnAgendar = document.getElementById('btnAgendarReserva');
  var errorEl = document.getElementById('reservaError');

  if (!input || !btnAgendar) return;

  function getMinTime() {
    var ahora = new Date();
    var h = ahora.getHours();
    var min = ahora.getMinutes();
    min = Math.ceil(min / 15) * 15;
    if (min === 60) {
      min = 0;
      h += 1;
    }
    if (h >= 24) h = 23;
    return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
  }

  var fp = flatpickr(input, {
    enableTime: true,
    time_24hr: true,
    minDate: 'today',
    dateFormat: 'd/m/Y H:i',
    locale: 'es',
    minuteIncrement: 15,
    allowInput: false,
    static: false,
    appendTo: document.body,
    onChange: function (selectedDates) {
      if (!selectedDates[0]) return;
      var d = selectedDates[0];
      var today = new Date();
      var esHoy = d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
      fp.set('minTime', esHoy ? getMinTime() : '00:00');
    },
    onOpen: function () {
      var s = fp.selectedDates[0];
      var today = new Date();
      if (s) {
        var esHoy = s.getDate() === today.getDate() &&
          s.getMonth() === today.getMonth() &&
          s.getFullYear() === today.getFullYear();
        fp.set('minTime', esHoy ? getMinTime() : '00:00');
      } else {
        fp.set('minTime', getMinTime());
      }
    }
  });

  function ocultarError() {
    if (errorEl) {
      errorEl.classList.add('d-none');
      errorEl.textContent = '';
    }
  }

  function mostrarError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.remove('d-none');
    }
  }

  btnAgendar.addEventListener('click', function () {
    ocultarError();
    var selected = fp.selectedDates[0];
    var tipoFiesta = (document.getElementById('reservaTipoFiesta') || {}).value || '';
    var cantidadEl = document.getElementById('reservaCantidadPersonas');
    var cantidad = cantidadEl ? cantidadEl.value.trim() : '';

    if (!selected) {
      mostrarError('Por favor elegí una fecha y hora.');
      return;
    }
    if (selected <= new Date()) {
      mostrarError('La fecha y hora deben ser posteriores a ahora.');
      return;
    }
    if (!tipoFiesta.trim()) {
      mostrarError('Por favor elegí el tipo de evento.');
      return;
    }
    var numPersonas = parseInt(cantidad, 10);
    if (!cantidad || isNaN(numPersonas) || numPersonas < 1) {
      mostrarError('Por favor indicá la cantidad de personas (mínimo 1).');
      return;
    }

    var dd = String(selected.getDate()).padStart(2, '0');
    var mm = String(selected.getMonth() + 1).padStart(2, '0');
    var yyyy = selected.getFullYear();
    var hh = String(selected.getHours()).padStart(2, '0');
    var min = String(selected.getMinutes()).padStart(2, '0');
    var fechaLega = dd + '/' + mm + '/' + yyyy;
    var hora = hh + ':' + min;
    var mensaje = '¡Hola! He visto tu sitio web y me gustaría agendar una reserva en GlitterPower.\n\n' +
      '• Fecha: ' + fechaLega + '\n' +
      '• Hora en que necesito el servicio (maquillaje): ' + hora + '\n' +
      '• Tipo de evento: ' + tipoFiesta.trim() + '\n' +
      '• Cantidad de personas: ' + numPersonas + '\n\n¡Gracias!';
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank', 'noopener');
  });
}
