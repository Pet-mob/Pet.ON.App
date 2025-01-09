import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const petShops = [
    { id: '1', nome: 'PetShop A', distancia: '1.2 km' },
    { id: '2', nome: 'PetShop B', distancia: '2.5 km' },
];

export default function TelaPrincipal({ navigation }) {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => setLocation(position.coords),
                    (error) => console.error(error),
                );
            }
        })();
    }, []);

    const renderPetShop = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Agendamento')}>
            <View style={styles.petShop}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.distancia}>{item.distancia}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={petShops}
                keyExtractor={(item) => item.id}
                renderItem={renderPetShop}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    petShop: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
    nome: { fontSize: 18, fontWeight: 'bold' },
    distancia: { color: '#666' },
});
