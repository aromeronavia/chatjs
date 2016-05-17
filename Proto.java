import java.io.*;
import java.net.*;

public class Proto {

    public static String IP_ADDRESS = "127.0.0.1";

    public static void main(String[] args)
    throws UnknownHostException, SocketException {
        final DatagramSocket clientSocket = new DatagramSocket();
        final InetAddress inetAddress = InetAddress.getByName(IP_ADDRESS);
        byte[] sendData = new byte[1024];
        sendData = "<adduser id=\"1\">alberto</adduser>".getBytes();
        DatagramPacket sendPackage = new DatagramPacket(sendData, sendData.length, inetAddress, 3001);

        try {
            clientSocket.send(sendPackage);
        } catch (IOException e) {
            e.printStackTrace();
        }

        byte[] receiveData = new byte[1024];
        DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length, inetAddress, 3001);

        try {
          clientSocket.receive(receivePacket);
        } catch (IOException e) {
          e.printStackTrace();
        }

        String xmlResponse = new String(receivePacket.getData());
        System.out.println(xmlResponse);

        sendData = "<users id=\"1\"></users>".getBytes();
        sendPackage = new DatagramPacket(sendData, sendData.length, inetAddress, 3001);

        try {
            clientSocket.send(sendPackage);
        } catch (IOException e) {
            e.printStackTrace();
        }

        receiveData = new byte[1024];
        receivePacket = new DatagramPacket(receiveData, receiveData.length, inetAddress, 3001);

        try {
          clientSocket.receive(receivePacket);
        } catch (IOException e) {
          e.printStackTrace();
        }

        xmlResponse = new String(receivePacket.getData());
        System.out.println(xmlResponse);
    }
}

