
const r = require('restructure');
const getStream = require('get-stream');

var Person = new r.Struct({
  name: new r.String(r.uint8, 'utf8'),
  age: r.uint8,
  sex: new r.String(r.uint8, 'utf8'),
});

(async () => {
  try {
    var stream = new r.EncodeStream();

    Person.encode(stream, {
      name: 'Devon',
      age: 21,
      sex: 'male'
    });

    stream.end();

    const b = Buffer.from(await getStream(stream, {encoding: 'binary'}));
    console.log('buf1', b);

    const buffer = Buffer.from(b);
    console.log('buf2', buffer);

    var stream2 = new r.DecodeStream(buffer);
    const n = Person.decode(stream2);

    console.log(n);
  } catch (e) {
    console.log(e);
  }  
})();


/*

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

  decode()
   {}
}


const command = IdentityCommand.encode('1', '121212')
console.log('command', command);


*/