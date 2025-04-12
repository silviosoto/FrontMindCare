"use client";
import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";
import AvailabilityPicker from "../components/AvailabilityPicker.component";
import Grid from "@mui/material/Grid2";
import { getListaServiciosPorPsicologo } from "@/app/services/profilePsicology.service";
import { useAppContext } from "../context/context";
import { createCita } from "../Services/cita.service";
import { getPaciente } from "../Services/Paciente.service";

export default function Appointment() {
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const psicologo = searchParams.get("psicologo");
  const age = searchParams.get("age");
  const [idPsicologo, setidPsicologo] = useState(psicologo);
  const [servicios, setServicios] = useState([]);
  const [servicioSelected, setservicioSelected] = useState(0);
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [paciente, setPaciente] = useState(null);
  const { user } = useAppContext();

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

  // Validation schemas
  const stepSchemas =Yup.object({
    idservicio: Yup.number()
    .moreThan(0, "Seleccione un servicio")
    .required("Seleccione un servicio"),
    idpsicologo: Yup.number(),
    hora: Yup.string().required("Seleccione una hora"),
    motivoconsulta: Yup.string().required("Esciba porque desea la consulta"),
  });

  const apartarCita = async (values) => {
    try {
      
      if (paciente == null) return
      if (date == "") return
      
      const cita ={
        idpsicologo: values.idpsicologo,
        idpaciente: paciente.id , 
        hora: `${values.hora}:00`, // hora seleccionada
        fecha: date, // del calendario
        motivoconsulta: values.motivoconsulta
      }
      
      const data = await createCita(
        parseInt(cita.idpsicologo),
        cita.idpaciente,
        cita.hora,
        cita.fecha,
        cita.motivoconsulta
      );

      if (data != null) {
        console.log("createcita", data);
      }
    } catch (error) {
      console.log("createcita", error);
    }
  }

  // Formik setup
  const formik = useFormik({
    initialValues: {
      idservicio: 0,
      idpsicologo: idPsicologo,
      hora: "",
      motivoconsulta: "",
    },
    validateOnChange: false,
    validationSchema: stepSchemas,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // console.log(JSON.stringify(values, null, 2));
      //apartar la cita
     
      apartarCita(values);
      return 
      
    },
  });

  // Handle navigation
  const handleNext = async () => {
    const errors = await formik.validateForm();
     
    if ( Object.keys(errors).length == 0 ) {
      setActiveStep((prev) => prev + 1);
    }else{
      formik.submitForm();
    }
  
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const ListSelectServicios = () => {
    let list = servicios.map((a, y) => (
      <MenuItem key={y + 1} value={a.id}>
        {a.servicioNombre}
      </MenuItem>
    ));

    list.unshift(
      <MenuItem key={0} value={0}>
        {"[Seleccione un servicio]"}
      </MenuItem>
    );

    return list;
  };
 
  const getInfoPaciente = async (id) => {
    try {
      if (user == null) return

      const data = await getPaciente(id);
     if (data != undefined) {
        const {paciente} = data;
        setPaciente(paciente);
     }
      
    } catch (error) {
      console.log("getPaciente", error);
    }
  };

  useEffect(() => {
    console.log("USER", user);
    GetServiciosPorPsicologo(idPsicologo);
  }, []);

  useEffect(() => {
    getInfoPaciente(user.userid);
  }, [user]);
    
  useEffect(()=>{
    formik.setFieldValue("hora", hour);
    //lueg  validar hora poniendo el componente en rojo cuando no se ha seleccionado
    
  }, [hour])

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 4 }} spacing={2}>
      {/* Stepper Navigation */}
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Agendar</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pago</StepLabel>
        </Step>
        <Step>
          <StepLabel>Fin</StepLabel>
        </Step>
      </Stepper>
 
      <Box sx={{ mt: 4 }} component="form" onSubmit={formik.handleSubmit}>
      {/* onSubmit={formik.handleSubmit} */}
      
          <Grid container>
            {activeStep === 0 && (
              <>
                <Grid
                  size={{ xs: 4, md: 4 }}
                >
                  <Grid container spacing={2} >
                    <Grid size={12}>
                      <InputLabel id="Servicio-label">Servicio</InputLabel>
                      <Select
                        fullWidth
                        labelId="Servicio-label"
                        // id="idservicio"
                        name="idservicio"
                        label="Servicio"
                        // defaultValue="0"
                        value={formik.values.idservicio}
                        onChange={formik.handleChange}
                      >
                        {ListSelectServicios()}
                      </Select>
                      {formik.touched.idservicio && (
                        <FormHelperText error >{formik.errors.idservicio}</FormHelperText>
                      )}
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        name="motivoconsulta"
                        label="Motivo de consulta"
                        multiline
                        rows={4}
                        value={formik.values.motivoconsulta}
                        onChange={formik.handleChange}
                        error={formik.touched.motivoconsulta && Boolean(formik.errors.motivoconsulta)}
                        helperText={formik.touched.motivoconsulta && formik.errors.motivoconsulta}
                      />
                    </Grid>
                  
                  </Grid>
                </Grid>

                <Grid   size={{ xs: 8, md: 8 }}>
                  <AvailabilityPicker 
                    getHour={setHour}
                    getDate={setDate}
                    defaultvalue={hour} 
                    psicologoid={3} />

                  {formik.touched.hora && (
                        <FormHelperText error>{formik.errors.hora}</FormHelperText>
                      )}
                </Grid>
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  margin="normal"
                />
              </>
            )}
          </Grid>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep < 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Siguiente
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            )}
          </Box>
        
      </Box>
    </Box>
  );
}
