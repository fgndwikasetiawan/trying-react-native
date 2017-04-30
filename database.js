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
    primaryKey: 'nama',
    properties: {
        nama: 'string',
        harga: 'int',
        stok: {type: 'list', objectType: 'Stok'}
    }
}

export const REALM_SCHEMA_VERSION = 1;