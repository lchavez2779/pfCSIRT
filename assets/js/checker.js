
function validateInput() {
    var url = document.getElementById("url");
    if(url.value.length > 1500) {
        url.value = url.value.substr(0, 1500);
    }
}

function getSites() {
    if (typeof sitios == "object"){
        if (typeof sitios[0] == 'undefined') {
            return false; 
        } else if (typeof sitios[0].prov_sitio_web == 'undefined' && typeof sitios[0].prov_nombre_fantasia == 'undefined') {
            return false;
        }
        else {
            return sitios; 
        }
    } else {
        return false;
    }
}

function getURL() {
    let site = document.getElementById('url').value.toLowerCase().trim();
	return site;
}

function validateLen(urlLen) {
    if (urlLen < 4) {
        return true;
    }
    if (urlLen > 1500) {
        return true;
    }
    return false;
}

function removeHTTP(url) {
    if (url.search("https://") != -1) {
        return url.replace('https://', '');
    } else if (url.search("http://") != -1) {
        return url.replace('http://', '');
    } else if(url.search("ftp:\\\\") != -1) {
        return url.replace('ftp:\\\\', '');
    }
    else {
        return url;
    }
}

function extractDomain(domain) {
    var result = "";
    var n;
    if (domain.match(/^[a-zA-Z0-9]/) == null) {
        return false;
    }
    if (domain.indexOf("/", 5) > -1) {
        result = domain.substring(domain.indexOf("/", 5), -1);
    } else {
        result = domain;
    }
    if(result.charAt(result.length-1).match(/^\w||\d/) == null) {
        return false;
    }
    if(result.match("^[A-Za-z0-9.-]+$") == null){
        return false;
    } 
    if (result.includes(".")) {
        result = result.split(".");
        for (var i = 0; i < result.length; i++){
            if(result[i].match("^[A-Za-z0-9-]+$") == null){
                return false; 
            }
        }
        n = result.indexOf("www");
        if (n != -1){
            result = result.slice(n+1)
        }
        result = result.join('.');
        return result;
    } else {
        return false;
    }  
}

function assignAnswer(data) {
    var cfg = {
        type: data[2],
        title: data[0],
        text: data[1],
        confirmButtonText: data[3],
        showCancelButton: false,
        footer: '<small href>InformaciÃ³n entregada por SERNAC</small>'
    };
    Swal.fire(cfg);
}



function validateDomain() {
    var url = getURL();
    if (validateLen(url.length)) {
        return {code: 3, entity: ""};
    }
    var domain = removeHTTP(url);
    var extractedDomain = extractDomain(domain);
    if (extractedDomain == false) {
        extractedDomain = {code: 3, entity: ""};
    } else {
        extractedDomain = {code: 0, entity: extractedDomain};
    }
    return extractedDomain;
}

function compareDomain(domain) {

    if (domain.code != 0) {
        return domain;
    }
    var listado = [];
    var domainList = getSites();
    if (domainList == false ) {
        return {code: 2, entity: ""};
    }
    domain = domain[Object.keys(domain)[1]];
    var answer = {code: 1, entity: ""};
    var domainData = "";
    var domainMap = domainList.map(function (data) {
        domainData = data.prov_sitio_web.toLowerCase();
        if (validateLen(domainData.length)) {
            domainData = "";
        }
        domainData = removeHTTP(domainData);
        domainData = extractDomain(domainData);
        if (domainData == false) {
            domainData = "";
        }
        listado.push(domainData);
        if (domain == domainData) {
            answer = {code: 0, entity: [data.prov_nombre_fantasia, domainData]};
        }
    });

    return answer;
}

function obtainAnswer(answer) {	
    switch (answer.code) {
        case 0: {
            assignAnswer(["Sitio web registrado.", "El sitio web " + answer.entity[1] + " fue encontrado en los registros de SERNAC y pertenece a " + answer.entity[0] + ".", "success", "Cerrar"]);
            break;
        }
        case 1: {
            assignAnswer(["Sitio web no registrado.", "El sitio web no fue encontrado en los registros de SERNAC.", "error", "Cerrar"]);
            break;
        }
        case 2: {
            assignAnswer(["Servicio no disponible", "El servicio se encuentra temporalmente fuera de servicio, intÃ©ntelo mÃ¡s tarde.", "question", "Cerrar"]);
            break;
        }
        default: {
            assignAnswer(["Error", "Formato de url no vÃ¡lido.", "warning", "Cerrar"]);
            break;
        }
    }
}


function main() {
    var domain = validateDomain();
    var answer = compareDomain(domain);
    obtainAnswer(answer);
}
