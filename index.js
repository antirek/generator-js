
const r = require('restructure');
const getStream = require('get-stream');

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

  static CommandStructure = new r.Struct({
    code: r.uint8,
    ident: r.uint16,
    length: r.uint16,
    data: new r.Array(r.uint8, 'length'),
  });
  
  static async encode(code, ident, length, data) {
    var stream = new r.EncodeStream();

    this.CommandStructure.encode(stream, {
      code,
      ident,
      length,
      data,
    });
    stream.end();

    return Buffer.from(await getStream(stream, {encoding: 'binary'}));
  }

  static decode(data) {
  }
}

class IdentityCommand extends Command {
  static CODE = 1;
  static COMMAND_NAME = 'identity command';
  static async encode(ident, data) {
    return await super.encode(this.CODE, ident, data.length, data);
  }

  decode() {}
}


(async () => {
  const command = await IdentityCommand.encode('1', '121212');
  console.log('command', command);
})();
