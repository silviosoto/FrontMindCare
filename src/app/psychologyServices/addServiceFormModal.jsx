import React from "react";
import {
  Autocomplete,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import { getServiciosByName } from "../Services/servicios.service";
import {
  registrarServicioDePsicologo,
  actualizarServicioDePsicologo,
  GetServiciosPorPsicologo
} from "../Services/profilePsicology.service";


const AddServiceFormModal = ({ formik, data }) => {
  
  const initialStateAutoComplete =
    data.length == 0
      ? null
      : {
          label: data?.servicioNombre,
        };

  const [options, setOptions] = useState(
    data.length == 0
      ? []
      : [
          {
            id: "1",
            label: data?.servicioNombre,
            nombre: "hola",
            value: "2",
          },
        ]
  );
 
  const haveInitialData = (data) =>{
    if(data.length == 0){
      return false;
    }
    return true;
  }

  const returnInitialData = (data) =>{
    var object = {   
      servicio: {},
      valor: 0
    } 

    if(haveInitialData(data)){
      object = {
        servicio: {
          label: data?.servicioNombre,
          id: data?.servicioId
        },
        valor: 2
      }
    }
 
    return  object
  }
  const initialState =  returnInitialData(data);
  const [loading, setLoading] = useState(false);
 
  const [selectedService, setSelectedService] = useState(
    initialStateAutoComplete
  );

  const { user } = useAppContext();

  const SearchAutocompete = async (name) => {
    if (user == null) return;

    try {
      const data = await getServiciosByName(name);
      let serviciosConLabel = data.map((servicio) => ({
        ...servicio,
        servicios: servicio.nombre,
        label: servicio.nombre,
      }));

      setOptions(serviciosConLabel);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("formik: ",  formik);
    setOptions([]);
  }, []);

  return (
    <>
      <Grid container justifyContent="center" spacing={1}>
          <Grid item xs={6}>
            <Autocomplete
               name="servicio"
               id="servicio"
               value={selectedService}
               onChange={(event, newValue) => {
                 setSelectedService(newValue);
                 formik.handleChange( { target: { name: "servicio", value: newValue } } )
               }}
               onInputChange={(event, value) => {
                 SearchAutocompete(value);
               }}
               getOptionLabel={(option) => option.label}
               options={options}
               loading={loading}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Servicios..."
                   InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                       <>
                         {loading ? (
                           <CircularProgress color="inherit" size={20} />
                         ) : null}
                         {params.InputProps.endAdornment}
                       </>
                     ),
                   }}
                 />
               )}
             />
          </Grid>

          <Grid item xs={3}>
            <TextField
              label="Valor"
              name="valor"
              type="number"
              variant="outlined"
              value={formik.values.valor}
              onChange={formik.handleChange}
              error={formik.touched.valor && Boolean(formik.errors.valor)}
              helperText={formik.touched.valor && formik.errors.valor}
              fullWidth
              required
            />
          </Grid>
        </Grid>
    </>
  );
};

export default AddServiceFormModal;
