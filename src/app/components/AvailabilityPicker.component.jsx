import React, { useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { getListaServiciosPorPsicologo } from "@/app/services/profilePsicology.service";
import { getCitaByPsicologo } from "@/app/services/cita.service";


const AvailabilityPicker = ({ getHour, getDate, defaultvalue, psicologoid} ) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selected, setSelected] = useState(defaultvalue);
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idPsicologo, setidPsicologo] = useState(psicologoid);

  const getHourAvailable = async (idPsicologo, fecha) => {
    try {
      const data = await getCitaByPsicologo(idPsicologo, fecha);

      if (data != undefined) {
        let horaActual = dayjs().format("HH:mm"); 
        let listaHora = data.map((x) => x.horaInicio );

        setAvailableHours(listaHora ?? []);
      }
    } catch (error) {
      console.log("getHourAvailable", error);
    }
  };

  const GetavailableHourByPsicology = (idPsicologo, date) => {
    getHourAvailable(idPsicologo, date);
  };

  useEffect(() => {
    if (selectedDate) {
      GetavailableHourByPsicology(idPsicologo, selectedDate);
    } else {
      setAvailableHours([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log("idPsicologo", psicologoid);
  }, []);

  const formatHour = (hour) => {
    if (hour == "") return "";

    let _hour = dayjs(`2000-01-01T${hour}`).format("HH:mm");
    return _hour;
  };

  const handleSelection = (option) => {
    setSelected(option);
    getDate(selectedDate.format("YYYY-MM-DD"));
    getHour(formatHour(option))
  };
 const disablecheck= (hour) => {
  const date = selectedDate.format("YYYY-MM-DD");
  const  currentDate = dayjs().format("YYYY-MM-DD");
  if (date == currentDate ) {
    const currentHour = dayjs().format("HH:mm");
    console.log("currentDate", hour , currentHour, hour > currentHour);
    return  currentHour > hour ; // Compare the hour with the current hour
  }
  return false; // For future dates, all hours are available
 } 
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="body1" gutterBottom align="center">
          Seleccionar fecha y hora
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            minDate={dayjs()} // Restrict to today and future dates
          />
        </Box>

        {selectedDate && (
          <Box>
            <Typography variant="body1" sx={{mb: 3}} gutterBottom align="center">
              Horas disponibles del dia {selectedDate.format("YYYY-MM-DD")}
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : availableHours.length > 0 ? (
              <Grid container spacing={2} justifyContent="center">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selected}
                    onChange={(e) => handleSelection(formatHour(e.target.value))}
                  >
                    <Grid container spacing={0}>
                      {availableHours.map((option, index) => (
                        <Grid item xs={4} key={index}>
                          <Box
                            onClick={() => handleSelection(formatHour(option))}
                            sx={{
                              boxShadow: 3,
                              border:
                              selected === option
                                  ? "2px solid blue"
                                  : "2px solid white",
                              transition: "0.3s",
                              mt: 0.5,
                              p: 0.5,
                              borderRadius: 2,
                              maxWidth: 100,
                              cursor: "pointer"
                            }}
                          >
                            <FormControlLabel
                              value={formatHour(option)}
                              control={<Radio size="small"  disabled ={disablecheck(option)} />} // Hace el radio más pequeño
                              label={
                                <Typography variant="body2">
                                  {formatHour(option)}
                                </Typography>
                              } // Reduce la fuente
                              sx={{ width: "100%" }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
            ) : (
              <Typography align="center">No hay horas disponibles. </Typography>
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AvailabilityPicker;
