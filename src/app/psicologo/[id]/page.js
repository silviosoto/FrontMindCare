"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
  Button,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  getPsicologo,
  getHobbiesbyUser,
} from "../../Services/register.service";
import { getListaServiciosPorPsicologo } from "../../Services/profilePsicology.service";
import AvailabilityPicker from "@/app/components/AvailabilityPicker.component";
import  ListaResenasPsicologo from "@/app/components/comments.component";
import PsychologyIcon from "@mui/icons-material/Psychology"; // Ícono representativo
import PerfilPsicologo from "@/app/components/ProfilePsicologo.component"; // Ícono representativo
export default function Page() {
  const { id } = useParams();
  const imageProfile = "https://via.placeholder.com/150";
  const [preview, setPreview] = useState(imageProfile);
  const [psicologo, setPsicologo] = useState(null);
  const [datospersonales, setDatosPersonales] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [idDatosPersonales, setIdDatosPersonales] = useState(null);
  const router = useRouter();

  const GetPsicologo = async (id) => {
    if (id == null) return;

    try {
      const data = await getPsicologo(id);
      var psicologo = data.psicologo;
      const imageBlob = `data:image/jpeg;base64,${data.imageBase64}`;
      var datospersonales = psicologo.idDatosPersonalesNavigation;
      console.log("GetPsicologo", datospersonales.id);
      GetHobies(datospersonales.id);
      setIdDatosPersonales(datospersonales.id);
      setPsicologo(psicologo);
      setDatosPersonales(datospersonales);
      setPreview(imageBlob);
    } catch (error) {
      console.log("GetPsicologo", error);
    }
  };

  const GetHobies = async (id) => {
    if (id === undefined) return;

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

  const handleClick = ( isPackage = false ) => {
    router.push(`/appointment?psicologo=${id}&ispackage=${isPackage}`);
  };

  const GetServiciosPorPsicologo = async (id) => {
    try {
      const data = await getListaServiciosPorPsicologo(id);
      if (data != undefined) {
        console.log(data);
        setServicios(data ?? []);
      }
    } catch (error) {
      console.log("GetServiciosPorPsicologo", error);
    }
  };

  const ListSelectServicios = () => {
    let list = servicios.map((a, y) => (
      <MenuItem key={y + 1} value={a.id}>
        {a.servicioNombre}
      </MenuItem>
    ));

    list.unshift(
      <MenuItem key={0} value={0}>
        {"Seleccione un servicio"}
      </MenuItem>
    );

    return list;
  };

  useEffect(() => {
    GetPsicologo(id);
    GetServiciosPorPsicologo(id);
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
          <PerfilPsicologo />
          
          <Grid item xs={12} sm={12}>
            <Divider variant="inset"  />
          </Grid>
          {/* ABOUT ME  */}
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Acerca de mi{" "}
            </Typography>
            <Typography variant="body2" color="text.secondary">{psicologo?.descripcion}</Typography>
          </Grid>
          {/* hobies */}
          <Grid item xs={12} lg={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Hobies:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {hobbies.map((hobby) => (
                <Chip key={hobby.id} label={hobby.name} color="text.secondary" />
              ))}
            </Box>
          </Grid>
          {/* SERICIOS */}
          <Grid item xs={6} lg={6}>
            <Typography 
            variant="subtitle1" 
            fontWeight="bold">
              Servicios
            </Typography>
            <List
              sx={{
                width: "100%",
                maxWidth: 500,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
              }}
            >
              {servicios.map((servicio, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    alignItems="flex-start"
                    key={servicio.id}
                    secondaryAction={`$${servicio.valor}`}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PsychologyIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          color="text.primary"
                        >
                          {servicio.servicioNombre}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {servicio.servicioNombre}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < servicios.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          <Grid item xs={6} lg={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Agendar cita:
            </Typography>
        
            <Box align="center">
              <Button onClick={()=>handleClick(false)} variant="contained">
                Apartar cita
              </Button>
            </Box> 
          </Grid>
          <Grid item xs={6} lg={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Ahora mas:
            </Typography>
        
            <Box align="center">
              <Button onClick={()=>handleClick(true)} variant="contained">
                Paquetes
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            {/* <ListaResenasPsicologo /> */}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
