import axios from 'axios'


const URL_API_PRODUCTOS = 'https://6ad0e127addc5b5cb142759f.mockapi.io/productos/'


// ---------------- crud: cRud : READ (http get) ---------------
export async function obtener() {
    try {
    const { data: productosLeidos } = await axios.get(URL_API_PRODUCTOS)
    return productosLeidos
    }

    catch(error) {
        console.error('ERROR GET AXIOS', error.message)
        return[]
    }
}

// ---------------- crud: Crud : CREAT (http post)---------------
export async function guardar(producto) {
    try {
    const { data: productoGuardado } = await axios.post(URL_API_PRODUCTOS, producto)
    return productoGuardado
    }

    catch(error) {
        console.error('ERROR POST AXIOS', error.message)
        return{}
    }
    
}


// ---------------- crud: crUd : UPDATE (http put) ---------------
export async function actualizar(id, producto) {
    try {
    const { data: productoActualizado } = await axios.put(URL_API_PRODUCTO+id, producto)
    return productoActualizado
    }

    catch(error) {
        console.error('ERROR PUT AXIOS', error.message)
        return{}
    }
}


// ---------------- crud: cruD : DELETE (http delete) ---------------
export async function borrar(id) {
    try {
    const { data: productoEliminado } = await axios.delete(URL_API_PRODUCTO+id)
    return productoEliminado
    }

    catch(error) {
        console.error('ERROR DELETE AXIOS', error.message)
        return{}
    }
    
}