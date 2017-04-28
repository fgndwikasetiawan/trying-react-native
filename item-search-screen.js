import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, TextInput, TouchableNativeFeedback, ListView, ScrollView } from 'react-native';
import Database from './database.js';

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
        title: 'Cari barang',
        headerStyle: {backgroundColor: "#5af"},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white"
    }

    constructor(props) {
        super(props);
        let db = Database;
        let items = db.getItems();
        let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(items);
        this.state = {
            items: items,
            db: db,
            listDataSource: dataSource
        };
    }

    handleSearchTextChange(text) {
        this.setState({
            listDataSource: this.state.listDataSource.cloneWithRows(
                                this.state.items.filter((item) => item.nama.toLowerCase().contains(text.toLowerCase()))
                            )
        });
    }

    onListItemPress(item){
        this.props.navigation.navigate('ItemInfo', {item: item});
    }

    render() {
        return (
        <View style={[style.mainContainer]}>
            {/*Search bar*/}
            <View style={[style.searchBarContainer]}>
                <View style={[style.searchBar]}>
                    <TextInput style={[style.searchBarTextInput]} placeholder="Ketikkan nama barang..." underlineColorAndroid="transparent"
                                onChangeText={(text) => this.handleSearchTextChange(text)}
                    />
                </View>
            </View>
            {/*Separator*/}
            <View style={[style.separator]}></View>
            {/*Items list*/}
            <View style={[style.listViewContainer]}>
                
                <ListView dataSource={this.state.listDataSource} renderRow={
                    (rowData) => 
                        <ItemSearchItem item={rowData} onPress={() => this.onListItemPress(rowData)}/>
                }/>
                
            </View>
        </View>);
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