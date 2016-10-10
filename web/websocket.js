/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "echo";
var websocket = new WebSocket(wsUri);
var username;
var estoydibujando = false;
websocket.onopen = function (evt) {
    OnOpen(evt)
};
websocket.onmessage = function (evt) {
    OnMessage(evt)
};
websocket.onerror = function (evt) {
    OnError(evt)
};
websocket.oneClose = function (evt) {
    OnClose(evt)
};

var output = document.getElementById("output");

function join() {
    estoydibujando = true;
    username = textField.value;
    websocket.send(username + " enlazado");
}

function send_message() {
    websocket.send(username + ": " + textField.value);
}

function OnOpen(evt) {
    estoydibujando = false;
    writeToScreen("Conectado a " + wsUri);
}

function OnMessage(evt) {
    //console.log("OnMessage");
    writeToScreen("Recibido: " + evt.data);
    userField.innerHTML += evt.data.substring(0, evt.data.indexOf("enlazado")) + "\n";
}

function OnError(evt) {
    writeToScreen('<span style="color:red">ERROR:</span>' + evt.data);
}

function comenzar() {
    lienzo = document.getElementById('tablero');
    ctx = lienzo.getContext('2d');
    //Dejamos todo preparado para escuchar los eventos
    document.addEventListener('mousedown', pulsaRaton, false);
    document.addEventListener('mousemove', mueveRaton, false);
    document.addEventListener('mouseup', levantaRaton, false);
}

function pulsaRaton(evt) {
    estoyDibujando = true;
    //Indico que vamos a dibujar
    ctx.beginPath();
    //Averiguo las coordenadas X e Y por dónde va pasando el ratón
    //ctx.moveTo(evt.clientX, evt.clientY);
}

function mueveRaton(evt) {
    if (estoyDibujando) {
        //indicamos el color de la línea
        ctx.strokeStyle = color.value;
        ctx.lineWidth = grosor.value;
        //Por dónde vamos dibujando
        ctx.lineTo(evt.clientX-170, evt.clientY-120);
        ctx.stroke();
    }
}

function levantaRaton(evt) {
    //Indico que termino el dibujo
    ctx.closePath();
    estoyDibujando = false;
}

function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}