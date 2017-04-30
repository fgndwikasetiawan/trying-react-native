import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';

export class DeleteCircleButton extends Component {
    render() {
        const scale = this.props.scale || 1;
        return (
            <TouchableOpacity style={[{
                backgroundColor: '#f44',
                width: 20 * scale,
                height: 20 * scale,
                borderRadius: 10 * scale,
                justifyContent: 'center',
                alignItems: 'center'
            }, this.props.style]} onPress={() => {this.props.onPress ? this.props.onPress() : false}}>
                <Text style={{fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', fontSize: 16 * scale}}>X</Text>
            </TouchableOpacity>
        );
    }
}

export class AddCircleButton extends Component {
    render() {
        const scale = this.props.scale || 1;
        return (
            <TouchableOpacity style={[{
                backgroundColor: '#4f4',
                width: 20 * scale,
                height: 20 * scale,
                borderRadius: 10 * scale,
                justifyContent: 'center',
                alignItems: 'center'
            }, this.props.style]} onPress={() => {this.props.onPress ? this.props.onPress() : false}}>
                <Text style={{fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white', fontSize: 16 * scale}}>+</Text>
            </TouchableOpacity>  
        );
    }
}