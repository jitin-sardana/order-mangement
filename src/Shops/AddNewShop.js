import React, { useState } from 'react';
import { Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { addClientInCity } from '../firebase';
import { makeStyles } from '@material-ui/core/styles';
import { isValidated } from '../utils';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.secondary
    },
    marginTop: {
        marginTop: '5%',
    },
    container: {
        [theme.breakpoints.up('xs')]: {
            marginTop: '3%',
            // width: '100%',
            '@media (orientation: portrait)': {
                marginTop: '3%',
            },
        },
        [theme.breakpoints.up('sm')]: {
            marginTop: '3%',
            '@media (orientation: portrait)': {
                marginTop: '3%',
            },
        },
        [theme.breakpoints.up('md')]: {
            marginTop: '3%',
            '@media (orientation: portrait)': {
                marginTop: '3%',
            },
        },
        [theme.breakpoints.up('lg')]: {
            marginTop: '3%',
            '@media (orientation: portrait)': {
                marginTop: '3%'
            },
        }
    },
}));

const AddNewShop = ({ cityName, docId }) => {
    const classes = useStyles();
    const intialValues = {
        clientName: '',
        clientPhoneNo: '',
        clientAddress: ''
    }
    const [open, setOpen] = useState(false);
    let [values, setValues] = useState(intialValues);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const addNewClient = () => {
        if (isValidated(values)) {
            addClientInCity(values, docId);
            setOpen(false);
            setValues(intialValues);
        }
    }

    return (
        <>
            <Grid item className={classes.container} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add New Client
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Add New Client in <strong>{cityName}</strong>.
                </DialogTitle>
                <form autoComplete='off'>
                    <DialogContent>
                        <TextField
                            autoFocus
                            variant='outlined'
                            id="clientName"
                            name="clientName"
                            label="Client Name"
                            type="text"
                            fullWidth
                            onChange={handleInputChange}
                        />
                        <TextField
                            variant='outlined'
                            className={classes.marginTop}
                            id="clientPhoneNo"
                            name="clientPhoneNo"
                            label="Client Phone No"
                            inputProps={{ type: 'tel', inputmode: "decimal"}}
                            fullWidth
                            pattern="^\d{3}-\d{3}-\d{4}$"
                            required="required"
                            onChange={handleInputChange}
                        />
                        <TextField
                            variant='outlined'
                            className={classes.marginTop}
                            id="clientAddress"
                            name="clientAddress"
                            label="Client Address"
                            type="text"
                            fullWidth
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={addNewClient}>
                            Add New Client
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
export default AddNewShop;