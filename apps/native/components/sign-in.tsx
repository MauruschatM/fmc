import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	Surface,
	TextField,
} from "heroui-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { authClient } from "@/lib/auth-client";

export function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		setIsLoading(true);
		setError(null);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onError: (error) => {
					setError(error.error?.message || "Failed to sign in");
					setIsLoading(false);
				},
				onSuccess: () => {
					setEmail("");
					setPassword("");
				},
				onFinished: () => {
					setIsLoading(false);
				},
			}
		);
	};

	return (
		<Surface className="rounded-lg p-4" variant="secondary">
			<Text className="mb-4 font-medium text-foreground">Sign In</Text>

			<FieldError className="mb-3" isInvalid={!!error}>
				{error}
			</FieldError>

			<View className="gap-3">
				<TextField>
					<Label>Email</Label>
					<Input
						autoCapitalize="none"
						keyboardType="email-address"
						onChangeText={setEmail}
						placeholder="email@example.com"
						value={email}
					/>
				</TextField>

				<TextField>
					<Label>Password</Label>
					<Input
						onChangeText={setPassword}
						placeholder="••••••••"
						secureTextEntry
						value={password}
					/>
				</TextField>

				<Button className="mt-1" isDisabled={isLoading} onPress={handleLogin}>
					{isLoading ? (
						<Spinner color="default" size="sm" />
					) : (
						<Button.Label>Sign In</Button.Label>
					)}
				</Button>
			</View>
		</Surface>
	);
}
