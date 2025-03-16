"use client";
import React, { useEffect, useState } from "react";
import { getPsicologos } from "../Services/psicologo.service";
import { useSimpleAlert } from "../hooks/useSwal";
import ProfileList from "../components/profileList";
import FilterComponent from "../components/FilterComponent";
import { Box, Grid } from "@mui/material";

const ListaPsicologos = () => {
  const [psicologos, setPsicologos] = useState([]);
  const simpleAlert = useSimpleAlert();

  const getPsicologosList = async () => {
    try {
      const data = await getPsicologos(1);
      setPsicologos(data ?? []);
    } catch (error) {
      simpleAlert.error("Error al cargar los psicologos");
    }
  };

  useEffect(() => {
    getPsicologosList();
  }, []);

  return (
    <>
      <Box sx={{ padding: 0 }}>
        <Grid container spacing={2} >
          {/* Columna izquierda: Filtro */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <FilterComponent />
          </Grid>
          {/* Columna derecha: Cards */}
          <Grid item xs={12} md={8}>
            <ProfileList profiles={psicologos}  />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ListaPsicologos;
