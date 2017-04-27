import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const ItemInfoTypes = {
    STRING: 'text',
    TEXT: 'text'
};

export default class ItemInfo extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        let field = <Text>???</Text>
        if (this.props.editMode) {
            if (this.props.type === ItemInfoTypes.TEXT) {
                field = <TextInput 
                            style={[style.field]} 
                            placeholder={this.props.value}
                            value={this.props.value} 
                            onChangeText={(text) => this.props.onChange(text)}
                        />
            }
        }
        else {
            if (this.props.type === ItemInfoTypes.TEXT) {
                field = <Text style={[style.field, {paddingTop: 5, paddingBottom: 10}]}>{this.props.value}</Text>
            }
        }
        return (
            <View>
                <Text style={[style.fieldTitle]}>{this.props.name}</Text>
                {field}
            </View>
        );
    }
}


const style = StyleSheet.create({
    fieldTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    field: {
        fontSize: 20
    }
})