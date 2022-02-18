import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Grid}  from '@material-ui/core';
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container : {
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

function Login() {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [loginButtonLoading, setloginButtonLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/dashboard");
    }, [user, loading, navigate]);

    const login = (email, password, dispatch) => {
        setloginButtonLoading(true);
        signInWithEmailAndPassword(email, password, dispatch, setloginButtonLoading)
    }

    return (
        <Grid container
            direction="column"
            fixed={true}
            alignItems="center"
            className={classes.container}
        >
            <TextField
                label="Email Address"
                variant="outlined"
                value={email}
                disabled={loginButtonLoading}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
                margin="normal"
                className={classes.textField}
            />
            <TextField
                label="Password"
                variant="outlined" type="password"
                value={password}
                disabled={loginButtonLoading}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                margin="normal"
                className={classes.textField}
            />
            <Button
                variant="contained"
                color="primary"
                disabled={loginButtonLoading}
                onClick={() => login(email, password, dispatch)}>
                {loginButtonLoading ? <><i class="fa fa-refresh fa-spin"></i>&nbsp;Signing In</> : "Sign In"}
            </Button>
            <div>
                <Link to="/reset">Forgot Password</Link>
            </div>
        </Grid>
    );
}

export default Login;