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
        kategori: {type: 'string', default: ''},
        stok: {type: 'list', objectType: 'Stok'},
        thresholdKadaluarsa: 'int',
        thresholdStok: 'int'
    }
}

export class BarangTransaksi {}
BarangTransaksi.schema = {
    name: 'BarangTransaksi',
    properties: {
        nama: {type: 'string'},
        harga: {type: 'int'},
        jumlah: {type: 'int'}
    }
}

export class Transaksi {}
Transaksi.schema = {
    name: 'Transaksi',
    properties: {
        pelanggan: {type: 'string'},
        transaksi: {type: 'list', objectType: 'BarangTransaksi'},
        waktu: {type: 'date'},
        status: {type: 'string', default: ''}
    }
}

export const RealmConfigs = {
    SCHEMA_VERSION: 1,
    SERVER_ADDRESS: 'http://128.199.186.34:9080',
    SYNC_URL: 'realm://128.199.186.34:9080/~/test-realm2'
}