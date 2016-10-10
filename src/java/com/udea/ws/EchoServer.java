/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.udea.ws;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Pedro Gallego
 */
@ServerEndpoint("/echo")
public class EchoServer {
//Crear sesiones
    
    public static final Set<Session> peers =
            Collections.synchronizedSet(new HashSet<Session>());
    
    
    
    @OnMessage
    public void onMessage(String message, Session client) throws IOException, EncodeException {
        for (Session peer:peers) {
            peer.getBasicRemote().sendObject(message);
        }
    }

    @OnOpen
    public void onOpen(Session peer) {
        peers.add(peer); //Adicionamos un nuevo peer a la lista
    }

    @OnClose
    public void onClose(Session peer) {
        peers.remove(peer);
    }
    
}
