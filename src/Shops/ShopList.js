import React, { useEffect, useState } from 'react';
import { db, deleteClient } from "../firebase";
import { useDispatch, useSelector } from 'react-redux';
import EditShop from './EditShop';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Grid, CardHeader, CardContent, Typography, Card, IconButton, Menu, MenuItem, Fade} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../assets/loading.gif';
import { useNavigate } from 'react-router-dom';
import Search from '../CommonComponents/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#cccdee',
        background: "linear-gradient(45deg, #cccdee 30%, #3f51b5 70%)",
        height: "100%",
        transition: "0.3s",
        boxShadow: "0 15px 40px -12px rgba(3,3,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,05,0,0.3)"
        }
    },
    cardActions: {
        marginTop: '25px'
    },
    cardHeader: {
        cursor: 'pointer',
        wordWrap: 'break-wrap',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer'
    },
    icons: {
        cursor: 'pointer'
    },
    title: {
        color: theme.palette.text.secondary
    }
}));

const ShopList = ({ cityName, docId }) => {
    const classes = useStyles();
    const [clients, setClients] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.orderManagement);

    const handleClick = (event, client) => {
        setAnchorEl(event.currentTarget);
        setSelectedClient(client);
        dispatch({type:'SET_SELECTED_CLIENT', payload:client});
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        dispatch({ type: 'LOADING', payload: true });
        const unsubscribe = db.collection('clients').where("cityId", "==", docId).onSnapshot(snap => {
            let clients = [];
            snap.docs.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                clients = [...clients, data];
            });
            setClients(clients.length > 0 ? clients : null);
            dispatch({ type: 'LOADING', payload: false });
        });
        return () => unsubscribe()
    }, [docId, dispatch]);

    const editClient = () => {
        setIsOpen(true);
        handleClose();
    }
    const placeOrder = () => {
        dispatch({ type: 'CLEAR_OLD_ORDER' })
        navigate('/place-order');
        handleClose();
    }
    const deleteSelectedClient = () => {
        const { id } = selectedClient;
        deleteClient(id);
        handleClose();
    }
    const closeEditModal = () => {
        setIsOpen(false);
    }
    const updateData = (e) => {
        setSearchItem(e.target.value);
    }

    return (<>
        {clients?.length > 0 && <Search updateData={updateData} cityName={cityName} />}
        {clients?.length > 0 ? clients.filter((client)=>client.clientName.toLowerCase().indexOf(searchItem)!==-1).map((client) => (<React.Fragment key={client.id}>
            <Grid item xs={12} sm={6} md={6} lg={4}>
                <Card className={classes.root}>
                    <CardHeader
                        title={client.clientName}
                        className={classes.cardHeader}
                        action={
                            <IconButton aria-label="settings" onClick={(e) => handleClick(e, client)}>
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Typography variant="body1" component="p">
                            <strong>ADDRESS</strong>: {client.clientAddress}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </React.Fragment>
        )) : <Grid item xs={6} sm={12}>
            {loading ? <img src={Loading} alt='loading data' /> : `Currently there is no client in ${cityName}`}
        </Grid>}

        <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
        >
            <MenuItem onClick={() => placeOrder()}>Place Order</MenuItem>
            <MenuItem onClick={() => editClient()}>Edit</MenuItem>
            <MenuItem onClick={() => deleteSelectedClient()}>Delete</MenuItem>
        </Menu>
        {isOpen ? <EditShop {...selectedClient} isOpen={isOpen} closeEditModal={closeEditModal} /> : null}
    </>);

}

export default ShopList;