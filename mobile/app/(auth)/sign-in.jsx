import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,                        // ✅ ADDED
  KeyboardAvoidingView,              // ✅ ADDED
  Platform,                          // ✅ ADDED
  TouchableWithoutFeedback,         // ✅ ADDED
  Keyboard,                          // ✅ ADDED
} from "react-native";
import { useState } from "react";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";  ❌ REMOVED
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    // ✅ ADDED: Dismiss keyboard when clicking outside inputs
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* ✅ ADDED: KeyboardAvoidingView instead of KeyboardAwareScrollView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* ✅ ADDED: Wrap your form with ScrollView */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Image
              source={require("../../assets/images/revenue-i4.png")}
              style={styles.illustration}
            />
            <Text style={styles.title}>Welcome Back</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />

            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>

              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
