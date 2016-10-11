/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "echo";
var websocket = new WebSocket(wsUri);
var username;
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
        if (evt.data.indexOf("pulsa") != -1) {
            ctx.beginPath();
        } else {
            if (evt.data.indexOf("levanta") != -1) {
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
    var mensaje = {
        posx: evt.clientX - 170,
        posy: evt.clientY - 120,
        color: color.value,
        grosor: grosor.value,
    }
    websocket.send(JSON.stringify(mensaje));
}

function levantaRaton(evt) {
    websocket.send("levanta");
}

function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}