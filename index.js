
const C = require('construct-js');

class Message {
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

class Command extends Message {
  static encode(code, ident, length, data) {
    const c = C.Struct('IdentityCommand')
      .field('code', C.U8(code))
      .field('ident', C.U16LE(ident))
      .field('length', C.U16LE(length))
      .field('data', C.RawString(data))
    return c.toBuffer();
  }

  static decode(data) {
  }
}

class IdentityCommand extends Command {
  static CODE = 1;
  static encode(ident, data) {    
    return super.encode(this.CODE, ident, data.length, data);
  }

  decode() {}
}


const command = IdentityCommand.encode('1', '121212')
console.log('command', command);
