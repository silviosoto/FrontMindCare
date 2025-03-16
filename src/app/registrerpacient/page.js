"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container, 
  FormHelperText,
  FormControlLabel,
  AppBar,
  Toolbar,
  IconButton, 
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";  
import { RegisterPaciente } from "../Services/registerpacient.service";
import { useSimpleAlert, useConfirmationAlert } from "../hooks/useSwal";
import { useRouter } from 'next/navigation';
import { useCookie } from '../hooks/useCookie.hook';
import { useAppContext } from "../context/context";
// Esquema de validación con Yup
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("La campo es obligatorio")
    .max(500, "La nombre no puede exceder los 500 caracteres"),
  apellidos: Yup.string()
    .required("El campo es obligatorio")
    .max(500, "El campo apellidos no puede exceder los 500 caracteres"),
  fechaNacimiento: Yup.date().required("El campo es obligatorio"),
  email: Yup.string().email().required("El campo es obligatorio"),
  telefono: Yup.number().nullable().required("La campo es obligatorio"), 
  // username: Yup.string().email().required("El campo es obligatorio"),
  password: Yup.string().required("El campo es obligatorio"),
  termsAccepted: Yup.boolean().oneOf(
    [true],
    "Debe aceptar los términos y condiciones"
  )
 
});

const RgistrarForm = () => {

  const { set, remove } = useCookie();
  const confirmationAlert = useConfirmationAlert(); 
  const simpleAlert = useSimpleAlert();
  const { push } = useRouter();
  const {
    setUser
  } = useAppContext(); 

  const datosPersonalesInit = {
    nombre:  "",
    apellidos: "",
    fechaNacimiento: "",
    email: "",
    termsAccepted: false,
    telefono: "",
    user: {
      username:  "",
      password: ""
    }
  };

  const handleEnviar = async (data) => {
  
    const payload =  {
      estado: true,
      datosPersonale: {
        nombre:  data.nombre,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        email: data.email,
        telefono: data.telefono,
        user: {
          username:  data.email,
          password: data.password
        }
      }
    }

    RegisterPaciente(payload)
      .then(async (data) => {
        simpleAlert("Cuenta Creada", "", "success");
        
        set("userid", data?.userId)
        set("username", data?.userName)
        set("profile", data?.profile)
        set("accessToken", data?.accessToken)
        set("refreshToken", data?.refreshToken)
        setUser( { userId: data?.userId, username: data?.username, profile: data?.profile})
        push('Dashboard')
      })
      .catch((e) => {
        console.log("erorr : RegisterPaciente ", e);
        simpleAlert("Algo salió mal",  e, "error");
      });

  };

  const formik = useFormik({
    initialValues: datosPersonalesInit,
    validationSchema: validationSchema,
    onSubmit: (values, resetForm) => {
      console.log("Formulario enviado:", values);
      handleEnviar(values, resetForm);
    },
  });

  useEffect(() => {

  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AppBar position="absolute">
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Mindcare
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ m: 1 }} />
        <Typography component="h1" variant="h5">
          Registrar paciente
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre "
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="apellidos"
                name="apellidos"
                label="Apellidos"
                value={formik.values.apellidos}
                onChange={formik.handleChange}
                error={
                  formik.touched.apellidos && Boolean(formik.errors.apellidos)
                }
                helperText={formik.touched.apellidos && formik.errors.apellidos}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                fullWidth
                id="fechaNacimiento"
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                InputLabelProps={{
                  shrink: true, // Esto hace que el label se mantenga fijo
                }}
                value={formik.values.fechaNacimiento}
                onChange={formik.handleChange}
                error={
                  formik.touched.fechaNacimiento &&
                  Boolean(formik.errors.fechaNacimiento)
                }
                helperText={
                  formik.touched.fechaNacimiento &&
                  formik.errors.fechaNacimiento
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                error={
                  formik.touched.telefono && Boolean(formik.errors.telefono)
                }
                helperText={formik.touched.telefono && formik.errors.telefono}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid> */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
             <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="termsAccepted"
                    name="termsAccepted"
                    color="primary"
                    value={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />
                }
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.8rem', // Tamaño de letra más pequeño
                    color: 'gray',     // Color gris
                  },
                }}
                label="Autorizo el uso de mis datos de acuerdo a la Declaración de privacidad y acepto los Términos y condiciones y la Autorización de tratamiento de datos."
              />
              {formik.touched.termsAccepted && (
                <FormHelperText error>
                  {formik.errors.termsAccepted}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RgistrarForm;
