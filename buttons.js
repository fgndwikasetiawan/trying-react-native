import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';

export class DeleteCircleButton extends Component {
    render() {
        const scale = this.props.scale || 1;
        return (
            <TouchableOpacity style={[{
                backgroundColor: '#d22',
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
                backgroundColor: '#2d2',
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

export class Button extends Component {
    render() {
        return (
            <TouchableOpacity style={[{ 
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 10,
                borderRadius: 5, 
                backgroundColor: this.props.color || "#5af", 
                justifyContent: "center", 
                alignItems: "center",
                elevation: 5
            }, this.props.style]} onPress={() => this.props.onPress ? this.props.onPress() : false}>
                <Text style={{
                    fontWeight: 'bold',
                    color: this.props.fontColor || 'white'
                }}>{typeof(this.props.title) === "string" ? this.props.title.toUpperCase() : "BUTTON"}</Text>
            </TouchableOpacity>
        );
    }
}