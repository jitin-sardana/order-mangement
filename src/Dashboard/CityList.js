
import React, { useEffect, useState } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../assets/loading.gif';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer'
    },
    title: {
        color: theme.palette.text.secondary
    }
}));

const CityList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [locations, setLocations] = useState(null);
    const { loading } = useSelector(state => state.orderManagement);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: 'LOADING', payload: true });
        const unsubscribe = db.collection('cities').onSnapshot(snap => {
            let cities = [];
            snap.docs.forEach((doc) => {
                const data = doc.data();
                data.docId = doc.id;
                cities = [...cities, data];
            });
            setLocations(cities);
            dispatch({ type: 'LOADING', payload: false });
        });
        return () => unsubscribe()
    }, [dispatch]);

    const redirectToShops = (location) => {
        dispatch({ type: 'UPDATE_SELECTED_CITY', payload: location });
        navigate('/shops')
    }
    return (<>
        {locations?.length ? locations.map((location) => (<React.Fragment key={location.docId}>
            <Grid item xs={6} sm={3}>
                <Paper className={classes.paper} onClick={() => redirectToShops(location)}>{location.cityName}</Paper>
            </Grid>
        </React.Fragment>
        )) : <Grid item xs={6} sm={6}>
            {loading ? <img src={Loading} alt='loading data' /> : `Currently there is no city`}
        </Grid>}

    </>);

}

export default CityList;