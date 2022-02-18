import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, sendPasswordResetEmail } from "../firebase";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    marginTop: '10%',
    [theme.breakpoints.up('xs')]: {
      marginTop: '10%',
      '@media (orientation: portrait)': {
        marginTop: '20%'
      }
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: '10%',
      '@media (orientation: portrait)': {
        marginTop: '20%'
      }
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
    [theme.breakpoints.up('xs')]: {
      width: '100%',
      '@media (orientation: portrait)': {
        width: '100%'
      }
    },
    [theme.breakpoints.up('sm')]: {
      width: '80%',
      '@media (orientation: portrait)': {
        width: '80%'
      },
    },
    [theme.breakpoints.up('md')]: {
      width: '80%',
      '@media (orientation: portrait)': {
        width: '80%'
      },
    },
    [theme.breakpoints.up('lg')]: {
      width: '30%',
      '@media (orientation: portrait)': {
        width: '30%'
      },
    }
  }
}));

function Reset() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <Grid container
      direction="column"
      fixed={true}
      alignItems="center"
      className={classes.container}
    >
      <Typography variant="h6">Enter your email address</Typography>
      <TextField
        label="Email Address"
        variant="outlined"
        autoComplete="off"
        placeholder="E-mail Address"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={classes.textField}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => { sendPasswordResetEmail(email, navigate) }}>
        Reset
      </Button>
      <div>
                <Link to="/">Back to Login</Link>
            </div>
    </Grid>
  );
}

export default Reset;