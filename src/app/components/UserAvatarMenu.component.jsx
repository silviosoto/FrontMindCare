import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
  Box
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
export default function UserAvatarMenu({
  userName = "Usuario",
  avatarUrl,
  onLogout
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  // Función para generar iniciales
  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  };

  const goToProfile = () => {
    router.push("/profilepaciente");
  }
  
  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src={avatarUrl || undefined}
            sx={{ width: 40, height: 40, bgcolor: avatarUrl ? "transparent" : "primary.main" }}
          >
            {!avatarUrl && getInitials(userName)}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userName}
          </Typography>
        </Box>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            mt: 1.5,
            minWidth: 200
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={goToProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Perfil</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit" color="error">
            Cerrar sesión
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
