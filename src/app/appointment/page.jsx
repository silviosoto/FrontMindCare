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
  Typography,
  RadioGroup,
  Radio,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  FormControl,
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
import { useSimpleAlert, useConfirmationAlert } from "../hooks/useSwal";
import PayUForm from "../components/pagos";
import { useCookie } from "../hooks/useCookie.hook";
 
const paquetes = [
  {
    id: "premium",
    sesiones: 12,
    descuento: 0.2,
    nombre: "Paquete Premium",
    descripcion: "12 sesiones con 20% de descuento",
    color: "primary",
  },
  {
    id: "estandar",
    sesiones: 8,
    descuento: 0.15,
    nombre: "Paquete Estándar",
    descripcion: "8 sesiones con 15% de descuento",
    color: "secondary",
  },
  {
    id: "basico",
    sesiones: 5,
    descuento: 0.1,
    nombre: "Paquete Básico",
    descripcion: "5 sesiones con 10% de descuento",
    color: "success",
  },
];

const cookieStorage = useCookie();

export default function Appointment() {
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const psicologo = searchParams.get("psicologo");
  const isPackage = searchParams.get("ispackage");
  const active = isPackage === "true";
  const [idPsicologo, setidPsicologo] = useState(psicologo);
  const [servicios, setServicios] = useState([]);
  const [servicioSelected, setservicioSelected] = useState(0);
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [cita, setCita] = useState(null);
  const [valorServicio, setValorServicio] = useState(null);
  const { user } = useAppContext();
  const simpleAlert = useSimpleAlert();

  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id)); // toggle
  };

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

  const stepSchemas = Yup.object({
    idservicio: Yup.number()
      .moreThan(0, "Seleccione un servicio")
      .required("Seleccione un servicio"),
    idpsicologo: Yup.number(),
    hora: Yup.string().required("Seleccione una hora"),
    motivoconsulta: Yup.string().required("Esciba porque desea la consulta"),
  });

  const apartarCita = async (values) => {
    try {
      if (cita != null) return; //ya se creo la cita
      let userid = cookieStorage.get("userid");
      let paciente = await getInfoPaciente(userid);
      console.log({values});
      if (date == "") return;
      if (valorServicio == null) return;

      let sesiones = 1;
      let ispaquete = false;

      if (values.paqueteSeleccionado !== "") {
        const paquete = paquetes.find(
          (p) => p.id === values.paqueteSeleccionado
        );
        if (paquete) {
          ispaquete = true;
          sesiones = paquete.sesiones;
        }
      }

      let servicio = servicios.find((s) => s.id === values.idservicio);

      const payloadCita = {
        idpsicologo: values.idpsicologo,
        idpaciente: paciente.id,
        hora: `${values.hora}:00`, // hora seleccionada
        fecha: date, // del calendario
        motivoconsulta: values.motivoconsulta,
        idservicio: servicio.servicioId,
        valorServicio: valorServicio,
        sesiones: sesiones,
        ispaquete: ispaquete
      };
        
      const data = await createCita(
        parseInt(payloadCita.idpsicologo),
        payloadCita.idpaciente,
        payloadCita.hora,
        payloadCita.fecha,
        payloadCita.motivoconsulta,
        payloadCita.idservicio,
        payloadCita.valorServicio,
        payloadCita.sesiones,
        payloadCita.ispaquete 
      );

      if (data == undefined) {
        setCita(null);
        simpleAlert("Error al crear la cita", "", "error");
        return;
      }

      setCita(data);
      console.log("cita creada", data);
      // simpleAlert("cita creada exitosamente", "", "success");
    } catch (error) {
      console.log("createcita", error);
      simpleAlert("Algo salió mal", "", "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      idservicio: 0,
      idpsicologo: idPsicologo,
      hora: "",
      motivoconsulta: "",
      paqueteSeleccionado: "",
    },
    validateOnChange: false,
    validationSchema: stepSchemas,
    onSubmit: async (values) => {
      await apartarCita(values);
      //avanzar al siguiente paso de la interface
      setActiveStep((prev) => prev + 1);
      return;
    },
  });

  // Handle navigation
  const handleNext = async () => {
    try {
      const errors = await formik.validateForm();
      console.log("errors", errors);
      if (Object.keys(errors).length > 0) {
        await formik.submitForm();
        return;
      }
      await formik.submitForm();
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

 
  const getInfoPaciente = async (id) => {
    try {
      if (user == null) return;

      const data = await getPaciente(id);
      if (data == undefined) {
        return null;
      }
      const { paciente } = data;
      setPaciente(paciente);
      return paciente;
    } catch (error) {
      console.log("getPaciente", error);
    }
  };

  useEffect(() => {
    GetServiciosPorPsicologo(idPsicologo);
  }, []);

  useEffect(() => {
    formik.setFieldValue("hora", hour);
  }, [hour]);

  const calcularPrecio = (paquete) => {
    const precioSinDescuento = paquete.sesiones * valorServicio;
    const descuento = precioSinDescuento * paquete.descuento;
    const precioFinal = precioSinDescuento - descuento;

    return {
      precioSinDescuento,
      descuento,
      precioFinal,
      precioPorSesion: precioFinal / paquete.sesiones,
    };
  };
 

  useEffect(() => {
    const idservicio = formik.values.idservicio || 0;
    const servicio = servicios.find((s) => s.id === idservicio);
    const value = servicio ? servicio.valor : 0;

    setValorServicio(value);
    
  }, [formik.values.idservicio]);

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
        <Grid container>
          {activeStep === 0 && (
            <>
              <Grid size={{ xs: 4, md: 4 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <InputLabel id="Servicio-label">Servicio</InputLabel>
                    <Select
                      fullWidth
                      labelId="Servicio-label"
                      name="idservicio"
                      label="Servicio"
                      value={formik.values.idservicio}
                      onChange={formik.handleChange}
                      renderValue={(selected) => {
                        if (!selected) return "Selecciona un servicio";
                        const servicio = servicios.find(
                          (s) => s.id === selected
                        );
                        return servicio
                          ? `${servicio.servicioNombre} - $${servicio.valor}`
                          : "";
                      }}
                    >
                      <MenuItem key={0} value={0}>
                        <em>Selecciona un servicio</em>
                      </MenuItem>
                      {servicios.map((servicio) => (
                        <MenuItem key={servicio.id} value={servicio.id}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body1">
                              {servicio.servicioNombre}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary"
                              fontWeight="bold"
                            >
                              ${servicio.valor}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.idservicio && (
                      <FormHelperText error>
                        {formik.errors.idservicio}
                      </FormHelperText>
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
                      error={
                        formik.touched.motivoconsulta &&
                        Boolean(formik.errors.motivoconsulta)
                      }
                      helperText={
                        formik.touched.motivoconsulta &&
                        formik.errors.motivoconsulta
                      }
                    />
                  </Grid>

                  { active && <Grid size={12}  >
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        name="paqueteSeleccionado"
                        value={formik.values.paqueteSeleccionado}
                        onChange={formik.handleChange}
                      >
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {paquetes.map((paquete) => {
                            const calculo = calcularPrecio(paquete);
                            const estaSeleccionado =
                              formik.values.paqueteSeleccionado === paquete.id;

                            return (
                              <Grid   xs={12} sm={4} key={paquete.id}>
                                <Card
                                  sx={{
                                    border: estaSeleccionado ? 2 : 1,
                                    borderColor: estaSeleccionado
                                      ? "primary.main"
                                      : "grey.200",
                                    bgcolor: estaSeleccionado
                                      ? "primary.50"
                                      : "background.paper",
                                    cursor: "pointer",
                                    height: "100%",
                                    minHeight: 180,
                                    "&:hover": {
                                      borderColor: "primary.main",
                                    },
                                  }}
                                  onClick={() =>
                                    formik.setFieldValue(
                                      "paqueteSeleccionado",
                                      paquete.id
                                    )
                                  }
                                >
                                  <CardContent
                                    sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                                  >
                                    <Box
                                      display="flex"
                                      alignItems="flex-start"
                                      justifyContent="space-between"
                                    >
                                      <Box flexGrow={1}>
                                        <Typography
                                          variant="subtitle2"
                                          component="h3"
                                          fontWeight="bold"
                                        >
                                          {paquete.nombre}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {paquete.descripcion}
                                        </Typography>
                                      </Box>
                                      <FormControlLabel
                                        value={paquete.id}
                                        control={
                                          <Radio
                                            size="small"
                                            sx={{ py: 0, my: 0 }}
                                          />
                                        }
                                        label=""
                                        sx={{ m: 0, mr: -0.5 }}
                                      />
                                    </Box>

                                    <Chip
                                      label={`-${paquete.descuento * 100}%`}
                                      color={paquete.color}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        mt: 0.5,
                                        mb: 1,
                                      }}
                                    />

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ textAlign: "center" }}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textDecoration: "line-through" }}
                                      >
                                        ${calculo.precioSinDescuento}
                                      </Typography>

                                      <Typography
                                        variant="h6"
                                        color="primary"
                                        fontWeight="bold"
                                      >
                                        ${calculo.precioFinal.toFixed(0)}
                                      </Typography>

                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        ${calculo.precioPorSesion.toFixed(0)}
                                        /sesión
                                      </Typography>
                                    </Box>

                                    <Typography
                                      variant="caption"
                                      color="success.main"
                                      display="block"
                                      textAlign="center"
                                      mt={0.5}
                                    >
                                      Ahorras ${calculo.descuento.toFixed(0)}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>}
                </Grid>
              </Grid>

              <Grid size={{ xs: 8, md: 8 }}>
                <AvailabilityPicker
                  getHour={setHour}
                  getDate={setDate}
                  defaultvalue={hour}
                  psicologoid={3}
                />
                {formik.touched.hora && (
                  <FormHelperText error>{formik.errors.hora}</FormHelperText>
                )}
              </Grid>
            </>
          )}

          {activeStep === 1 && cita != null && valorServicio != null && (
            <>
              <PayUForm
                amount={valorServicio}
                referenceCode={`CodReferencia_${cita.id}`}
              ></PayUForm>
            </>
          )}
        </Grid>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {activeStep > 1 && (
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep < 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <></>
            // <Button type="submit" variant="contained" color="primary">
            //   pagar
            // </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
