var custom = {
    origin: window.location.origin + '/',
    href: window.location.href,
    reportar: 'https://apps-publicas.interior.gob.cl/csirt-ws/rest/registro',
    max: function () {
        var max = custom.origin == custom.href ? 5 : 6;
        return max;
    },
    init: function () {
        custom.options;
        custom.buttons();
        custom.set_placeholder();
    },
    buttons: function () {
        $('button#btnSend').on('click', custom.fnSend);
        $('button#btnClear').on('click', custom.fnClear);
    },
    opciones: function (target, num) {
        var opt = {
            ssl: true,
            limit: num,
            key: null,
            layoutTemplate: '{entries}',
            entryTemplate: '<a href="{url}" class="list-group-item list-group-item-action flex-column align-items-start" target="_blank">' +
                    '<div class="row"> ' +
                    '    <div class="col-md-1">' +
                    '        <i class="fa fa-2x fa-bug mt-3" aria-hidden="true"></i>' +
                    '    </div>' +
                    '    <div class="col-md-11">' +
                    '        <div class="d-flex w-100 justify-content-between">' +
                    '            <small class="text-muted">{date}</small><small class="text-muted">{author}</small>' +
                    '        </div>' +
                    '        <p class="mb-1 small">{shortBodyPlain}</p>' +
                    '    </div>' +
                    '</div>' +
                    '</a>',
            outputMode: 'html',
            dateFormat: 'DD/MM/YYYY',
            dateLocale: 'es',
            effect: 'show',
            offsetStart: false,
            offsetEnd: false,
            success: function () {
                custom.success(target);
            },
            error: function () {}
        }

        return opt;
    },
    fnSend: function () {

        var nombreCompleto = $('input#nombreCompleto').val();
        var numeroTelefonico = $('input#numeroTelefonico').val();
        var correoElectronico = $('input#correoElectronico').val();
        var cCorreoElectronico = $('input#cCorreoElectronico').val();
        var asunto = $('input#asunto').val();
        var institucion = $('input#institucion').val();
        var entidad = $('input#entidad').val();
        var activo = $('input#activo').val();
        var descripcion = $('textarea#descripcion').val();

        if (nombreCompleto.length == 0) {
            $('input#nombreCompleto').focus();
            toastr.error('*Nombre completo es obligatorio');
            return;
        }

        if (numeroTelefonico.length == 0) {
            $('input#numeroTelefonico').focus();
            toastr.error('NÃºmero telefÃ³nico de contacto es obligatorio');
            return;
        }

        if (correoElectronico.length == 0) {
            $('input#correoElectronico').focus();
            toastr.error('Correo ElectrÃ³nico es obligatorio');
            return;
        }

        if (!custom.valida_correo(correoElectronico)) {
            $('input#correoElectronico').focus();
            toastr.error('Correo ElectrÃ³nico no es vÃ¡lido');
            return;
        }

        if (cCorreoElectronico.length == 0) {
            $('input#cCorreoElectronico').focus();
            toastr.error('Confirmar Correo ElectrÃ³nico es obligatorio');
            return;
        }

        if (!custom.valida_correo(cCorreoElectronico)) {
            $('input#cCorreoElectronico').focus();
            toastr.error('Confirmar Correo ElectrÃ³nico no es vÃ¡lido');
            return;
        }

        if (correoElectronico != cCorreoElectronico) {
            $('input#correoElectronico').focus();
            toastr.error('Los Correos ingresados son distintos');
            return;
        }

        if (asunto.length == 0) {
            $('input#asunto').focus();
            toastr.error('Asunto es obligatorio');
            return;
        }

        if (institucion.length == 0) {
            $('input#institucion').focus();
            toastr.error('Entidad que reporta es obligatorio');
            return;
        }

        if (entidad.length == 0) {
            $('input#entidad').focus();
            toastr.error('Entidad afectada por el incidente es obligatorio');
            return;
        }

        if (activo.length == 0) {
            $('input#activo').focus();
            toastr.error('Activo involudrado obligatorio');
            return;
        }

        if (descripcion.length == 0) {
            $('textarea#descripcion').focus();
            toastr.error('InstituciÃ³n afectada por el incidente es obligatorio');
            return;
        }
        var captcha = grecaptcha.getResponse();

        if (captcha.length == 0) {
            toastr.error('debe activar recaptcha');
            return;
        }

        var datos = JSON.stringify({
            "nombreCompleto": nombreCompleto,
            "numeroTelefonico": numeroTelefonico,
            "correoElectronico": correoElectronico,
            "cCorreoElectronico": cCorreoElectronico,
            "asunto": asunto,
            "institucion": institucion,
            "entidad": entidad,
            "activo": activo,
            "descripcion": descripcion,
            "getRecapchaResponse": captcha
        });

        $.ajax({
            url: custom.reportar,
            type: 'POST',
            data: {json: datos},
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            beforeSend: function () {
                toastr.warning('Validando informaciÃ³n');
            },
            success: function (data) {

                var response = JSON.parse(JSON.stringify(data));

                if (response.codigo != 0) {
                    toastr.error(response.msg);
                } else {
                    custom.fnClear();
                    swal('Reporte enviado', response.msg, 'success');
                }
            },
            error: function (xhr) {
                toastr.error(xhr.responseText);
            }
        });
    },
    fnClear: function () {
        $('input#nombreCompleto').val('');
        $('input#numeroTelefonico').val('');
        $('input#correoElectronico').val('');
        $('input#cCorreoElectronico').val('');
        $('input#asunto').val('');
        $('input#institucion').val('');
        $('input#entidad').val('');
        $('input#activo').val('');
        $('textarea#descripcion').val('');
        grecaptcha.reset();
    },
    success: function (t) {
        $('div#' + t + ' .alert').remove();
    },
    error: function (t) {},
    valida_correo: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());

    },
    soloNumeros: function (e) {
        var keynum = window.event ? window.event.keyCode : e.which;
        if (keynum >= 48 && keynum <= 57 || keynum >= 96 && keynum <= 105 || keynum == 8) {
            return true;
        }
        return /\d/.test(String.fromCharCode(keynum));
    },
    set_placeholder: function () {
        $('label').each(function () {
            var place = $(this).attr('for');
            $('#' + place + '').attr('placeholder', $(this).text());
            $(this).addClass('hidden');
        });
    },
    dumy: function () {
        $('input#nombreCompleto').val('Fernando Garrido');
        $('input#numeroTelefonico').val('1234567890');
        $('input#correoElectronico').val('fgarrido@interior.gob.cl');
        $('input#cCorreoElectronico').val('fgarrido@interior.gob.cl');
        $('input#asunto').val('Demo asunto');
        $('input#institucion').val('Demo instituciÃ³n');
        $('input#entidad').val('Demo entidada');
        $('input#activo').val('Demo activo');
        $('textarea#descripcion').val('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus maximus ante in augue fringilla pulvinar. Nulla at dolor quam. Donec posuere efficitur odio vitae vehicula. Vestibulum in erat ut purus pretium convallis volutpat ut nulla. In hac habitasse platea dictumst. Proin sed ex pretium, fermentum ipsum ac, efficitur metus. Sed pellentesque dui sit amet ex eleifend bibendum id non nibh. Morbi vitae nibh ac tellus lacinia sodales eu sed sapien. Integer eu justo ex. Aliquam quis felis egestas quam blandit luctus nec vel neque. Donec ut lectus dolor.');
    }

}

$(document).ready(function(){
    custom.init();

    $('.owl-carousel').owlCarousel({
        'items': 6,
        'loop': true,
        'autoplay': true,
        'margin': 5
    });
    
    $('.owl-carousel-list').owlCarousel({
        'items': 1,
        'loop': true,
        'autoplay': true,
        'margin': 5
    });
    

    $('#myModal').on('hidden.bs.modal', function (e) {
        $("#modalVideoEmbed").removeAttr("src");
    });
    $('#myModal').on('show.bs.modal ', function (e) {
        $("#modalVideoEmbed").attr("src","https://www.youtube.com/embed/56FrzoN1BV8?rel=0");
    });
});

$(window).scroll(function (event) {
    if ($(window).scrollTop() > 0) {
        $("#topHeaderMenu").addClass("fixed-top");
    }else{
       if($("#topHeaderMenu").hasClass("fixed-top")){
        $("#topHeaderMenu").removeClass("fixed-top");       } 
    }
});
    
    
    
    