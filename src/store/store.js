let usuario = null;
let empresa = null;

export const getUsuarioStore = () => usuario;

export const setUsuarioStore = (novoUsuario) => {
    usuario = novoUsuario;
};


export const getEmpresaStore = () => empresa;

export const setEmpresaStore = (novaEmpresa) => {
    empresa = novaEmpresa;
};

