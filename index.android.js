import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, TextInput, TouchableNativeFeedback, ListView, ScrollView } from 'react-native';
import Database from './database.js';

class ItemSearchItem extends Component {
    render() {
        return (
        <TouchableNativeFeedback onPress={() => false}>
            <View style={[style.listItem, ]}>
                <Text style={[style.listItemText]}>{this.props.name}</Text>
            </View>
        </TouchableNativeFeedback>
        );
    }
}

class ItemSearchScreen extends Component {
    constructor(props) {
        super(props);
        let db = new Database();
        let items = db.getItems();
        let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(items.map((item) => item.nama));
        this.state = {
            items: items,
            db: db,
            listDataSource: dataSource
        };

    }

    static navigationOptions = {
        title: 'Cari barang',
        headerStyle: {backgroundColor: '#5af'}
    }

    render() {
        return (
        <View style={[style.mainContainer]}>
            {/*Search bar*/}
            <View style={[style.searchBarContainer]}>
                
                <View style={[style.searchBar]}>
                    <TextInput style={[style.searchBarTextInput]} placeholder="Ketikkan nama barang..." underlineColorAndroid="transparent"/>
                </View>
            </View>
            {/*Separator*/}
            <View style={[style.separator]}></View>
            {/*Items list*/}
            <View style={[style.listViewContainer]}>
                
                <ListView dataSource={this.state.listDataSource} renderRow={
                    (rowData) => 
                        <ItemSearchItem name={rowData} />
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

AppRegistry.registerComponent("reactNative", () => ItemSearchScreen);