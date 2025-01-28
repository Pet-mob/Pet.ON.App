import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

const EsqueceuSenha = () => {
    const [step, setStep] = useState(1); // Controla qual etapa está ativa
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigation = useNavigation();
    // Simula o envio do código SMS
    const sendSMS = () => {
        if (phoneNumber) {
            Alert.alert("Código Enviado", `O código foi enviado para ${phoneNumber}.`);
            setStep(2); // Avança para a próxima etapa
        } else {
            Alert.alert("Erro", "Por favor, insira um número de telefone válido.");
        }
    };

    // Valida o código inserido
    const validateCode = () => {
        if (verificationCode === "123456") {
            Alert.alert("Código Validado", "Agora você pode redefinir sua senha.");
            setStep(3); // Avança para a etapa de redefinição de senha
        } else {
            Alert.alert("Erro", "O código está incorreto.");
        }
    };

    // Redefine a senha
    const resetPassword = () => {
        if (newPassword) {
            Alert.alert("Sucesso", "Sua senha foi redefinida com sucesso!");
            // Aqui você pode redirecionar o usuário para a tela de login
            navigation.navigate('Login');
        } else {
            Alert.alert("Erro", "Por favor, insira uma nova senha.");
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 && (
                <>
                    <Text style={styles.title}>Esqueceu sua senha?</Text>
                    <Text style={styles.subtitle}>
                        Insira seu número de telefone para receber o código.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de telefone"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TouchableOpacity style={styles.button} onPress={sendSMS}>
                        <Text style={styles.buttonText}>Enviar Código</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <>
                    <Text style={styles.title}>Verificação</Text>
                    <Text style={styles.subtitle}>
                        Insira o código que enviamos para {phoneNumber}.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Código de Verificação"
                        keyboardType="numeric"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                    />
                    <TouchableOpacity style={styles.button} onPress={validateCode}>
                        <Text style={styles.buttonText}>Validar Código</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 3 && (
                <>
                    <Text style={styles.title}>Redefinir Senha</Text>
                    <Text style={styles.subtitle}>Crie uma nova senha.</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova Senha"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={resetPassword}>
                        <Text style={styles.buttonText}>Redefinir Senha</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#F9F9F9",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EsqueceuSenha;
