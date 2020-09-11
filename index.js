
const r = require('restructure');
const getStream = require('get-stream');
const util = require('util');

class Message {}

class Command extends Message {
  static COMMAND_IDENTITY = 1;
  static COMMAND_CHECK = 2;

  static async encode(code, ident, length, data) {
    const stream = new r.EncodeStream();

    this.structure.encode(stream, {
      code,
      ident,
      length,
      data,
    });
    stream.end();
    return Buffer.from(await getStream(stream, {encoding: 'utf-8'}));
  }

  static decode(buffer) {
    const uint8array = new Uint8Array(buffer);
    //console.log('decode length', uint8array.length);
    const command_code = uint8array[0];
    switch (command_code) {
      case Command.COMMAND_CHECK:
        return CheckCommand.decodeBuffer(buffer);
        //break;
      case Command.COMMAND_IDENTITY:
        return IdentityCommand.decodeBuffer(buffer);
        //break;
      default:
        break;
    }
  }

  static decodeBuffer(buffer) {
    var stream = new r.DecodeStream(buffer);
    return this.structure.decode(stream)
  }
}

class IdentityCommand extends Command {
  static CODE = Command.COMMAND_IDENTITY;
  static COMMAND_NAME = 'identity command';

  static structure = new r.Struct({
    code: r.uint8,
    ident: r.uint16,
    length: r.uint16,
    data: new r.Array(r.uint8, 'length'),
  });

  static async encode(ident, data) {
    return await super.encode(this.CODE, ident, data.length, data);
  }

  static decode() {
    return 1;
  }
}

class CheckCommand extends Command {
  static CODE = Command.COMMAND_CHECK;
  static COMMAND_NAME = 'check command';

  static structure = new r.Struct({
    code: r.uint8,
    ident: r.uint16,
  });

  static async encode(ident) {
    return await super.encode(this.CODE, ident);
  }
}

class FluidDataItem {
  static async encode (code, length, value) {
    const stream = new r.EncodeStream();
    this.structure.encode(stream, {
      code,
      length,
      value,
    });
    stream.end();
    return Buffer.from(await getStream(stream, {encoding: 'utf-8'}));
  }

  static decodeArray(array) {
    const buffer = Buffer.from(array);
    const stream = new r.DecodeStream(buffer);
    return this.structure.decode(stream)
  }
}

class ItemLogPU extends FluidDataItem {
  static structure = new r.Struct({
    code: r.uint8,
    length: r.uint32,
    value: new r.Array(r.uint8, 'length'),
  });

  static async encode(code, value) {
    //console.log('length', value );
    const uint8array = (new util.TextEncoder('utf-8')).encode(value);
    return await super.encode(code, uint8array.length, uint8array);
  }

  static decode(array) {
    const r = super.decodeArray(array);
    r.value = Buffer.from(r.value).toString('utf-8');
    return r;
  }
}

(async () => {
  const command = await IdentityCommand.encode('1', '121212');
  console.log('command', command);

  const data = await ItemLogPU.encode('0', 'test');
  console.log('data', data);

  const command2 = await IdentityCommand.encode('2', data);
  console.log('command2', command2);

  const command3 = await CheckCommand.encode('3');
  console.log('command3', command3);

  const buffer = Buffer.from([0x02, 0x00, 0x03]);
  const object = Command.decode(buffer);
  console.log(object);

  const buffer2 = Buffer.from([
    0x01, 0x00, 0x02, 0x00,
    0x09, 0x00, 0x00, 0x00,
    0x00, 0x04, 0x74, 0x65,
    0x73, 0x74,
  ]);
  const object2 = Command.decode(buffer2);
  console.log(object2);

  const data2 = object2.data;
  const d = ItemLogPU.decode(data2);
  console.log('d', d);
})();
