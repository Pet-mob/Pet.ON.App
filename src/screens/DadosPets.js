import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getUsuarioStore } from '../store/store';
import apiRequisicaoAnimal from '../Service/apiRequisicaoAnimal.js';
import { colors, spacing, fontSizes, radii } from '../theme/theme1.js';

const DadosPets = () => {
    const [loading, setLoading] = useState(true);
    const [idAnimal, setIdAnimal] = useState('');
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [raca, setRaca] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [foto, setFoto] = useState(null);
    const [listaDePets, setListaDePets] = useState([]);
    const navigation = useNavigation();
    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;
    const urlFotoPadrao = 'https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D';

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [petsApi] = await Promise.all([
                apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario)
            ]);
            setListaDePets(petsApi);
            // Carregar fotos dos pets
            const fotos = await apiRequisicaoAnimal.buscarFotosAnimalPorUsuario(idUsuario);
            const petsComFoto = petsApi.map(pet => {
                const foto = fotos?.find(f => f.idAnimal === pet.idAnimal);
                return {
                    ...pet,
                    imagem: foto?.url || 'https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D'
                };
            });
            setListaDePets(petsComFoto);
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar serviços ou pets.');
        } finally {
            setLoading(false);
        }
    };

    const buscarPetsPorUsuario = async (idUsuarioParam) => {
        try {
            const resposta = await apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuarioParam);
            if (resposta) {
                setListaDePets(resposta);
            } else {
                alert("Nenhum pet cadastrado.");
            }
        } catch (error) {
            alert('Erro ao carregar dados dos pets.');
        }
    };

    const enviarFotoDetalhadamente = async (idGeradoAnimal) => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    try {
                        const resposta = await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(file, idUsuario, idGeradoAnimal);
                        setFoto(resposta);
                        return resposta;
                    } catch (error) {
                        console.error('Erro ao enviar foto do animal:', error);
                    }
                }
            };
            input.click();
        } else {
            // const resultado = await ImagePicker.launchImageLibraryAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //     allowsEditing: true,
            //     quality: 1,
            // });

            if (foto) {
                try {
                    const resposta = await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(foto, idUsuario, idGeradoAnimal);
                    setFoto(resposta);
                    return resposta;
                } catch (error) {
                    console.error('Erro ao enviar foto do animal:', error);
                }
            }
        }
    };

    const selecionarFoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const salvarPet = async () => {
        if (!nome || !idade || !raca) {
            Alert.alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            let sucesso;
            let idGerado = idAnimal;

            if (idAnimal) {
                sucesso = await apiRequisicaoAnimal.alterarAnimal(idAnimal, nome, idade, raca, observacoes, idUsuario);
            } else {
                const novoPet = await apiRequisicaoAnimal.inserirAnimal(nome, idade, raca, observacoes, idUsuario);
                sucesso = novoPet?.idAnimal > 0;
                idGerado = novoPet?.idAnimal;
            }

            if (sucesso) {
                if (foto && idGerado) {
                    const uploadSucesso = await enviarFotoDetalhadamente(idGerado);
                    if (!uploadSucesso) {
                        Alert.alert('Pet salvo, mas houve erro ao enviar a imagem.');
                    }
                }

                alert(idAnimal ? 'Pet alterado com sucesso!' : 'Pet inserido com sucesso!');
                resetarFormulario();
                buscarPetsPorUsuario(idUsuario);
            } else {
                alert('Falha ao salvar pet.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar pet.');
        }
    };
    const resetarFormulario = () => {
        setIdAnimal('');
        setNome('');
        setIdade('');
        setRaca('');
        setObservacoes('');
        setFoto(null);
    };

    const excluirPet = (idAnimalParam) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza de que deseja excluir este pet?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        try {
                            const sucesso = await apiRequisicaoAnimal.excluirAnimal(idUsuario, idAnimalParam);
                            if (sucesso) {
                                alert('Pet excluído com sucesso!');
                                buscarPetsPorUsuario(idUsuario);
                            } else {
                                alert('Erro ao excluir pet.');
                            }
                        } catch (error) {
                            console.error(error);
                            alert('Erro ao excluir pet.');
                        }
                    }
                }
            ]
        );
    };

    const editarPet = (pet) => {
        setIdAnimal(pet.idAnimal);
        setNome(pet.nome);
        setIdade(pet.idade);
        setRaca(pet.raca);
        setObservacoes(pet.observacoes);
        setFoto(pet.photo || null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados dos Pets</Text>
            </View>

            {loading ? <ActivityIndicator size="large" color="#007aff" /> : (
                <KeyboardAwareScrollView
                    style={styles.bodyContainer}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid
                >
                    <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
                        <Image
                            source={foto ? { uri: foto } : { uri: urlFotoPadrao }}
                            style={styles.foto}
                        />
                        <Text style={styles.textoFoto}>Selecionar Foto</Text>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Pet</Text>
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Digite o nome"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Idade</Text>
                        <TextInput
                            style={styles.input}
                            value={idade}
                            onChangeText={setIdade}
                            placeholder="Digite a idade"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Raça</Text>
                        <TextInput
                            style={styles.input}
                            value={raca}
                            onChangeText={setRaca}
                            placeholder="Digite a raça"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Observações</Text>
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            value={observacoes}
                            onChangeText={setObservacoes}
                            placeholder="Informações adicionais"
                            multiline
                        />
                    </View>

                    <TouchableOpacity onPress={salvarPet} style={styles.button}>
                        <Text style={styles.buttonText}>
                            {idAnimal ? 'Alterar' : 'Adicionar'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.titleList, { marginTop: 15 }]}>Pets Cadastrados</Text>
                    {listaDePets.length === 0 ? (
                        <Text style={styles.noPetsText}>Nenhum pet cadastrado.</Text>
                    ) : (
                        listaDePets.map((pet) => (
                            <View key={pet.idAnimal} style={styles.petItem}>
                                <Image
                                    source={{ uri: pet.imagem }}
                                    style={styles.petImage}
                                />
                                <View style={styles.petDetails}>
                                    <Text style={styles.petText}>Nome: {pet.nome}</Text>
                                    <Text style={styles.petText}>Idade: {pet.idade}</Text>
                                    <Text style={styles.petText}>Raça: {pet.raca}</Text>
                                    <Text style={styles.petText}>Obs: {pet.observacoes}</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => editarPet(pet)}>
                                        <Ionicons name="create-outline" size={24} color={colors.secondary} />
                                    </TouchableOpacity>
                                    {/*                                                                    
                                    <TouchableOpacity onPress={() => excluirPet(pet.idAnimal)} style={{ marginTop: 10 }}>
                                        <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
                                    </TouchableOpacity>
                                    */}
                                </View>
                            </View>
                        ))
                    )}
                </KeyboardAwareScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#4F46E5',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        left: 16,
        top: 50,
        // padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    titleList: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 6,
    },
    bodyContainer: {
        padding: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    foto: {
        width: 120,
        height: 120,
        borderRadius: radii.full,
        backgroundColor: '#e0e0e0',
    },
    textoFoto: {
        marginTop: spacing.sm,
        color: colors.secondary,
        fontWeight: '500',
    },
    button: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: radii.md,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    buttonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: fontSizes.medium,
    },
    noPetsText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground || '#fff',
        borderRadius: radii.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    petImage: {
        width: 70,
        height: 70,
        borderRadius: radii.full,
        marginRight: spacing.md,
    },
    petDetails: {
        flex: 1,
    },
    petText: {
        fontSize: fontSizes.small,
        color: colors.textPrimary,
    },
    actions: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DadosPets;
