import {StyleSheet} from 'react-native';

export const colorPallette = {
    primary: "#5af",
    grey: "grey",
    disabled: "#aaa",
    textNormal: "#111",
    textWithPrimaryBackground: "white"
}

export const defaultStyle = StyleSheet.create({
    button: { 
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
		marginTop: 10,
		borderRadius: 5, 
		backgroundColor: "#5af", 
		justifyContent: "center", 
		alignItems: "center",
		elevation: 5
	}
});


