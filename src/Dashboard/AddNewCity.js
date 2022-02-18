import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { AddCircleOutlined } from '@material-ui/icons';
import { addCityInBusiness } from '../firebase';

const AddNewCity = () => {
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addLocation = () => {

        if (location !== null) {
            addCityInBusiness(location);
            setOpen(false);
            setLocation(false);
        }
    }
    return (
        <>
            <Button variant="contained" color="primary" startIcon={<AddCircleOutlined />} onClick={handleClickOpen}>
                Add Location
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add new location to supply products and grow more.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="location"
                        label="Location"
                        type="text"
                        fullWidth
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addLocation} color="primary">
                        Add Location
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default AddNewCity;