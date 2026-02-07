
var images = ['../imagenes/pulseras_varias.jpg', '../imagenes/diablo-PRINCIPAL3.jpg', '../imagenes/pulseras_varias3.jpg', 
'../imagenes/imagen-logo.jpg', '../imagenes/didablos-varios.jpg', '../imagenes/imagen-logo2.jpg', '../imagenes/mascara-Jesus.jpg'];
var index = 0;

function changeBackground() {
    document.querySelector('#home').style.backgroundImage = 'url(' + images[index] + ')';
    index = (index + 1) % images.length;
}

setInterval(changeBackground, 5000); // cambia la imagen cada 5 segundos