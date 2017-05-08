import React, {Component} from 'react';
import {View} from 'react-native';

export class HorizontalBar extends Component {
    render() {
        return(
            <View style={[{width: "100%", 
            marginTop: this.props.marginTop || this.props.margin || 10,
            marginBottom: this.props.marginBottom || this.props.margin || 10, 
            backgroundColor: this.props.color || "#ccc", 
            height: this.props.height || 2}, 
            this.props.style]}></View>
        );
    }
}