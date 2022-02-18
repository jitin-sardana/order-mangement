import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import { addNewProduct } from '../firebase';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    marginTop: {
        marginTop: '5%',
    }
}));
const AddProduct = ({ isOpen, setAddNewProduct }) => {
    const classes = useStyles();
    let [values, setValues] = useState({});
    const [checked, setChecked] = useState(true);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    };
    const handleClose = () => {
        setAddNewProduct(false);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleChange = event => {
        setChecked(event.target.checked);
    };

    const addProduct = () => {
        const { productName, productPrice } = values;
        if (!productName || !productPrice) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product Name, Product Price cannot be empty.'
            });
        } else {
            values = { ...values, productName: capitalizeFirstLetter(productName), unit: checked ? 'Box' : 'Pcs' };
            addNewProduct(values, dispatch);
            setAddNewProduct(false);
        }
    }
    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Add New Product.
                </DialogTitle>
                <form autoComplete='off'>
                    <DialogContent>
                        <TextField
                            autoFocus
                            id="productName"
                            name="productName"
                            variant='outlined'
                            label="Product Name"
                            type="text"
                            fullWidth
                            onChange={handleInputChange}
                        />

                        <TextField
                            id="productPrice"
                            name="productPrice"
                            variant='outlined'
                            className={classes.marginTop}
                            label="Price"
                            type="text"
                            fullWidth
                            onChange={handleInputChange}
                        />
                        <span>Pcs</span>
                        <Switch
                            color="primary"
                            size="medium"
                            checked={checked}
                            defaultChecked
                            onChange={handleChange}
                            name="checked"
                        />
                        <span>Box</span>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={addProduct}>
                            Add Product
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
export default AddProduct;