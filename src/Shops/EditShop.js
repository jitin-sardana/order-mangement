import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isValidated } from '../utils';
import { editClientDetails } from '../firebase';

const useStyles = makeStyles((theme) => ({
    marginTop: {
        marginTop: '5%',
    }
}));

const EditShop = ({ isOpen, clientName, clientPhoneNo, clientAddress, id, cityId, closeEditModal }) => {
    const classes = useStyles();
    const intialValues = {
        clientName,
        clientPhoneNo,
        clientAddress
    }

    const [open, setOpen] = useState(isOpen);
    let [values, setValues] = useState(intialValues);

    const handleClose = () => {
        closeEditModal();
        setOpen(false);
    };

    const handleInputChange = (e) => {
        let {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const updateClient = () =>{
        if (isValidated(values)) {
            editClientDetails(values, cityId, id);
            setOpen(false);
            closeEditModal();
        }
    }

    return (
        <>
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"></DialogTitle>
                <form autoComplete='off'>
                <DialogContent>
                    <DialogContentText>
                       Edit details of <strong>{clientName.toUpperCase()}</strong> 
                    </DialogContentText>
                    <TextField
                        autoFocus
                        variant='outlined'
                        margin="dense"
                        id="clientName"
                        name="clientName"
                        label="Client Name"
                        type="text"
                        defaultValue={clientName}
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <TextField
                        variant='outlined'
                        className={classes.marginTop}
                        margin="dense"
                        id="clientPhoneNo"
                        name="clientPhoneNo"
                        label="Client Phone No"
                        inputProps={{ type: 'tel', inputmode: "decimal"}}
                        type="text"
                        defaultValue={clientPhoneNo}
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <TextField
                        variant='outlined'
                        className={classes.marginTop}
                        margin="dense"
                        id="clientAddress"
                        name="clientAddress"
                        label="Client Address"
                        defaultValue={clientAddress}
                        type="text"
                        fullWidth
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={updateClient}>
                        Update {clientName}
                    </Button>
                </DialogActions>
                </form>
            </Dialog> 
        </>
    );
}
export default EditShop;