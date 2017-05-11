import React, {Component} from 'react';
import {View, Text, ToastAndroid, TouchableOpacity, ScrollView, Dimensions, FlatList,
        Animated, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getDateString} from './utils.js';

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

function ExpiredListItem (props) {
    return (
        <View>
            <View style={{flexDirection: 'row', padding: 10}}>
                <Text style={{flex: 0.7, fontSize: 18}}>{props.item.stok}x {props.item.nama}</Text>
                <Icon name='calendar' style={{flex: 0.3, fontSize: 14}}>
                    {' '} {getDateString(props.item.kadaluarsa)}
                </Icon>
            </View>
        </View>
    );
}

function UnderstockedListItem (props) {
    return (
        <View>
            <View style={{flexDirection: 'row', padding: 10}}>
                <Text style={{flex: 0.7, fontSize: 18}}>{props.item.nama}</Text>
                <Icon name='cubes' style={{flex: 0.3, fontSize: 14, textAlign: 'right'}}>
                    {' '} {props.item.stok}/{props.item.threshold}
                </Icon>
            </View>
        </View>
    );
}

function deltaDays(date1, date2) {
    date1 = date1.getTime();
    date2 = date2.getTime();
    return (date2-date1)/1000/60/60/24;
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
            expiredItemTypeCount: 0,
            expiredItemList: [],
            understockedItemList: [],
            scrollAtTop: true
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
            this.calculateExpiredItems();
            this.calculateUnderstockedItems();
        }, (error) => {
            ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
        });
    }

    calculateExpiredItems() {
        let expiredItemTypeCount = 0;
        let expiredItemList = [];
        let currentDate = new Date();

        this.state.items.forEach((item) => {
            let threshold = item.thresholdKadaluarsa;
            let expired = false;
            item.stok.forEach((stokInfo) => {
                if (deltaDays(currentDate, stokInfo.kadaluarsa) <= threshold && stokInfo.stok > 0) {
                    expiredItemList.push({nama: item.nama, kadaluarsa: stokInfo.kadaluarsa, stok: stokInfo.stok, threshold: item.thresholdKadaluarsa});
                    expired = true;
                }
            });
            if (expired) {
                expiredItemTypeCount += 1;
            }
        });
        this.setState({expiredItemList, expiredItemTypeCount});
    }

    calculateUnderstockedItems() {
        let understockedItemList = [];
        this.state.items.forEach((item) => {
            let totalStok = item.stok.reduce((s1, s2) => s1.stok + s2.stok);
            if (totalStok < item.thresholdStok) {
                understockedItemList.push({nama: item.nama, stok: totalStok, threshold: item.thresholdStok});
            }
        });
        this.setState({understockedItemList});
    }

    scroll(direction) {
        if (!this._mainScrollView)
            return;

        if (direction) {
            if (direction.toLowerCase() === "up") {
                this._mainScrollView.scrollTo({y: 0, animated: true});
                this.setState({scrollAtTop: true});
            }
            else if (direction.toLowerCase() === "down") {
                this._mainScrollView.scrollToEnd({animated: true});
                this.setState({scrollAtTop: false});
            }
        }

        if (this.state.scrollAtTop) {
            this._mainScrollView.scrollToEnd({animated: true});
        }
        else {
            this._mainScrollView.scrollTo({y: 0, animated: true});
        }

        this.setState({scrollAtTop: !this.state.scrollAtTop});
    }

    render() {
        let listKadaluarsa = this.state.expiredItemList && this.state.expiredItemList.length > 0 ?
            <FlatList 
                data={this.state.expiredItemList.map((item) => {item.key = item.nama + '_' + item.kadaluarsa; return item})}
                renderItem={({item}) => <ExpiredListItem item={item}/>}
                style={{height: 80}}/>
            :
            <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text>Tidak ada barang mendekati kadaluarsa</Text>
            </View>
            
        let listStok = this.state.understockedItemList && this.state.understockedItemList.length > 0 ?
            <FlatList 
                data={this.state.understockedItemList.map((item) => {item.key = item.nama; return item})}
                renderItem={({item}) => <UnderstockedListItem item={item}/>}
                style={{height: 80}}/>
            :
            <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text>Tidak ada barang minim stok</Text>
            </View>

        return (
            <ScrollView scrollEnabled={false} ref={(ref) => {this._mainScrollView = ref}}>
                <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <InfoCardA style={{height: 190, width: 140}} 
                        header={<Icon style={{fontSize: 20, color: 'white'}} name='calendar'></Icon>}
                        mainColor='orange' main={this.state.expiredItemTypeCount} 
                        footer={
                            <Text>jenis barang <Text style={{color: '#b73', fontWeight: 'bold'}}>mendekati kadaluarsa</Text></Text>
                        } 
                        onPress={() => {
                                this.changeView('kadaluarsa');
                                //this.scroll('down');
                            }
                        }/>
                    <InfoCardA style={{height: 190, width: 140, marginLeft: 20}} 
                        header={<Icon style={{fontSize: 20, color: 'white'}} name='cubes'></Icon>}
                        main={this.state.understockedItemList.length} mainColor='maroon' 
                        footer={
                            <Text>jenis barang <Text style={{color: '#400', fontWeight: 'bold'}}>minim stok</Text></Text>
                        } 
                        onPress={() => {
                                this.changeView('stok');
                                //this.scroll('down');
                            }
                        }/>
                </View>

                <TouchableOpacity onPress={() => {this.scroll()}}>
                <View style={{flexDirection: 'row', marginTop: 40, height: 40, backgroundColor: '#555', elevation: 3,
                              paddingLeft: 10, paddingRight: 20}}>
                    <Text style={{flex: 0.7, height: '100%', textAlignVertical: 'center', color: 'white', fontWeight: 'bold', fontSize: 16}}>
                        {this.state.selectedView === 'kadaluarsa' ?
                            'Barang-barang mendekati kadaluarsa:' :
                            'Barang-barang minim stok:'}
                    </Text>
                    
                    <Icon name={this.state.scrollAtTop ? 'arrow-up' : 'arrow-down'} 
                          style={{flex: 0.3, textAlign: 'right', textAlignVertical: 'center', color: 'white', fontSize: 16}}/>

                </View>
                </TouchableOpacity>
                <Animated.View 
                    style={{
                            flexDirection: 'row', 
                            marginLeft: this.state.listAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -Dimensions.get('window').width]
                                        })
                    }}
                >
                    <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 40 - HEADER_HEIGHT , backgroundColor: '#f0f0f0', elevation: 3}}>
                        {listKadaluarsa}    
                    </View>
                    <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 40 - HEADER_HEIGHT , backgroundColor: '#f0f0f0', elevation: 3}}>
                        {listStok}    
                    </View>
                </Animated.View>
            </ScrollView>);
    }
}