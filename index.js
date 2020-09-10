
function* getCounter () {
    let counter1 = 0;
    while (true) {
        yield counter1++;    
    }
}

const commandCounter = getCounter();

let buffer = new ArrayBuffer(16);
message = new Uint8Array(buffer);


message.fill(222257,3);
message[30] = 5;
let code = message[0];
let d = message[20];

console.log({code, d, message});


/*

class Message {
    constructor () {
        this.code;
        this.ident;
        this.length;
        this.data;
    }
}

class FixedDataItem {
    constructor () {
        this.code;
        this.value;
    }
}

class FluidDataItem {
    constructor () {
        this.code;
        this.length;
        this.value;
    }
}

class CommandData {
    constructor () {
        this.code;
        this.ident;
        this.length;
        this.data;
    }

    encode() {
        this.length = this.data.length;
        let buffer = new ArrayBuffer(16);
        message = new Uint8Array(buffer);
        message[0] = this.code;
        message[1] = this.ident;
        message[2] = this.length;
        message[3] = this.data;
    }
}

*/



