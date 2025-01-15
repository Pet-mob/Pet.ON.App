import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
} from 'react-native';

const TelaInicial = () => {
    // Dados simulados para categorias e pet shops
    const categorias = [
        { id: '1', nome: 'Banho e Tosa', icone: require('../../assets/adaptive-icon.png') },
        { id: '2', nome: 'Veterinário', icone: require('../../assets/adaptive-icon.png') },
        { id: '3', nome: 'Acessórios', icone: require('../../assets/adaptive-icon.png') },
        { id: '4', nome: 'Rações', icone: require('../../assets/adaptive-icon.png') },
    ];

    const petShops = [
        {
            id: '1',
            nome: 'PetShop Feliz',
            distancia: '1.5 km',
            avaliacao: '4.8',
            icone: require('../../assets/icon.png'),
        },
        {
            id: '2',
            nome: 'Amigos do Pet',
            distancia: '2.0 km',
            avaliacao: '4.7',
            icone: require('../../assets/icon.png'),
        },
        {
            id: '3',
            nome: 'Banho & Brilho',
            distancia: '3.2 km',
            avaliacao: '4.6',
            icone: require('../../assets/icon.png'),
        },
    ];

    return (
        <View style={estilos.container}>
            {/* Campo de busca */}
            <View style={estilos.containerBusca}>
                <TextInput
                    style={estilos.inputBusca}
                    placeholder="Buscar serviços ou pet shops"
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity style={estilos.botaoBusca}>
                    <Text style={estilos.textoBotaoBusca}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {/* Categorias */}
            <Text style={estilos.tituloSecao}>Categorias</Text>
            <View style={estilos.containerCategorias}>
                {categorias.map((categoria) => (
                    <View key={categoria.id} style={estilos.itemCategoria}>
                        <Image source={categoria.icone} style={estilos.iconeCategoria} />
                        <Text style={estilos.textoCategoria}>{categoria.nome}</Text>
                    </View>
                ))}
            </View>

            {/* Promoções */}
            <Text style={estilos.tituloSecao}>Promoções</Text>
            <View style={estilos.containerPromocoes}>
                <View style={estilos.cartaoPromocao}></View>
                <View style={estilos.cartaoPromocao}></View>
            </View>

            {/* Pet Shops Próximos */}
            <Text style={estilos.tituloSecao}>Pet Shops Próximos</Text>
            <FlatList
                data={petShops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={estilos.itemPetShop}>
                        <Image source={item.icone} style={estilos.iconePetShop} />
                        <View>
                            <Text style={estilos.nomePetShop}>{item.nome}</Text>
                            <Text style={estilos.detalhesPetShop}>
                                {item.distancia} • {item.avaliacao}⭐
                            </Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default TelaInicial;
