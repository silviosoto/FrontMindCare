import React , { useEffect, useState }from "react";
import { Button, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { Event, Visibility, Work } from "@mui/icons-material";
const MAX_CHARACTERS = 100;
const ProfileCard = ({id,  name, phone, imageUrl, descripcion, experience, onViewProfile }) => {
    const imageProfile = "/images/ProfileImage.png";
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
      setShowFullDescription((prev) => !prev);
    };
    const displayedDescription = showFullDescription
    ? descripcion
    : `${descripcion.slice(0, MAX_CHARACTERS)}${descripcion.length > MAX_CHARACTERS ? "..." : ""}`;
    //   <CardMedia component="img" height="140" image={ `data:image/png;base64,${imageUrl}` ?? imageProfile}  />

  return (
   
    <Card
    style={{
      maxWidth: 300,
      margin: 16,
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
    }}
  >
    <CardMedia
      component="img"
      height="140"
      image={`data:image/png;base64,${imageUrl}` ?? imageProfile}
      alt={`${name}'s profile`}
    />
    <CardContent>
      <Typography variant="h6" component="div">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {phone}
      </Typography>

      {/* Experiencia con ícono */}
      <Stack direction="row" alignItems="center" spacing={1} style={{ margin: "8px 0" }}>
        <Work fontSize="small" sx={{ color: "#2121215c" }} />
        <Typography variant="body2" color="text.primary">
          {experience} años de experiencia
        </Typography>
      </Stack>

      {/* Descripción con "Ver más" */}
      <Typography
        variant="body2"
        style={{
          color: "rgba(0, 0, 0, 0.6)", // Más opaco
          fontSize: "0.775rem", // Fuente más pequeña
          margin: "8px 0",
        }}
      >
        {displayedDescription}
      </Typography>
      {descripcion.length > MAX_CHARACTERS && (
        <Button
          size="small"
          onClick={toggleDescription}
          style={{ textTransform: "none", padding: 0, marginTop: 4 }}
        >
          {showFullDescription ? "Ver menos" : "Ver más"}
        </Button>
      )}

      {/* Botones con íconos */}
      <Stack direction="row" spacing={2} style={{ marginTop: "12px" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          style={{ textTransform: "none" }}
          onClick={() => onViewProfile(id)} // Lógica dinámica para ver perfil
        >
          Ver perfil
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<Event />}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            textTransform: "none",
          }}
        >
          Agendar
        </Button>
      </Stack>
    </CardContent>
  </Card>
  );
};

export default ProfileCard;
