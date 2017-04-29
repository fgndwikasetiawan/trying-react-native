export class Stok {}
Stok.schema = {
    name: 'Stok',
    properties: {
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
