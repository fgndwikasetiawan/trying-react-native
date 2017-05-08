import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, TextInput, TouchableNativeFeedback, ListView, ScrollView,
         ToastAndroid, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';

class ItemSearchItem extends Component {
    render() {
        return (
        <TouchableNativeFeedback onPress={() => this.props.onPress()}>
            <View style={[style.listItem]}>
                <Text style={[style.listItemText]}>{this.props.item.nama}</Text>
            </View>
        </TouchableNativeFeedback>
        );
    }
}

export default class ItemSearchScreen extends Component {
    static navigationOptions = {
        title: 'Cari Barang',
        headerStyle: {backgroundColor: "#5af"},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white"
    }

    constructor(props) {
        super(props);
        this.state = {
            realm: this.props.navigation.state.params.realm,
            items: false,
            searchText: '',
            listDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
        //make a promise to fetch items from realm
        this.refreshItems();
    }

    refreshItems() {
        let itemsPromise = new Promise((resolve, reject) => {
            try {
                items = this.state.realm.objects('Barang');
                resolve(items);
            }
            catch (error) {
                reject(error);
            }
        });
        itemsPromise.then(
            (items) => {
                        this.setState({
                           items: items,
                           listDataSource: this.state.listDataSource.cloneWithRows(items) 
                        });
                        this.handleSearchTextChange(this.state.searchText);
            },
            (error) => ToastAndroud.show(error.toString(), ToastAndroid.SHORT)
        );
    }

    clearItems() {
        this.setState({
            items: false,
            listDataSource: this.state.listDataSource.cloneWithRows([])
        })
    }

    handleSearchTextChange(text) {
        if (this.state.items.filtered) { 
            this.setState({
                searchText: text,
                listDataSource: this.state.listDataSource.cloneWithRows(
                                    this.state.items.filtered('nama CONTAINS[c] "' + text + '"')
                                )
            })
        }
    }

    onListItemPress(item){
        let realm = this.state.realm;
        this.props.navigation.goBack();
        this.props.navigation.navigate('ItemInfo', {item: item, realm: realm, itemSearchScreen: this});
    }


    render() {
        let listBody = this.state.items === false ?
            <ActivityIndicator style={{paddingTop: "10%", justifyContent: "center", alignItems: "center"}} size="large" color="grey"/> :
            <ListView dataSource={this.state.listDataSource} renderRow={
                (rowData) => 
                    <ItemSearchItem item={rowData} onPress={() => this.onListItemPress(rowData)}/>
            }/>;
        
        return (
        <View style={[style.mainContainer]}>
            {/*Search bar*/}
            <View style={[style.searchBarContainer]}>
                <View style={[style.searchBar]}>
                    <TextInput style={[style.searchBarTextInput]} value={this.state.searchText} placeholder="Ketikkan nama barang..." underlineColorAndroid="transparent"
                                onChangeText={(text) => this.handleSearchTextChange(text)}
                    />
                </View>
            </View>
            {/*Separator*/}
            <View style={[style.separator]}></View>
            {/*Items list*/}
            <View style={[style.listViewContainer]}>
                {listBody}
            </View>
        </View>
        );
    }

}

const style = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ddd"
    },
    searchBarContainer: {
        height: "10%"
    },
    separator: {
        height: "1%",
        backgroundColor: "#6af",
        width: "100%"
    },
    listViewContainer: {
        height: "89%"
    },
    searchBar: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10
    },
    searchBarTextInput: {
        fontSize: 18,
        width: "90%"
    },
    listItem: {
        backgroundColor: "white",
        height: 50,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 2,
        shadowColor: "black",
        shadowOpacity: 0.5,
        elevation: 1
    },
    listItemText: {
        fontSize: 18
    }    
});