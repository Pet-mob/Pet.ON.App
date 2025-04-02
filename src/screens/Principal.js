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
import ApiPetshop from '../Service/apiPetShop';

// // Dados simulados para categorias e pet shops
// const categorias = [
//     { id: '1', nome: 'Banho e Tosa', icone: require('../../assets/adaptive-icon.png') },
//     { id: '2', nome: 'Veterinário', icone: require('../../assets/adaptive-icon.png') },
//     { id: '3', nome: 'Acessórios', icone: require('../../assets/adaptive-icon.png') },
//     { id: '4', nome: 'Rações', icone: require('../../assets/adaptive-icon.png') },
// ];

// const petShops = [
//     {
//         id: '1',
//         nome: 'PetShop Feliz',
//         distancia: '1.5 km',
//         avaliacao: '4.8',
//         icone: require('../../assets/LogoPetON.png'),
//     },
//     {
//         id: '2',
//         nome: 'Amigos do Pet',
//         distancia: '2.0 km',
//         avaliacao: '4.7',
//         icone: require('../../assets/LogoPetON.png'),
//     },
//     {
//         id: '3',
//         nome: 'Banho & Brilho',
//         distancia: '3.2 km',
//         avaliacao: '4.6',
//         icone: require('../../assets/LogoPetON.png'),
//     },
// ];

const TelaInicial = () => {
    const navigation = useNavigation();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campoBuscarPorNomePetShop, setCampoBuscarPorNomePetShop] = useState('');

    const buscarTodasEmpresas = async () => {
        try {
            const resposta = await ApiPetshop.request('/Empresa', 'get');
            setEmpresas(resposta);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
        } finally {
            setLoading(false);
        }
    };

    const buscarNaAPIPorNomePetShop = async () => {
        try {
            if (campoBuscarPorNomePetShop == "") return null;
            const dtoRequisicao = {
                DescricaoNomeFantasia: campoBuscarPorNomePetShop
            };
            const resposta = await ApiPetshop.request('/Empresa', 'get', dtoRequisicao);
            setEmpresas(resposta);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
        } finally {
            setLoading(false);
        }
    }

    const irParaAgendamento = (idPetShop) => {
        navigation.navigate('Agendamento', { idEmpresaPetShop: idPetShop });
    };

    useEffect(() => {
        buscarTodasEmpresas();
    }, []);

    return (
        <View style={estilos.container}>
            <View style={estilos.containerBusca}>
                <TextInput
                    id='campoBuscarPorNomePetShop'
                    style={estilos.inputBusca}
                    placeholder="Buscar por nome do pet shop"
                    placeholderTextColor="#aaa"
                    value={campoBuscarPorNomePetShop}
                    onChangeText={(valor) => setCampoBuscarPorNomePetShop(valor)}
                />
                <TouchableOpacity style={estilos.botaoBusca} onPress={() => buscarNaAPIPorNomePetShop()}>
                    <Text style={estilos.textoBotaoBusca}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {/* Categorias */}
            {/* <Text style={estilos.tituloSecao}>Categorias</Text>
            <View style={estilos.containerCategorias}>
                {categorias.map((categoria) => (
                    <View key={categoria.id} style={estilos.itemCategoria}>
                        <Image source={categoria.icone} style={estilos.iconeCategoria} />
                        <Text style={estilos.textoCategoria}>{categoria.nome}</Text>
                    </View>
                ))}
            </View> */}

            {/* Promoções */}
            {/* <Text style={estilos.tituloSecao}>Promoções</Text>
            <View style={estilos.containerPromocoes}>
                <View style={estilos.cartaoPromocao}></View>
                <View style={estilos.cartaoPromocao}></View>
            </View> */}

            {/* Pet Shops Próximos */}
            <Text style={estilos.tituloSecao}>Pet Shops</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#28A745" />
            ) : (
                <FlatList
                    data={empresas}
                    keyExtractor={(item) => item.idEmpresa}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => irParaAgendamento(item.idEmpresa)} // Chama a navegação ao pressionar
                        >
                            <View style={estilos.itemPetShop}>
                                <Image source={item.icone} style={estilos.iconePetShop} />
                                <View>
                                    <Text style={estilos.nomePetShop}>{item.descricaoNomeFisica}</Text>
                                    {/* <Text style={estilos.detalhesPetShop}>
                                    {item.distancia} • {item.avaliacao}⭐
                                </Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />)}


            {/* Menu na parte inferior */}
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
        paddingTop: 50,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 15,
    },
    containerBusca: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    inputBusca: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    botaoBusca: {
        backgroundColor: '#28A745',
        marginLeft: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    textoBotaoBusca: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tituloSecao: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerCategorias: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemCategoria: {
        alignItems: 'center',
    },
    iconeCategoria: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    textoCategoria: {
        fontSize: 12,
        color: '#333',
    },
    containerPromocoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    cartaoPromocao: {
        width: '48%',
        height: 100,
        backgroundColor: '#FFD700',
        borderRadius: 8,
    },
    itemPetShop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    iconePetShop: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    nomePetShop: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detalhesPetShop: {
        fontSize: 14,
        color: '#666',
    },
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: 15,
    },
    menuItem: {
        alignItems: 'center',
    },
    menuTexto: {
        fontSize: 12,
        color: '#333',
        marginTop: 5,
    },
});

export default TelaInicial;
