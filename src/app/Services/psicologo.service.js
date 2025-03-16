import { get } from "./apiService";

 
export const getPsicologos = async () => {
    try {
        
        const data = await get( `Psicologo/all?pageNumber=${1}`);
        const result = data ? data : [];
        return result
    }
    catch (ex) {
        rej(ex);
    }
};
 