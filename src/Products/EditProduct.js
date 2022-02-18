import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@material-ui/core';
import Swal from 'sweetalert2';
import { editProductDetails } from '../firebase';
import { useDispatch } from 'react-redux';

const EditProduct = ({ isOpen, closeModal, selectedProduct: { productName, productPrice, id, unit } }) => {
    const intialValues = {
        productName, productPrice, id
    }
    let [values, setValues] = useState(intialValues);
    const [checked, setChecked] = useState(unit === 'Box' ? true : false);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    };

    const handleClose = () => {
        closeModal(false);
    };

    const handleChange = event => {
        setChecked(event.target.checked);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const editSelectedProduct = () => {
        const { productName, productPrice } = values;
        if (!productName || !productPrice) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product Name, Product Price cannot be empty.'
            });
        } else {
            values = { ...values, productName: capitalizeFirstLetter(productName), unit: checked ? 'Box' : 'Pcs'};
            editProductDetails(values, dispatch);
            closeModal(false);
        }
    }
    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Edit Product
                </DialogTitle>
                <form autoComplete='off'>
                    <DialogContent>
                        <TextField
                            autoFocus
                            id="productName"
                            name="productName"
                            label="Product Name"
                            type="text"
                            fullWidth
                            variant='filled'
                            defaultValue={productName}
                            onChange={handleInputChange}
                        />

                        <TextField
                            id="productPrice"
                            name="productPrice"
                            label="Price"
                            type="text"
                            fullWidth
                            variant='filled'
                            defaultValue={productPrice}
                            onChange={handleInputChange}
                        />

                        <span>Pcs</span>
                        <Switch
                            color="primary"
                            size="medium"
                            checked={checked}
                            onChange={handleChange}
                            name="checked"
                        />
                        <span>Box</span>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={editSelectedProduct}>
                            Edit Product
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
export default EditProduct;