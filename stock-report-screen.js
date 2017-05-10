import React, {Component} from 'react';
import {View, Text, ToastAndroid} from 'react-native';

/*
    props: {
        main: '',
        footer: '',
        mainFontSize: 24.
        mainColor: 'maroon',
        footerFontSize: 16,
        footerColor: '#333'
        mainAlign: 'center',
        footerAlign: 'center'
    }
*/
function InfoCardA (props) {
    return (
        <View style={[{paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 10, backgroundColor: 'white', borderRadius: 3, elevation: 3},props.style]}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: props.mainAlign || 'center', fontSize: props.mainFontSize || 48, fontWeight: 'bold', color: props.mainColor || 'maroon'}}>
                    {props.main}
                </Text>
            </View>
            <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: props.footerAlign || 'center', fontSize: props.footerFontSize || 16, color: props.footerColor || '#333'}}>
                    {props.footer}
                </Text>
            </View>
        </View>
    );
}

function dayDifferences(date1, date2) {
    date1 = date1.getValue();
    date2 = date2.getValue();
    return Math.abs(date1-date2)/1000/60/60/24;
}

export default class StockReportScreen extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            items: false
        }
        this.fetchItems();
    }

    fetchItems() {
        let realm = this.props.navigation.state.params.realm;
        let itemPromise = new Promise((resolve, reject) => {
            try {
                let items = realm.objects('Barang');
                if (items) {
                    resolve(items);
                }
                else {
                    reject('ERROR: items: ' + items);
                }
            }
            catch (error) {
                reject(error);
            }
        });
        itemPromise.then((items) => {
            this.setState({
                items: items
            });
        }, (error) => {
            ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
        });
    }

    calculateExpiredItems() {
        let expiredItems = [];
        let currentDate = new Date();

        this.state.items.forEach((item) => {
            let threshold = item.thresholdKadaluarsa;
            if (item.stok.some(
                (stokInfo) => dayDifferences(currentDate, stokInfo.kadaluarsa) <= threshold)
            ) {
                expiredItems.push(item);
            }
        });
        this.setState({expiredItems});
    }

    calculateUnderstockedItems() {

    }

    render() {
        return (
            <View>
                <Text>Under Construction</Text>
                <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <InfoCardA style={{height: 160, width: 120}} main='5' mainColor='orange' footer={
                        <Text>jenis barang <Text style={{color: 'orange', fontWeight: 'bold'}}>mendekati kadaluarsa</Text></Text>
                    }/>
                    <InfoCardA style={{height: 160, width: 120, marginLeft: 20}} main='7' mainColor='grey' footer={
                        <Text>jenis barang <Text style={{color: 'grey', fontWeight: 'bold'}}>kekurangan stok</Text></Text>
                    }/>
                </View>
            </View>);
    }
}