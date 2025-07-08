import store from '../store/store';
test('store.js deve exportar um objeto', () => {
    expect(typeof store).toBe('object');
});
