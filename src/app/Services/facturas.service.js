import { get,getCustom, post, del, put } from "./apiService";

  

export const getFactruasPaginado = async( page, rowsPerPage = 10) => {
    try {
        const data = await get(`factura?page=${page}&pageSize=${rowsPerPage}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        console.log(ex)
    }
};
 
export const getFacturasbyPaciente = async( idPaciente , page, rowsPerPage = 10) => {
    try {
        const data = await get(`factura/GetPagosbyPaciente?idpaciente=${idPaciente}&page=${page}&pageSize=${rowsPerPage}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        console.log(ex)
    }
};

export const downLoadFactura = async( IdFactura) => {
    try {
        const data = await getCustom(`factura/Download/${IdFactura}`);
        return data
    }
    catch (ex) {
        console.log(ex)
    }
};