import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography }  from '@material-ui/core';
import { auth, loadProducts } from "../firebase";
import AddNewCity from "./AddNewCity";
import CityList from "./CityList";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    [theme.breakpoints.up('xs')]: {
      marginTop: '10%',
      '@media (orientation: portrait)': {
        marginTop: '15%'
      },
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: '10%',
      '@media (orientation: portrait)': {
        marginTop: '10%'
      },
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '10%',
      '@media (orientation: portrait)': {
        marginTop: '10%'
      },
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: '5%',
      '@media (orientation: portrait)': {
        marginTop: '5%'
      },
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    color: theme.palette.text.secondary
  }
}));

function Dashboard() {
  const classes = useStyles();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    loadProducts(dispatch);
  }, [user, loading, navigate, dispatch]);

  return (
    <>
      <Grid item xs={12} sm={10} className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          All Locations
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12}>
        <AddNewCity />
      </Grid>
      <CityList />
    </>
  );
}

export default Dashboard;