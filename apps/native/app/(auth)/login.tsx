import { Ionicons } from "@expo/vector-icons";
import { useConvexAuth } from "convex/react";
import { Redirect } from "expo-router";
import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	TextField,
} from "heroui-native";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";

export default function LoginScreen() {
	const { isAuthenticated } = useConvexAuth();
	const insets = useSafeAreaInsets();
	const [mode, setMode] = useState<AuthMode>("signin");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (isAuthenticated) {
		return <Redirect href="/(tabs)" />;
	}

	const resetForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setError(null);
		setShowPassword(false);
	};

	const switchMode = (newMode: AuthMode) => {
		resetForm();
		setMode(newMode);
	};

	const handleSignIn = async () => {
		setIsLoading(true);
		setError(null);

		await authClient.signIn.email(
			{ email, password },
			{
				onError: (err) => {
					setError(err.error?.message || "Failed to sign in");
					setIsLoading(false);
				},
				onSuccess: () => {
					resetForm();
				},
				onFinished: () => {
					setIsLoading(false);
				},
			}
		);
	};

	const handleSignUp = async () => {
		setIsLoading(true);
		setError(null);

		await authClient.signUp.email(
			{ name, email, password },
			{
				onError: (err) => {
					setError(err.error?.message || "Failed to create account");
					setIsLoading(false);
				},
				onSuccess: () => {
					resetForm();
				},
				onFinished: () => {
					setIsLoading(false);
				},
			}
		);
	};

	const handleSubmit = mode === "signin" ? handleSignIn : handleSignUp;
	const isSignIn = mode === "signin";

	return (
		<View
			className="flex-1 bg-background"
			style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
				>
					<View className="flex-1 px-6 py-8">
						{/* Header / Branding */}
						<View className="items-center pt-12">
							{/* Logo Mark */}
							<View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-foreground">
								<Text
									className="text-2xl text-background"
									style={{ fontFamily: "SpaceGrotesk_700Bold" }}
								>
									F
								</Text>
							</View>

							<Text
								className="text-4xl text-foreground tracking-tight"
								style={{ fontFamily: "SpaceGrotesk_700Bold" }}
							>
								FMC
							</Text>

							<Text
								className="mt-2 text-center text-muted"
								style={{ fontFamily: "SpaceGrotesk_400Regular" }}
							>
								Fleet Management & Control
							</Text>
						</View>

						{/* Form Section */}
						<View className="mt-10">
							{/* Mode Toggle */}
							<View className="mb-8 flex-row rounded-xl bg-secondary p-1.5">
								<Pressable
									className={`flex-1 items-center rounded-lg py-3 ${isSignIn ? "bg-foreground" : ""}`}
									onPress={() => switchMode("signin")}
								>
									<Text
										className={`text-sm ${isSignIn ? "text-background" : "text-muted"}`}
										style={{
											fontFamily: isSignIn
												? "SpaceGrotesk_600SemiBold"
												: "SpaceGrotesk_400Regular",
										}}
									>
										Sign In
									</Text>
								</Pressable>
								<Pressable
									className={`flex-1 items-center rounded-lg py-3 ${isSignIn ? "" : "bg-foreground"}`}
									onPress={() => switchMode("signup")}
								>
									<Text
										className={`text-sm ${isSignIn ? "text-muted" : "text-background"}`}
										style={{
											fontFamily: isSignIn
												? "SpaceGrotesk_400Regular"
												: "SpaceGrotesk_600SemiBold",
										}}
									>
										Create Account
									</Text>
								</Pressable>
							</View>

							{/* Error Display */}
							{error ? (
								<Animated.View
									entering={FadeIn.duration(200)}
									exiting={FadeOut.duration(200)}
								>
									<FieldError className="mb-4" isInvalid>
										{error}
									</FieldError>
								</Animated.View>
							) : null}

							{/* Form Fields */}
							<View className="gap-4">
								{isSignIn ? null : (
									<Animated.View
										entering={FadeIn.duration(300)}
										exiting={FadeOut.duration(200)}
									>
										<TextField>
											<Label>Full Name</Label>
											<Input
												onChangeText={setName}
												placeholder="Your name"
												value={name}
											/>
										</TextField>
									</Animated.View>
								)}

								<TextField>
									<Label>Email</Label>
									<Input
										autoCapitalize="none"
										autoComplete="email"
										keyboardType="email-address"
										onChangeText={setEmail}
										placeholder="you@example.com"
										value={email}
									/>
								</TextField>

								<TextField>
									<Label>Password</Label>
									<View className="relative">
										<Input
											autoCapitalize="none"
											onChangeText={setPassword}
											placeholder="Enter your password"
											secureTextEntry={!showPassword}
											value={password}
										/>
										<Pressable
											className="absolute top-3 right-3"
											hitSlop={8}
											onPress={() => setShowPassword((prev) => !prev)}
										>
											<Ionicons
												color="#888"
												name={showPassword ? "eye-off-outline" : "eye-outline"}
												size={20}
											/>
										</Pressable>
									</View>
								</TextField>

								{/* Submit Button */}
								<Button
									className="mt-2 rounded-xl py-3.5"
									isDisabled={isLoading}
									onPress={handleSubmit}
								>
									{isLoading ? (
										<Spinner color="default" size="sm" />
									) : (
										<Button.Label
											style={{
												fontFamily: "SpaceGrotesk_600SemiBold",
											}}
										>
											{isSignIn ? "Sign In" : "Create Account"}
										</Button.Label>
									)}
								</Button>
							</View>
						</View>

						{/* Footer */}
						<View className="mt-8 items-center">
							<Text
								className="text-center text-muted text-xs"
								style={{
									fontFamily: "SpaceGrotesk_400Regular",
								}}
							>
								By continuing, you agree to our Terms of Service
							</Text>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
