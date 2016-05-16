var contId = {};
var acks = {};
var conUser = {};
var blockedUsers = {};

function sendMessage(){    
    
    var message = document.getElementById("messageText").value;
    var name = getRadioVal(document.getElementById("form1"), "selection");
    if(name == undefined){
        alert('favor de seleccionar un destinatario');
        return;    
    }
    //Parte visual
    document.getElementById("messageText").value = null;
    var lblMessage = document.createElement('label');
    lblMessage.style.cssText = 'float:right;';

    lblMessage.innerHTML = 'Para '+ name + ' : ' + message;
    document.getElementById("allMessages").appendChild(lblMessage);
    var br = document.createElement('br');
    document.getElementById("allMessages").appendChild(br);
    
    //Parte lógica
    //name message
    
    //IdMensaje
    contId['cont'] = contId['cont']+1;
    var builtMessage = buildMessage(conUser['user'], name, message, contId['cont'])
    
    alert(builtMessage); 
    

}

function recieveMessage(){
    var sender = '';
    if(blockedUsers[sender] == 'bloqueado')
        return;
    
    //writeMessage()
    
}

function buildMessage(sender, receiver, message, id){
    if(sender == undefined || receiver == undefined || message == undefined || id == undefined)
        return;
        /*<message id="">
            <sender></sender>
            <receiver></receiver>
            <message></message>
            <hour></hour>
</message>*/
    return '<message id ="' +id +'"><sender>' + 
            sender + '</sender><receiver>' + receiver + '</receiver><message>'  + message + '</message><hour></hour></message>';
}



function connect(){
    contId['cont'] = 0;
    var user = prompt("Por favor ingresa tu nombre", "");
    
     
    
    //Todo el pedo de conexión...
    
    if(user != null){
    alert("Conexión exitosa!");
    conUser['user'] = user;
    document.getElementById("connectedUser").innerHTML = "Chat Conectado, Usuario: " + user;
    }
    
    
}

function refreshHour(){
    var hour = document.getElementById('hour');
    hour.innerHTML = 'Hora: ' + Math.random();
    
}



function getWeather(){
    var weather = document.getElementById('weather');
    weather.innerHTML = 'Clima: Carlosito';
}

function refreshUsersList(){
    //Removes current 'connected' users
    var form = document.getElementById("form1");
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }
    
    var div = document.createElement('div');
    var label = document.createElement('label');
    var labeltext = document.createElement('label');
    labeltext.innerHTML = 'Todos';
    label.appendChild(labeltext);
    var input = document.createElement('input');
    
    input.setAttribute("type", "radio");
    input.setAttribute("name", "selection");
    input.setAttribute("value", "todos");
    
    var br = document.createElement('br');
    label.appendChild(input);
    div.appendChild(label);
    div.appendChild(br);
    div.appendChild(br);
    form.appendChild(div);
    
    //adds new ones recieved from server
    addConnectedUser('elbeto');
    addConnectedUser('elmemo');
}


function blockUser(button){
    var value = button.value;
    if(value.indexOf("desbloquear") >= 0){
        blockedUsers[button.id.split('.')[0]] = 'desbloqueado';
        button.value = "bloquear";
    }else{
        blockedUsers[button.id.split('.')[0]] = 'bloqueado';
        button.value = "desbloquear";
    }
}

function writeMessage(message){
    //Escribe únicamente en el DOM
    var label = document.createElement('label');
    label.style.cssText = 'float:left;';
    label.innerHTML = message;
    var br = document.createElement('br');
    document.getElementById('allMessages').appendChild(label);
    document.getElementById('allMessages').appendChild(br);
}

function addConnectedUser(user){
    var div = document.createElement('div');
    div.id = 'div' + user;
    
    
    var button = document.createElement('input');
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "blockUser(this)");
    button.setAttribute("value", "bloquear");
    button.style.cssText = "width:100px;"
    button.id = user + '.';
    div.appendChild(button);
    

        
    
    
    var radio = document.createElement('input');
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "selection");
    radio.setAttribute("value", user);
    div.appendChild(radio);
    
    var label = document.createElement('label');
    label.innerHTML = user;
    label.style.cssText = "margin-left:5px;width:150px;margin-right:20px;"
    div.appendChild(label);
    

    
    
    var br = document.createElement('br');
    div.appendChild(br);
    div.appendChild(br);
    

    blockedUsers[user] = 'desbloqueado';
    
    
    
    var connectedUsers = document.getElementById('form1');
    connectedUsers.appendChild(div);
    

    
}

function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}




refreshUsersList();
setInterval(refreshHour, 1000);
setInterval(refreshUsersList, 20000);
connect();
getWeather();
writeMessage('Fulano1: Mensaje1');
writeMessage('Fulano1: Mensaje1');
writeMessage('Fulano1: Mensaje1');
writeMessage('Fulano1: Mensaje1');
writeMessage('Fulano1: Mensaje1');

//var connection = new WebSocket('ws://html5rocks.websocket.org/echo', ['soap', 'xmpp']);

/*
<message id="">
            <sender></sender>
            <receiver></receiver>
            <message></message>
            <hour></hour>
</message>

<ack id=""/>

<users id="">
	<user></user>
</users>
*/