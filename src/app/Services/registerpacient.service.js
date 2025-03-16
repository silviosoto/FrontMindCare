import { post } from "./apiService";

 
export const RegisterPaciente = async( payload )  => {
    try {
        return   await  post( `paciente`, payload );  
    }
    catch (ex) {
        throw (ex)
    }
};
