import { get, post, del, put } from "./apiService";

export const getCitaByPsicologo = async(idPsicologo, fecha) => {
    try {
        console.log("fecha", "here")
        const data = await get(`cita?idPsicologo=${idPsicologo}&fecha=${fecha}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        reject(ex);
        console.log(ex)
    }
};
 