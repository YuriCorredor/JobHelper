import React from 'react';
import propTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

export default function Button({ onPress, textPadding, textColor, title, backgroundColor, padding, margin, width, flex }) {
    return (
        <TouchableOpacity 
            style={{
                flex: flex,
                width: width,
                margin: margin,
                borderRadius: 5,
                padding: padding,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor
            }} 
            onPress={onPress}
        >
            <Text style={{color: textColor, padding: textPadding}}>{title}</Text>
        </TouchableOpacity>
    );
}

Button.defaultProps = {
    onPress: () => {},
    textColor: '#e8eaed',
    textPadding: 5,
    title: 'title',
    backgroundColor: '#5d3fd3',
    padding: 5,
    margin: 0,
    width: '100%',
    flex: 0
}

Button.propTypes = {
    onPress: propTypes.func.isRequired,
    textColor: propTypes.string,
    textPadding: propTypes.number,
    backgroundColor: propTypes.string,
    padding: propTypes.number,
    margin: propTypes.number,
    flex: propTypes.number
}