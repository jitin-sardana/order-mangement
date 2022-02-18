import { useEffect } from 'react';
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddNewShop from './AddNewShop';
import ShopList from './ShopList';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.secondary
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
}));

const Shops = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const { selectedCity } = useSelector(state => state.orderManagement);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [user, navigate, loading]);

    return (<>

        <Grid item xs={12} sm={4} className={classes.container}>
            <Button variant="outlined" startIcon={<ArrowBackOutlined />} onClick={() => navigate('/dashboard')}>
                Back
            </Button>
        </Grid>{user && selectedCity?.cityName && <>
           
                <AddNewShop cityName={selectedCity?.cityName} docId={selectedCity?.docId} />
            
            <Grid item xs={12}>
                <Typography variant="h6" className={classes.title}>
                    Clients in <strong>{selectedCity?.cityName.toUpperCase()}</strong>
                </Typography>
            </Grid>

            <ShopList cityName={selectedCity?.cityName} docId={selectedCity?.docId} /></>}

    </>
    );
}
export default Shops;