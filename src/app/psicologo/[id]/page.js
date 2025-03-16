"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Avatar,
  Box,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import {
  getPsicologo,
  getHobbiesbyUser
} from "../../Services/register.service";
import {
  getListaServiciosPorPsicologo, 
} from "../../Services/profilePsicology.service";
import AvailabilityPicker from "@/app/components/AvailabilityPicker.component";

export default function Page() {
  const { id } = useParams();
  const imageProfile = "https://via.placeholder.com/150";
  const [preview, setPreview] = useState(imageProfile);
  const [psicologo, setPsicologo] = useState(null);
  const [datospersonales, setDatosPersonales] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [idDatosPersonales, setIdDatosPersonales] = useState(null);
  

  const GetPsicologo = async (id) => {
    if (id == null) return;

    try {
      const data = await getPsicologo(id);
      var psicologo = data.psicologo;
      const imageBlob = `data:image/jpeg;base64,${data.imageBase64}`;
      var datospersonales = psicologo.idDatosPersonalesNavigation;
      console.log("GetPsicologo",datospersonales.id)
      GetHobies(datospersonales.id)
      setIdDatosPersonales(datospersonales.id)
      setPsicologo(psicologo);
      setDatosPersonales(datospersonales);
      setPreview(imageBlob);
 
    } catch (error) {
      console.log("GetPsicologo", error);
    }
  };
 
  const GetHobies = async (id) => {
    if(id === undefined) return;

    try {
      const data = await getHobbiesbyUser(id);
      if (data != undefined) {
        let listHobbies = data.map((hobbie) => ({        
          name: hobbie.nombre,
          id: hobbie.id,
        }));
        console.log("listHobbies", listHobbies);
        setHobbies(listHobbies);
      }
    } catch (error) {
      console.log("GetHobiesPorPsicologo", error);
    }

  };

  // const GetServiciosPorPsicologo = async (id) => {
  //   try {
  //     const data = await getListaServiciosPorPsicologo(id);
  //     if (data != undefined) {
  //       console.log(data)
  //       setServicios(data ?? []);
        
  //     }
  //   } catch (error) {
  //     console.log("GetServiciosPorPsicologo", error);
  //   }
  // };

  // const ListSelectServicios =() =>{
   
      
  //   let list = servicios.map((a, y) => (
  //     <MenuItem key={y+1} value={a.id}>
  //       {a.servicioNombre}
  //     </MenuItem>
  //   ));

  //   list.unshift( 
  //     <MenuItem key={0} value={0}>
  //       {"Seleccione un servicio"}
  //     </MenuItem>)

  //   return list
  // }
 
  useEffect(() => {
    GetPsicologo(id);
   
    // GetServiciosPorPsicologo(id);    
  }, []);
  
  return (
    <Box sx={{ display: "flex", justifyContent: "left", p: 2 }}>
       <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          borderRadius: 2,
        }}
      >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <Avatar
            src={preview}
            sx={{ width: 120, height: 120 }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
            <Typography variant="h5"></Typography>
            <Typography variant="body1" color="text.secondary">
             {datospersonales?.nombre}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {datospersonales?.telefono}
            </Typography>
            <Typography variant="body1" color="text.secondary">
            {psicologo?.experiencia} años
            </Typography>
          </Grid>
          {/* ABOUT ME  */}
          <Grid item xs={12} lg={12}>
            <Typography variant="subtitle1" fontWeight="bold">Acerca de mi </Typography>
            <Typography variant="body2">{psicologo?.descripcion}</Typography>
          </Grid>
          {/* SERICIOS */}
          <Grid item xs={6} lg={6} >
            <Typography variant="subtitle1" fontWeight="bold">Servicios</Typography>
            <List 
             sx={{
              width: '100%',
              maxWidth: 500,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
            >
              {servicios?.map((servicio) => (
                <ListItem 
                  key={servicio.id} 
                  divider 
                  secondaryAction={
                   `$${servicio.valor}` 
                  }
                  >
                  <ListItemText primary={servicio.servicioNombre}  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} lg={6} >
            <Typography variant="subtitle1" fontWeight="bold">Agendar cita:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
               {/* <InputLabel id="Servicio-label">Servicio</InputLabel>
                             <Select
                               labelId="Servicio-label"
                               id="servicio"
                               name="servicio"
                               // value={formik.values.departamento}
                               // onChange={formik.handleChange}
                               // onChange={handleSelectChange}
             
                               label="Servicio"
                               defaultValue="0"
                             >
                               {ListSelectServicios()}
                             </Select> */}
                <AvailabilityPicker></AvailabilityPicker>
            </Box>
          </Grid>
          {/* hobies */}
          <Grid item xs={6} lg={12} >
            <Typography variant="subtitle1" fontWeight="bold">Hobies:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {hobbies.map((hobby) => (
                    <Chip                    
                      key={hobby.id}
                      label={hobby.name}
                      color="primary"
                    />
                  ))}
                </Box>
          </Grid>
      </Grid> 
      </Paper>
    </Box>
  );
}
