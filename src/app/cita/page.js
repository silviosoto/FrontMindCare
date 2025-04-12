"use client";
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Grid, 
  Avatar,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
  Edit,
  Delete,
  VideoCall,
  FileCopy
} from '@mui/icons-material';
import dayjs from "dayjs";
import { getCitasByPaciente, CancelAppointment } from '../Services/cita.service';
import 'dayjs/locale/es';
import {
  useSimpleAlert,
  useConfirmationAlert
} from "../hooks/useSwal";


const CitasList = () => {

    const [citas, setCitas] = useState([]);
    const simpleAlert = useSimpleAlert();
    const confirmationAlert = useConfirmationAlert();
    const formatDate = (dateString) => {
        dayjs.locale('es')
       return  dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
    }

    const convertirHora = (hora24) => {
        const [hora, minutos, segundos] = hora24.split(":"); // Divide la hora
        const periodo = hora >= 12 ? "PM" : "AM"; // Determina si es AM o PM
        const hora12 = hora % 12 || 12; // Convierte a formato de 12 horas, manejando el caso de las 12
        return `${hora12}:${minutos} ${periodo}`; // Devuelve la hora en formato deseado
      };
    const fetchCitas = async () => {
        try{
            const citas = await getCitasByPaciente(8);  
            setCitas(citas);
        }catch (error) {
          simpleAlert("Algo salió mal", "", "error");
        } 
    };

    const cancelarCita = async ( idCita ) => {
      try{
        const confirmed = await confirmationAlert(
          "¿Estás seguro?",
          "¿Quieres cancelar la cita?",
          "Sí, continuar",
          "Cancelar"
        );
        if (!confirmed) return;   

        const citas = await CancelAppointment(idCita);  

        if(citas){
          simpleAlert("cancelada exitosamente", "", "success");
        }else{
          simpleAlert("No se pudo cancelar la cita", "", "error");
        }

        fetchCitas(); 

      }catch (error) {
        simpleAlert("Algo salió mal", "", "error");
      } 
  };

  useEffect(() => {
      fetchCitas();
  }, []);

  return (
    <Grid container spacing={3}>
      {citas.map((cita, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
              <Avatar 
                src={cita.imagePerfil} 
                alt={`${cita.nombre} ${cita.apellidos}`}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <div>
                <Typography variant="h6" component="div">
                  Dr. {cita.nombre} {cita.apellidos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Psicologo
                </Typography>
              </div>
            </CardContent>
            
            <Divider />
            
            {/* Detalles de la cita */}
            <CardContent sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <CalendarToday color="primary" fontSize="small" />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">{formatDate(cita.fecha)}</Typography>
                </Grid>
                
                <Grid item xs={2}>
                  <AccessTime color="primary" fontSize="small" />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">{convertirHora(cita.hora)}</Typography>
                </Grid>
                
                <Grid item xs={2}>
                  <LocationOn color="primary" fontSize="small" />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">Virtual</Typography>
                </Grid>
                
                <Grid item xs={2}>
                  <Person color="primary" fontSize="small" />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">{cita.motivoConsulta}</Typography>
                </Grid>
              </Grid>
              
              {cita.estado && (
                <Chip 
                  label={cita.estadoString} 
                  color={
                    cita.estadoString === 'Confirmada' ? 'success' : 
                    cita.estadoString === 'Libre' ? 'warning' : 
                    'error'
                  } 
                  size="small" 
                  sx={{ mt: 2 }}
                />
              )}
            </CardContent>
            
            {/* Acciones */}
            <CardContent sx={{ pt: 0, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <IconButton aria-label="editar" color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </div>
              
              <div>
                {true && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    startIcon={<VideoCall />}
                    sx={{ mr: 1 }}
                  >
                    Unirse
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<Delete />}
                  onClick={() => cancelarCita(cita.id)}
                  disabled ={cita.estadoString === 'Cancelada'}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

 
export default CitasList;