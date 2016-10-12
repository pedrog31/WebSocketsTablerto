/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global grosor, color */

var wsUri = "ws://" + document.location.host + document.location.pathname + "echo";
var websocket = new WebSocket(wsUri);
var username;
var lienzo;
var dibuja = false;

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
    username = textField.value;
    websocket.send(username + " enlazado");
}

function OnOpen(evt) {
    writeToScreen("Conectado a " + wsUri);
}

function OnMessage(evt) {
    if (evt.data.indexOf("enlazado") != -1) {
        userField.innerHTML += evt.data.substring(0, evt.data.indexOf("enlazado")) + "\n";
    } else {
        if (evt.data === "pulsa") {
            ctx.beginPath();
            dibuja = true;
        } else {
            if (evt.data === "levanta") {
                dibuja = false;
            } else {
                if (evt.data === "limpia") {
                    lienzo.width = lienzo.width;
                } else {
                    var mensaje = JSON.parse(evt.data);
                    ctx.strokeStyle = mensaje.color;
                    ctx.lineWidth = mensaje.grosor;
                    ctx.lineTo(mensaje.posx, mensaje.posy);
                    ctx.stroke();
                }
            }
        }
    }
}

function OnError(evt) {
    writeToScreen('<span style="color:red">ERROR:</span>' + evt.data);
}

function comenzar() {
    lienzo = document.getElementById('tablero');
    ctx = lienzo.getContext('2d');
    document.addEventListener('mousedown', pulsaRaton, false);
    document.addEventListener('mousemove', mueveRaton, false);
    document.addEventListener('mouseup', levantaRaton, false);
}

function pulsaRaton(evt) {
    websocket.send("pulsa");
}

function mueveRaton(evt) {
    if (dibuja) {
        var posicion = lienzo.getBoundingClientRect();
        var mensaje = {
            posx: evt.clientX - posicion.left,
            posy: evt.clientY - posicion.top,
            color: color.value,
            grosor: grosor.value
        };
        websocket.send(JSON.stringify(mensaje));
    }
}

function levantaRaton(evt) {
    websocket.send("levanta");
}

function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}

function limpiar() {
    websocket.send("limpia");
}

function guardaPNG() {
    var dataImg = lienzo.toDataURL();
    dataImg = dataImg.replace("image/png", 'image/octet-stream');
    document.location.href = dataImg;
}