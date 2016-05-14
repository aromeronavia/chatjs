            
            
        var socket = io('http://localhost');
        socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
        });
            
            function hola(){
                document.getElementById("Current").innerHTML = "New text!";
            }