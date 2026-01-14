import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {
	label?: string;
	loading?: boolean;
	onPress?: () => void;
	disabled?: boolean;
};

export default function SocialButton({ label = 'Continue with Google', loading, onPress, disabled }: Props) {
	return (
		<Button
			mode="contained"
			icon="google"
			loading={loading}
			style={styles.button}
			labelStyle={styles.label}
			onPress={onPress}
			disabled={disabled}
		>
			{label}
		</Button>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#E5E5E5',
		borderRadius: 18,
		paddingVertical: 8,
		marginVertical: 10,
	},
	label: {
		color: '#14213D',
		fontSize: 16,
		fontWeight: '600',
	},
});
