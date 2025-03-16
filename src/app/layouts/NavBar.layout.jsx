import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu"; 
import { useCookie } from "../hooks/useCookie.hook";
import { useRouter } from "next/navigation";

export const NavBar = (props) => {
  const { open, toggleDrawer } = props;
  const router = useRouter();
  const cookies = useCookie();
  const LogOut = () => {
    // eliminar el token de la pagina.
    try {
      cookies.remove("username");
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      router.push("login");
    } catch (error) {
      console.error("GetDepartamento", error);
    }
  };

  return (
    <AppBar 
      position="absolute"
      open={open}
      // ccambia la apaciencia de la barra 
      sx={{
        backgroundColor: "#f5f5f5", // Fondo gris claro
        color: "#000", // Texto negro
        boxShadow: "none", // Sin sombra
        borderBottom: "1px solid #bdbdbd", // Borde gris oscuro
      }}
      >
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
          backgroundColor: "#f5f5f5", // Cambia a gris claro
          color: "#000", // Cambia el color del texto a negro
        }}

        elevation={0} // Para un efecto de sombra más ligero
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          
        </Typography>
        <Button variant="contained" 
			    onClick={LogOut}
			>
          Log Outs
        </Button>

        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

// sx={{ bgcolor: 'transparent', color: 'primary.main', boxShadow: 'none' }}
// sx={{ textAlign: 'rigth', fontWeight: 'bold', textTransform: 'uppercase' }}
