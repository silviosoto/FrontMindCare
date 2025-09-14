import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Rating,
  Divider,
} from "@mui/material";

const reseñas = [
  {
    nombre: "Laura Gómez",
    avatar: "/static/images/avatar/1.jpg",
    descripcion: "Excelente profesional, me ayudó mucho con mi ansiedad.",
    puntuacion: 5,
  },
  {
    nombre: "Carlos Pérez",
    avatar: "/static/images/avatar/2.jpg",
    descripcion: "Muy buena atención, escucha y guía de forma clara.",
    puntuacion: 4,
  },
  {
    nombre: "Ana Torres",
    avatar: "/static/images/avatar/3.jpg",
    descripcion: "Recomendada, me sentí cómoda desde la primera sesión.",
    puntuacion: 5,
  },
  {
    nombre: "María Fernanda",
    avatar: "/static/images/avatar/4.jpg",
    descripcion: "Me ayudó a mejorar la comunicación con mi pareja.",
    puntuacion: 4,
  },
  {
    nombre: "Julián Ríos",
    avatar: "/static/images/avatar/5.jpg",
    descripcion: "Un espacio seguro para hablar y crecer emocionalmente.",
    puntuacion: 5,
  },
];

const ListaResenasPsicologo = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        textAlign="left"
        gutterBottom
      >
        Reseñas de pacientes
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
        {reseñas.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={item.nombre} src={item.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.nombre}
                    </Typography>
                    <Rating value={item.puntuacion} readOnly size="small" />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {item.descripcion}
                  </Typography>
                }
              />
            </ListItem>
            {index < reseñas.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ListaResenasPsicologo;
