import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import apiRequisicaoEmpresa from '../Service/apiRequisicaoEmpresa.js';
import { setEmpresaStore } from '../store/store.js';

const TelaInicial = () => {
    const navigation = useNavigation();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [campoBuscarPorNomePetShop, setCampoBuscarPorNomePetShop] = useState('');
    const [listaLogos, setListaLogos] = useState([]);

    const categorias = [
        { id: 1, nome: 'Pet shop', icone: require('../../assets/PetShop.png') },
        { id: 2, nome: 'Veterinário', icone: require('../../assets/Veterinario.png') },
        { id: 3, nome: 'Hotel', icone: require('../../assets/HotelPet.png') },
        { id: 4, nome: 'Creche', icone: require('../../assets/Creche.png') },
        // adicione mais se quiser
    ];

    const promocoes = [
        {
            id: 1,
            titulo: 'Banho + Tosa por R$ 50',
            descricao: 'Promoção válida até domingo!',
            imagem: 'https://via.placeholder.com/400x120.png?text=Promoção+Pet',
        },
        // outras promoções se desejar...
    ];

    const irParaAgendamento = (idPetShop) => {
        const empresaSelecionada = empresas.find(e => e.idEmpresa === idPetShop);
        setEmpresaStore(empresaSelecionada);
        navigation.navigate('Agendamento', { idEmpresaPetShop: idPetShop });
    };

    // const buscarNaAPIPorNome = async () => {
    //     setLoading(true);
    //     try {
    //         const dados = await apiRequisicaoEmpresa.buscarNaAPIPorNomePetShop();
    //         setEmpresas(dados);
    //     } catch (error) {
    //         console.log('Erro ao buscar:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                const [empresasResp, logosResp] = await Promise.all([
                    apiRequisicaoEmpresa.buscarEmpresas(),
                    apiRequisicaoEmpresa.buscarLogosEmpresas()
                ]);

                setEmpresas(empresasResp);
                setListaLogos(logosResp);
            } catch (error) {
                console.log('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    return (
        <View style={estilos.container}>
            <Text style={estilos.tituloSecao}>Categorias</Text>
            <View style={estilos.gridCategorias}>
                {categorias.map((categoria, index) => (
                    <View
                        key={categoria.id}
                        style={[
                            estilos.itemCategoria,
                            index % 3 === 0 ? estilos.categoriaGrande : estilos.categoriaPequena,
                        ]}
                    >
                        <Image source={categoria.icone} style={estilos.iconeCategoria} />
                        <Text style={estilos.textoCategoria}>{categoria.nome}</Text>
                    </View>
                ))}
            </View>

            <Text style={estilos.tituloSecao}>Promoções</Text>
            <FlatList
                data={promocoes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={estilos.cartaoPromocao}>
                        <Image source={{ uri: item.imagem }} style={estilos.imagemPromocao} />
                        <View style={estilos.infoPromocao}>
                            <Text style={estilos.tituloPromocao}>{item.titulo}</Text>
                            <Text style={estilos.descricaoPromocao}>{item.descricao}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* <View style={estilos.containerBusca}>
                <TextInput
                    style={estilos.inputBusca}
                    placeholder="Buscar por nome do pet shop"
                    placeholderTextColor="#aaa"
                    value={campoBuscarPorNomePetShop}
                    onChangeText={setCampoBuscarPorNomePetShop}
                />
                <TouchableOpacity style={estilos.botaoBusca} onPress={buscarNaAPIPorNome}>
                    <Text style={estilos.textoBotaoBusca}>Buscar</Text>
                </TouchableOpacity>
            </View> */}

            <Text style={estilos.tituloSecao}>Pet Shops</Text>

            {loading ? (
                <View style={estilos.overlay}>
                    <ActivityIndicator size="large" color="#28A745" />
                </View>
            ) : (
                <FlatList
                    data={empresas}
                    keyExtractor={(item) => item.idEmpresa.toString()}
                    renderItem={({ item }) => {
                        const logo = listaLogos.find(logo => logo.idEmpresa === item.idEmpresa);
                        const imagemLogo = logo?.url || "https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png";

                        return (
                            <TouchableOpacity onPress={() => irParaAgendamento(item.idEmpresa)}>
                                <View style={estilos.itemPetShop}>
                                    <Image
                                        source={{ uri: imagemLogo }}
                                        style={estilos.iconePetShop}
                                    />
                                    <View>
                                        <Text style={estilos.nomePetShop}>{item.descricaoNomeFisica}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <View style={estilos.menu}>
                <TouchableOpacity style={estilos.menuItem} onPress={() => navigation.navigate('Principal')}>
                    <Icon name="home" size={24} color="#333" />
                    <Text style={estilos.menuTexto}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.menuItem} onPress={() => navigation.navigate('ConsultaAgendamento')}>
                    <Icon name="search-outline" size={24} color="#333" />
                    <Text style={estilos.menuTexto}>Buscar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={estilos.menuItem}
                    onPress={() => navigation.navigate('Usuario', { EhUsuarioNovo: false })}
                >
                    <Icon name="person-outline" size={24} color="#333" />
                    <Text style={estilos.menuTexto}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    tituloSecao: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#2C3E50',
        paddingHorizontal: 16,
    },
    gridCategorias: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    itemCategoria: {
        backgroundColor: '#E8F6EF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    categoriaGrande: {
        width: '48%',
        height: 130,
    },
    categoriaPequena: {
        width: '31%',
        height: 100,
    },
    iconeCategoria: {
        width: 50,
        height: 50,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    textoCategoria: {
        fontSize: 14,
        color: '#34495E',
        textAlign: 'center',
        fontWeight: '500',
    },
    cartaoPromocao: {
        backgroundColor: '#F0F4FF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    imagemPromocao: {
        width: '100%',
        height: 120,
    },
    infoPromocao: {
        padding: 10,
    },
    tituloPromocao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    descricaoPromocao: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    containerBusca: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    inputBusca: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        marginRight: 8,
        color: '#333',
    },
    botaoBusca: {
        backgroundColor: '#28A745',
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
    },
    textoBotaoBusca: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemPetShop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconePetShop: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    nomePetShop: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: 'bold',
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    menuItem: {
        alignItems: 'center',
    },
    menuTexto: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TelaInicial;
