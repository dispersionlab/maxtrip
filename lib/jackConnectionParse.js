//inlets and outlets
outlets = 2;

var ports = [];
var IO = [];

//Connections file read
function readFileConnect(s){
	var file = new File(s);
	var a;

	if (file.isopen){
		while ((a = file.readline()) != null) {
            ports.push(a); //push line to connection array
		}
		file.close();
	} else {
		post("could not open file: " + s + "\n");
	}
}

//IO properties file read
function readFileIO(s){
	var fileIO = new File(s);
	var b;

	if (fileIO.isopen){
		while ((b = fileIO.readline()) != null) {
            IO.push(b); //push line to IO array
		}
		fileIO.close();
	} else {
		post("could not open file: " + s + "\n");
	}
}

function parseConnectionsRecursive(i, port, lastInput){
    //check if first char is a space - this is a connection to the last non-tab started element
    if(port.charAt(0) == " "){
        //first char is a space - this is a connected port
        //output message of this port after connection port - eg. system:capture_1 system:capture_16;
        outlet(0, lastInput + port);
        i++;
        if(i < ports.length){
            parseConnectionsRecursive(i, ports[i], lastInput);
        }
    } else{
        //does not start with space - this is an input
        i++;
        //iterate # to check, send next port to check, set last input to this port
        if(i < ports.length){
            parseConnectionsRecursive(i, ports[i], port);
        }
    }
}

function parseIO(){
    //pair off port and status
    for(var i = 0; i < IO.length-1; i+=2){
        outlet(0, IO[i] +" "+IO[i+1]);
    }
    outlet(1, "done");
}

//CALLED FROM MAX
function connections(){
    readFileConnect("livejack.txt");
    if(ports.length > 0){
        parseConnectionsRecursive(0, ports[0], ports[0]);
    } else{
        outlet(0, " " + " ");
    }
}

function io(){
    readFileIO("liveIO.txt");
    if(IO.length > 0){
        parseIO();
    }
}