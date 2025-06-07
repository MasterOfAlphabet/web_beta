import React from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider, useTheme, useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Hub", path: "/hub" },
  { label: "Challenges", path: "/challenges" },
  { label: "Winners", path: "/winners" },
  { label: "Leaderboards", path: "/leaderboards" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Master of Alphabet
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: "left" }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton component={RouterLink} to="/login">
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/signup">
          <ListItemText primary="Sign Up" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", display: { xs: "none", sm: "block" } }}
          >
            Master of Alphabet
          </Typography>
          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex" }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  sx={{ mx: 1 }}
                >
                  {item.label}
                </Button>
              ))}
              <Button color="inherit" component={RouterLink} to="/login" sx={{ mx: 1 }}>
                Login
              </Button>
              <Button
                color="secondary"
                variant="contained"
                component={RouterLink}
                to="/signup"
                sx={{ mx: 1 }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}