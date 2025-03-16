import { useAppContext } from "../../app/context/context";
import { useCookie } from "../hooks/useCookie.hook";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Routes } from "../routes";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
export const SideBar = (props) => {
  const { open, toggleDrawer, navRoutes } = props;

  const { push } = useRouter();

  const { get } = useCookie();

  const { user } = useAppContext();
   

  const ShowMenu = () => {
    var _navRoutes = Routes.filter(route =>  route.roles.includes(user?.profile))
    console.log("ShowMenu",navRoutes);
    return _navRoutes.map((item, index) => (
      <ListItemButton key={index} onClick={() => push(`${item.path}`)}>
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItemButton>
    ));
  };

  return (
    <Drawer variant="permanent" open={open}>
      {/* SideBar */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <Divider sx={{ my: 1 }} />
        {ShowMenu()}
      </List>
    </Drawer>
  );
};
