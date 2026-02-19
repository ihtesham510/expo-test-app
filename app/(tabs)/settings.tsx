import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

export default function SettingsScreen() {
    const user = useQuery(api.auth.getCurrentUser);
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const handleSubmit = async () => {
        if (!email || !password) {
            return;
        }
        const res = await authClient.signUp.email({
            name: "ihtesham",
            email,
            password,
        });
        console.log(res);
    };
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
                <Image
                    source={require("@/assets/images/partial-react-logo.png")}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome! {user?.name ?? "Guest"}</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Email</ThemedText>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Password</ThemedText>
                <TextInput
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                    secureTextEntry={true}
                />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <Button title="Submit" onPress={handleSubmit} />
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
