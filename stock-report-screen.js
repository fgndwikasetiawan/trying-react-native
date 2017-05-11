import React, {Component} from 'react';
import {View, Text, ToastAndroid, TouchableOpacity, ScrollView, Dimensions, FlatList,
        Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HEADER_HEIGHT = 80;

/*
    props: {
        header: ''
        main: '',
        footer: '',
        headerFontSize: 20,
        headerColor: '#555'
        mainFontSize: 24.
        mainColor: 'maroon',
        footerFontSize: 16,
        footerColor: '#333',
        headerAlign: 'center',
        mainAlign: 'center',
        footerAlign: 'center'
    }
*/
function InfoCardA (props) {
    return (
        <TouchableOpacity onPress={props.onPress} style={[{paddingBottom: 10, backgroundColor: 'white', borderRadius: 3, elevation: 3},props.style]}>
            <View style={{borderRadius: 3, backgroundColor: props.headerBackColor || '#6bf', paddingTop: 5, paddingBottom: 5}}>
                <Text style={{textAlign: props.headerAlign || 'center', fontSize: props.headerSize || 20, color: props.headerColor || '#555'}}>{props.header}</Text>
            </View>
            <View style={{marginTop: 20, paddingLeft: 20, paddingRight: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: props.mainAlign || 'center', fontSize: props.mainFontSize || 64, fontWeight: 'bold', color: props.mainColor || 'maroon'}}>
                    {props.main}
                </Text>
            </View>
            <View style={{marginTop: 5, paddingLeft: 20, paddingRight: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: props.footerAlign || 'center', fontSize: props.footerFontSize || 16, color: props.footerColor || '#333'}}>
                    {props.footer}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

function dayDifferences(date1, date2) {
    date1 = date1.getValue();
    date2 = date2.getValue();
    return Math.abs(date1-date2)/1000/60/60/24;
}

export default class StockReportScreen extends Component {
    static navigationOptions = {
        title: 'Laporan Stok & Kadaluarsa',
        headerStyle: {backgroundColor: '#5af'},
        headerTitleStyle: {color: 'white'},
        headerTintColor: 'white'
    }

    constructor(props) {
        super(props);
        this.state =  {
            items: false,
            selectedView: 'kadaluarsa',
            listAnim: new Animated.Value(0), 
        }
        this.fetchItems();
    }

    changeView(viewName) {
        this.setState({
            selectedView: viewName
        });
        let endValue = viewName === 'kadaluarsa' ? 0 : 1;
        Animated.timing(this.state.listAnim, {toValue: endValue}).start();
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
        let listKadaluarsa = 
            <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 40 - HEADER_HEIGHT , backgroundColor: '#f0f0f0', elevation: 3}}>
                <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Barang-barang mendekati kadaluarsa</Text>
                </View>
            </View>;
        let listStok = 
            <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 40 - HEADER_HEIGHT , backgroundColor: '#f0f0f0', elevation: 3}}>
                <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Barang-barang kekurangan stok</Text>
                </View>
            </View>;

        return (
            <ScrollView>
                <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <InfoCardA style={{height: 190, width: 140}} 
                        header={<Icon style={{fontSize: 20, color: 'white'}} name='calendar'></Icon>}
                        mainColor='orange' main='5' 
                        footer={
                            <Text>jenis barang <Text style={{color: '#b73', fontWeight: 'bold'}}>mendekati kadaluarsa</Text></Text>
                        } 
                        onPress={() => this.changeView('kadaluarsa')}/>
                    <InfoCardA style={{height: 190, width: 140, marginLeft: 20}} 
                        header={<Icon style={{fontSize: 20, color: 'white'}} name='cubes'></Icon>}
                        main='7' mainColor='maroon' 
                        footer={
                            <Text>jenis barang <Text style={{color: '#400', fontWeight: 'bold'}}>minim stok</Text></Text>
                        } 
                        onPress={() => this.changeView('stok')}/>
                </View>

                <View style={{marginTop: 40, height: 40, backgroundColor: '#555', elevation: 3,
                              justifyContent: 'center', paddingLeft: 10}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                        {this.state.selectedView === 'kadaluarsa' ?
                            'Barang-barang mendekati kadaluarsa:' :
                            'Barang-barang minim stok:'}
                    </Text>
                </View>
                <Animated.View 
                    style={{
                            flexDirection: 'row', 
                            marginLeft: this.state.listAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -Dimensions.get('window').width]
                                        })
                    }}
                >
                    {listKadaluarsa}
                    {listStok}
                </Animated.View>

            </ScrollView>);
    }
}