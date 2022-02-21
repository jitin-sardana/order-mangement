import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Fade } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    visibleXs : {
        [theme.breakpoints.up('xs')]: {
            display: 'block'
        },
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        },
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('lg')]: {
            display: 'none'
        }
    },
    hiddenXs: {
        [theme.breakpoints.up('xs')]: {
            display: 'none'
        },
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        },
        [theme.breakpoints.up('lg')]: {
            display: 'block'
        }
    }
}));

export default function TopBar() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { authenticatedUser } = useSelector(state => state.orderManagement);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = (redirectTo) => {
        handleClose();
        navigate(redirectTo);
    }

    return (
        <Grid item xs={12} sm={12} md={12} lg={12}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleClick}>
                        <MenuIcon fontSize={'large'} />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        HC Agency
                    </Typography>
                    {authenticatedUser?.displayName && <><Typography className={classes.hiddenXs}>Welcome, {authenticatedUser.displayName} </Typography> <Button className={classes.hiddenXs} color="inherit" onClick={() => logout(dispatch)}>
                        Logout
                    </Button></>}
                </Toolbar>
                {authenticatedUser?.displayName && <><Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    {authenticatedUser?.displayName && <MenuItem className={classes.visibleXs}><Typography>Welcome, {authenticatedUser.displayName} </Typography></MenuItem>}
                    <MenuItem onClick={() => handleRedirect('/dashboard')}>Home</MenuItem>
                    <MenuItem onClick={() => handleRedirect('/products')}>Products</MenuItem>
                    <MenuItem onClick={() => handleRedirect('/orders')}>Orders</MenuItem>
                    {authenticatedUser?.displayName && <MenuItem className={classes.visibleXs}><Button onClick={() => logout(dispatch)}>
                        Logout
                    </Button></MenuItem> }
                </Menu>
                </>}
            </AppBar>
        </Grid>
    );
}