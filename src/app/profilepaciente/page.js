"use client";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Toolbar,
  IconButton,
  Avatar,
  AppBar,
  Chip,
  Stack,
} from "@mui/material";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  getDepatamentos,
  getMunicipios,
  getIdiomas,
  getPaciente,
  getMunicipioById,
  registerHobbies,
  getHobbiesbyUser,
  deleteHobbies,
  updatePacient,
  updateImagePacient
} from "../Services/Paciente.service";
import { postcustom } from "../Services/apiService";
import moment from "moment";
import { useAppContext } from "../context/context";
import Image from "next/image";
import { useSimpleAlert } from "../hooks/useSwal";

// Esquema de validación con Yup
const validationSchema = Yup.object({
  nombre: Yup.string().required("La campo es obligatorio"),

  apellidos: Yup.string()
    .required("El campo es obligatorio")
    .max(500, "El campo apellidos no puede exceder los 500 caracteres"),
});

const validationSchemaImage = Yup.object({
  // image: Yup.mixed().required("Profile image is required"),
});

// const validationSchema = Yup.object({
//   nombre: Yup.string()
//     .required("La campo es obligatorio")
//     .max(500, "La nombre no puede exceder los 500 caracteres"),
//   apellidos: Yup.string()
//     .required("El campo es obligatorio")
//     .max(500, "El campo apellidos no puede exceder los 500 caracteres"),
//   fechaNacimiento: Yup.date().required("El campo es obligatorio"),
//   email: Yup.string().email().required("El campo es obligatorio"),
//   telefono: Yup.number().nullable().required("La campo es obligatorio"),
//   descripcion: Yup.string().required("El campo es obligatorio"),
//   numeroId: Yup.number().required("La campo es obligatorio"),
//   experiencia: Yup.number().required("La campo es obligatorio"),
//   departamento: Yup.string().required("El campo es obligatorio"),
//   ciudad: Yup.string().required("El campo es obligatorio"),
//   descripcion: Yup.string().required("El campo es obligatorio"),
//   psicologoIdiomas: Yup.array()
//     .min(1, "Debe seleccionar al menos una idioma")
//     .required("El campo es obligatorio")
// });

const RgistrarForm = () => {
  const imageProfile = "/images/ProfileImage.png";
  const { user } = useAppContext();
  const [selectDepartamentos, setSelectDepartamentos] = useState([]);
  const [selectIdiomas, setselectIdiomas] = useState([]);
  const [selectMunicipios, setSelectMunicipios] = useState([]);
  const [preview, setPreview] = useState(imageProfile);
  const [PacienteId, setPacienteId] = useState(null);
  const [imagePerfil, setImagePerfil] = useState(imageProfile);
  const simpleAlert = useSimpleAlert();

  const datosPersonalesInit = {
    id: 0,
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    numeroId: "",
    email: "",
    departamento: "",
    ciudad: "",
    psicologoIdiomas: [],
  };

  const handleEnviar = async (data, { resetForm }) => {
    try {
      let datosPersonale = {
        id: data.idDatosPersonales,
        nombre: data.nombre,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        email: data.email,
        telefono: data.telefono,
        tipoId: "1",
        numeroId: data.numeroId,
        municipiosId: data.ciudad,
      };

      let payload = {
        estado: true,
        datosPersonale: datosPersonale,
      };

      updatePacient(data.id, payload)
        .then((data) => {
          Swal.fire({
            title: "Registro guardado",
            icon: "success",
          });
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: e,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: datosPersonalesInit,
    validationSchema: validationSchema,
    onSubmit: (values, resetForm) => {
      console.log("Formulario enviado:", values);
      handleEnviar(values, resetForm);
    },
  });

  const GetDepartamentos = async () => {
    try {
      getDepatamentos().then((data) => {
        let departamentos = [];
        if (data != undefined) {
          departamentos = data;
        }

        let selectDepartamentos = departamentos.map((a, y) => (
          <MenuItem key={y} value={a.id}>
            {a.nombre}
          </MenuItem>
        ));

        setSelectDepartamentos(selectDepartamentos);
      });
    } catch (error) {}
  };

  const GetDepartamentoBymunicipio = async (idMunicipio) => {
    try {
      const result = await getMunicipioById(idMunicipio);
      return result?.departamentoId;
    } catch (error) {
      console.log(error);
    }
  };

  const GetIdiomasPsicologo = () => {
    getIdiomas()
      .then((data) => {
        let servicios = [];
        if (data != undefined) {
          servicios = data;
        }

        let Idiomas = servicios.map((a, y) => (
          <MenuItem key={y} value={a.id}>
            {a.nombre}
          </MenuItem>
        ));

        setselectIdiomas(Idiomas);
      })
      .catch((e) => {});
  };

  const handleSelectChange = (event) => {
    // Actualiza el estado con el nuevo valor seleccionado
    formik.values.departamento = event.target.value;
    getMunicipios(event.target.value)
      .then((data) => {
        let municipios = [];
        if (data != undefined) {
          municipios = data;
        }

        let selectMunicipios = municipios.map((a, y) => (
          <MenuItem key={y} value={a.id}>
            {a.nombre}
          </MenuItem>
        ));

        setSelectMunicipios(selectMunicipios);
      })
      .catch((e) => {});
  };

  const GetPaciente = async () => {
    if (user == null) return;

    try {
      const data = await getPaciente(user.userid);
      var paciente = data.paciente;
      // console.log("paciente", paciente)
      const imageBlob = `data:image/jpeg;base64,${data.imageBase64}`;
      setPreview(imageBlob);

      if (paciente != undefined) {
        let municipiosId = paciente.datosPersonale.municipiosId ?? null;
        let departamentoId = await GetDepartamentoBymunicipio(municipiosId);
        // console.log("municipiosId", municipiosId)

        if (departamentoId != null) {
          console.log("departamentoId", departamentoId);
          getMunicipios(departamentoId)
            .then((data) => {
              let municipios = [];
              if (data != undefined) {
                municipios = data;
              }

              let selectMunicipios = municipios.map((a, y) => (
                <MenuItem key={y} value={a.id}>
                  {a.nombre}
                </MenuItem>
              ));

              setSelectMunicipios(selectMunicipios);
            })
            .catch((e) => {});
        }
        
        formik.setValues({
          id: paciente.id,
          estado: paciente.estado,
          idDatosPersonales: paciente.idDatosPersonales,
          nombre: paciente.datosPersonale.nombre,
          apellidos: paciente.datosPersonale.apellidos,
          fechaNacimiento: moment(
            paciente.datosPersonale.fechaNacimiento
          ).format("YYYY-MM-DD"),
          email: paciente.datosPersonale.email,
          telefono: paciente.datosPersonale.telefono,
          tipoId: paciente.datosPersonale.tipoId,
          numeroId: paciente.datosPersonale.numeroId,
          departamento: departamentoId,
          ciudad: paciente.datosPersonale.municipiosId,
          direccion: paciente.direccion,
          psicologoIdiomas: [1],
        });
        if (municipiosId == null) {
          GetDepartamentos();
        }
        setPacienteId(paciente.id);
      }
    } catch (error) {
      console.log("GetPaciente", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(imageProfile);
    }
  };

  const [hobbies, setHobbies] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddHobby = async (event) => {
    if (inputValue.trim() !== "" && !hobbies.includes(inputValue.trim())) {
      if (user == null) return;

      let payload = {
        idUser: user.userid,
        nombre: inputValue,
        estado: true,
      };

      registerHobbies(payload)
        .then(async (data) => {
          await GetHobiesPorPsicologo();
          simpleAlert("Registro actualizado", "", "success");
        })
        .catch((e) => {
          simpleAlert("Algo salió mal", "", "error");
        });
      setInputValue("");
    }
  };

  const GetHobiesPorPsicologo = async () => {
    try {
      const data = await getHobbiesbyUser(user.userid);
      if (data != undefined) {
        let listHobbies = data.map((hobbie) => ({
          // ...hobbie,
          name: hobbie.nombre,
          id: hobbie.id,
        }));

        setHobbies(listHobbies);
      }
    } catch (error) {
      console.log("GetHobiesPorPsicologo", error);
    }
  };

  const handleDeleteHobby = async (hobbyToDelete) => {
    // console.log("HandleDeleteHobby",hobbyToDelete);
    await DeleteHobbies(hobbyToDelete.id);
    setHobbies(hobbies.filter((hobby) => hobby !== hobbyToDelete));
  };

  const DeleteHobbies = async (id) => {
    await deleteHobbies(id)
      .then(async () => {
        await GetHobiesPorPsicologo();
        simpleAlert("Registro eliminado", "", "success");
      })
      .catch((e) => {
        simpleAlert("Algo salió mal", "", "error");
      });
  };

  const EnviarImagen = async (values, { setSubmitting, resetForm }) => {
    
    try {
      const formData = new FormData();
      formData.append("image", values.image);
      const data = await updateImagePacient(PacienteId, formData); 
      simpleAlert("Guardado con exito", "", "success");
      resetForm();
    } catch (error) {
      simpleAlert("Algo salió mal", "", "error");
    }finally {
      setSubmitting(false);
    } 
 
  };

  useEffect(() => {
    GetPaciente();
    GetDepartamentos();
    GetIdiomasPsicologo();
    GetHobiesPorPsicologo();
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
          Perfil
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Formik
              initialValues={{ image: "" }}
              validationSchema={validationSchemaImage}
              onSubmit={ EnviarImagen}
            >
              {({ setFieldValue, isSubmitting, values}) => (
                <Form>
                  <Box sx={{ mb: 2 }}>
                    {preview && (
                      <Avatar
                        src={preview}
                        alt="Vista previa"
                        sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                      />
                    )}
                    <Button variant="contained" component="label" fullWidth>
                      Foto
                      <input
                        type="file"
                        hidden
                        src={imagePerfil}
                        accept="image/*"
                        id="image"
                        name="image"
                        onChange={(event) => {
                          setFieldValue("image", event.currentTarget.files[0]);
                          handleFileChange(event);

                        }}
                      />
                    </Button>

                    <Grid item xs={12}  sx={{ mt: 2 }}>
                      {(values.image ) && (<Button 
                        fullWidth
                        disabled={!values.image  || isSubmitting }
                        type="submit" 
                        variant="contained" 
                        color="primary">
                        enviar
                      </Button>
                    )  }
                   </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
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
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="numeroId"
                name="numeroId"
                label="Identificacion"
                value={formik.values.numeroId}
                onChange={formik.handleChange}
                error={
                  formik.touched.numeroId && Boolean(formik.errors.numeroId)
                }
                helperText={formik.touched.numeroId && formik.errors.numeroId}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.departamento &&
                  Boolean(formik.errors.departamento)
                }
              >
                <InputLabel id="departamento-label">Departamento</InputLabel>
                <Select
                  labelId="departamento-label"
                  id="departamento"
                  name="departamento"
                  value={formik.values.departamento}
                  // onChange={formik.handleChange}
                  onChange={handleSelectChange}
                  label="Departamento"
                  defaultValue=""
                >
                  {selectDepartamentos}
                </Select>
                {formik.touched.departamento && (
                  <FormHelperText>{formik.errors.departamento}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl
                fullWidth
                error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
              >
                <InputLabel id="ciudad-label">Municipio</InputLabel>
                <Select
                  labelId="ciudad-label"
                  id="ciudad"
                  name="ciudad"
                  value={formik.values.ciudad}
                  onChange={formik.handleChange}
                  label="Ciudad"
                  defaultValue=""
                >
                  {selectMunicipios}
                </Select>
                {formik.touched.ciudad && (
                  <FormHelperText>{formik.errors.ciudad}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.psicologoIdiomas &&
                  Boolean(formik.errors.psicologoIdiomas)
                }
              >
                <InputLabel id="Idiomas-label">Idiomas</InputLabel>
                <Select
                  labelId="Idiomas-label"
                  id="psicologoIdiomas"
                  name="psicologoIdiomas"
                  value={formik.values.psicologoIdiomas}
                  onChange={formik.handleChange}
                  label="Idiomas"
                  multiple
                  defaultValue=""
                >
                  {selectIdiomas}
                </Select>
                {formik.touched.psicologoIdiomas && (
                  <FormHelperText>
                    {formik.errors.psicologoIdiomas}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Hobby"
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Que hobbies tienes?"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddHobby}
                    disabled={inputValue.trim() === ""}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {hobbies.map((hobby, index) => (
                    <Chip
                      key={hobby.id}
                      label={hobby.name}
                      onDelete={() => handleDeleteHobby(hobby)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Stack>
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
