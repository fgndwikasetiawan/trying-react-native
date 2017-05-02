export class Stok {}
Stok.schema = {
    name: 'Stok',
    properties: {
        kadaluarsa: 'date',
        stok: 'int'
    }
}

export class Barang {}
Barang.schema = {
    name: 'Barang',
    primaryKey: '_id',
    properties: {
        _id: {type: 'string'},
        nama: {type: 'string', indexed: true},
        harga: 'int',
        stok: {type: 'list', objectType: 'Stok'}
    }
}

export const RealmConfigs = {
    SCHEMA_VERSION: 1,
    SERVER_ADDRESS: 'http://128.199.186.34:9080',
    SYNC_URL: 'realm://128.199.186.34:9080/~/test-realm2'
}