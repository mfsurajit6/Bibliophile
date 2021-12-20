import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { isAuthenticated, signout } from "../helpers/AuthHelper";
import SearchAuto from "./SearchBoth";
import { getProfileById } from "../helpers/ProfileHelper";
// import UserSearch from "./UserSearch";


const useStyle = makeStyles((theme) => ({
  logo: {
    display: "inline",
    marginRight: "10px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoSearch: {
    // display: 'felx',
    // flexGrow: 1
  },
  search: {
    // display: 'inline'
  },
  menuicon:{
    color: 'white',
  },
  drawer: {
    width: '200px',
  },
  drawermenu:{
    "& Button":{
      display: 'block',
      margin: '3px 25px 3px 5px',
    },
    "& a":{
      display: 'block',
      margin: '3px 25px 3px 5px',
    }
  }
}));


const Navbar = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  // const location = useLocation();

  const [publicUrl, setPublicUrl] = useState("");
  const [open, setOpen] = useState(false);
  const bibId = localStorage.getItem("bib_id");

  const Menu = () => {
    return(
      <>
        <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {isAuthenticated() ? (
            <>
              <Button color="inherit" component={Link} to="/books">
                Books
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={publicUrl}
                params={{ isProfilePage: true }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  signout(() => navigate("/"));
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/signin">
                Sign In
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
      </>
    )
  }

  useEffect(() => {
    if (bibId) {
      getProfileById(localStorage.getItem("bib_id"))
        .then((data) => {
          // console.log("Nav ",data);
          if(data === 401){
            localStorage.removeItem("bib_token");
            localStorage.removeItem("bib_id");
            navigate("/signin")
          } else{
            let profile_url = "/profile/" + data.public_url;
            // console.log("Nav Bar"+profile_url)
            setPublicUrl(profile_url);
          }
        })
        .catch((err) => {
          navigate("/signin");
        });
    }
  }, [bibId]);

  window.onbeforeunload = () => {
    // signout();
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoSearch}>
          <Grid container spacing={2}>
            <Grid item sm={4}>
              <Typography variant="h6" className={classes.logo}>
                Bibliophile
              </Typography>
            </Grid>
            <Grid item sm={8}>
              {/* <div className={classes.search}>
                                {
                                    isAuthenticated() && (
                                        <Search />
                                    )
                                }
                            </div> */}
              <div className={classes.search} style={{ marginLeft: "10px" }}>
                {/* {isAuthenticated() && (location.pathname.split("/")[1] === 'profile' ? (
                  <>
                    <UserSearch />
                  </>
                ) : (
                  <SearchAuto />
                ))} */}
                {isAuthenticated() && <SearchAuto />}
              </div>
            </Grid>
          </Grid>
        </div>
        <Hidden xsDown>
        <div>
          {Menu()}
        </div>
        </Hidden>
        <Hidden smUp>
            <IconButton onClick={() => setOpen(true)}>
              <MenuIcon className={classes.menuicon}/>
            </IconButton>
          </Hidden>
      </Toolbar>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className={classes.drawer}
      >
        <div
          onClick={() => setOpen(false)}
          onKeyPress={() => setOpen(false)}
          role="button"
          tabIndex={0}
        >
          <IconButton>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.drawermenu}>
          {Menu()}
        </div>
      </SwipeableDrawer>
    </AppBar>
  );
};

export default Navbar;
