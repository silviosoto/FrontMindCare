import React, { useState, useEffect } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Typography, Box, CircularProgress, Grid, InputLabel, Select, MenuItem } from '@mui/material';

import { getListaServiciosPorPsicologo } from '@/app/services/profilePsicology.service';
import { getCitaByPsicologo } from '@/app/services/cita.service';
// import { getCitaByPsicologo } from '@/app/services/cita.service';

const AvailabilityPicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idPsicologo, setidPsicologo] = useState(3);
  const [servicios, setServicios] = useState([]); 
  const [servicioSelected, setservicioSelected] = useState(0);
  
  const GetServiciosPorPsicologo = async (id) => {
    try {
      const data = await getListaServiciosPorPsicologo(id);
      if (data != undefined) {
        setServicios(data ?? []);
      }
    } catch (error) {
      console.log("GetServiciosPorPsicologo", error);
    }
  };

  const getHourAvailable = async (idPsicologo, fecha) => {
    try {
      const data = await getCitaByPsicologo(idPsicologo, fecha);
     
      if (data != undefined) {
        let listaHora = data.map( x=> x.horaInicio)
       
        setAvailableHours(listaHora ?? []);
      }
    } catch (error) {
      console.log("getHourAvailable", error);
    }
  }
  
  const ListSelectServicios =() =>{
    
    let list = servicios.map((a, y) => (
      <MenuItem key={y+1} value={a.id}>
        {a.servicioNombre}
      </MenuItem>
    ));

    list.unshift( 
      <MenuItem key={0} value={0}>
        {"[Seleccione un servicio]"}
      </MenuItem>)

    return list
  }
  
  const GetavailableHourByPsicology = (idPsicologo, date ) =>{
    getHourAvailable(idPsicologo, date);

  }

  const handleSelectChange = (event) => {
    setservicioSelected(event.target.value);
  };

  useEffect(() => { 
    GetServiciosPorPsicologo(idPsicologo);    
  }, []);
    
  // Simulate fetching available hours based on the selected date
  useEffect(() => {
    if (selectedDate) {
      GetavailableHourByPsicology(idPsicologo, selectedDate)
    } else {
      setAvailableHours([]);
    }
  }, [selectedDate]);

  const formatHour = (hour) => {
    if(hour == "") return "";

    let _hour = dayjs(`2000-01-01T${hour}`).format('HH:mm');
    return _hour
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Select a Day and Time
        </Typography>
         <InputLabel id="Servicio-label">Servicio</InputLabel>
            <Select
              labelId="Servicio-label"
              id="servicio"
              name="servicio"
              value={servicioSelected}
              onChange={handleSelectChange}
              label="Servicio"
              defaultValue="0"
            >
            {ListSelectServicios()}
            
            </Select>
        {/* DateCalendar Component */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            minDate={dayjs()} // Restrict to today and future dates
          />
        </Box>

        {/* Display Available Hours */}
        {selectedDate && (
          <Box>
            <Typography variant="h6" gutterBottom align="center">
              Horas disponibles {selectedDate.format('YYYY-MM-DD')}
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : availableHours.length > 0 ? (
              <Grid container spacing={2} justifyContent="center">
                {availableHours.map((hour, index) => (
                  <Grid item key={index}>
                    <Button variant="contained" color="primary">
                      {formatHour(hour)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography align="center">No hay horas disponibles.</Typography>
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AvailabilityPicker;