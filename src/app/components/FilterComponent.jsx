import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const FilterSection = ({ title, options, selectedOptions, onChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selectedOptions.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
              />
            }
            label={option}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const FilterComponent = () => {
  // Estado para las secciones de filtros
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  // Opciones de ejemplo
  const services = ["Consulta general", "Terapia de pareja", "Psicología infantil"];
  const specialties = ["Psicología clínica", "Psicología educativa", "Psicología laboral"];

  // Manejo de selección
  const handleServiceChange = (option, isChecked) => {
    setSelectedServices((prev) =>
      isChecked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleSpecialtyChange = (option, isChecked) => {
    setSelectedSpecialties((prev) =>
      isChecked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  // Botones de acción
  const handleSearch = () => {
    console.log("Buscar con filtros:", { selectedServices, selectedSpecialties });
  };

  const handleApply = () => {
    console.log("Aplicar filtros:", { selectedServices, selectedSpecialties });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 2,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Filtros */}
      <Box sx={{ flex: 1, overflowY: "auto", maxHeight: 400 }}>
        <FilterSection
          title="Servicios"
          options={services}
          selectedOptions={selectedServices}
          onChange={handleServiceChange}
        />
        <FilterSection
          title="Especialidades"
          options={specialties}
          selectedOptions={selectedSpecialties}
          onChange={handleSpecialtyChange}
        />
      </Box>

      {/* Botones fijos */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ flex: 1 }}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleApply}
          sx={{ flex: 1 }}
        >
          Aplicar
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterComponent;
