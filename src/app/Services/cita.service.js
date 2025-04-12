import { get, post, del, put } from "./apiService";

export const getCitaByPsicologo = async(idPsicologo, fecha) => {
    try {
        const data = await get(`cita?idPsicologo=${idPsicologo}&fecha=${fecha}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        reject(ex);
        console.log(ex)
    }
};
 
export const createCita = async (idpsicologo, idpaciente, hora, fecha, motivoConsulta ) =>{
    try {
        const data = await post(`cita`, {
            idpsicologo: idpsicologo,
            idpaciente: idpaciente,
            hora: hora,
            fecha: fecha,
            motivoConsulta: motivoConsulta
        });
        
        const result = data ? data : null;
        return result

    } catch (error) {
        console.log(error);
    }
}

export const getCitasByPaciente= async(idPaciente) => {
    try {
        const data = await get(`cita/GetAppointmentByPatient/${idPaciente}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        reject(ex);
        console.log(ex)
    }
};

export const CancelAppointment= async(idCita) => {
    try {
        const data = await get(`cita/cancelar/${idCita}`);

        const result = data ? data : [];
        return result
    }
    catch (ex) {
        // reject(ex);
        console.log(ex)
    }
};