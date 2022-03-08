import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowBackOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField, InputLabel, MenuItem, Select, FormControl } from '@material-ui/core';
import OrderDetails from './OrderDetails';
import { isProductExist } from '../utils';
import AlertBox from '../CommonComponents/AlertBox';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: 0,
        fullWidth: true,
        display: 'flex',
        wrap: 'nowrap'
    },
    link: {
        cursor: 'pointer',
        color: 'blue'
    },
    container: {
        marginTop: '20%',
        [theme.breakpoints.up('xs')]: {
            marginTop: '20%',
            '@media (orientation: portrait)': {
                marginTop: '20%'
            }
        },
        [theme.breakpoints.up('sm')]: {
            marginTop: '20%',
            '@media (orientation: portrait)': {
                marginTop: '20%'
            }
        },
        [theme.breakpoints.up('md')]: {
            marginTop: '10%',
            '@media (orientation: portrait)': {
                marginTop: '10%'
            }
        },
        [theme.breakpoints.up('lg')]: {
            marginTop: '5%',
            '@media (orientation: portrait)': {
                marginTop: '10%'
            }
        }
    }
}));

const AddOrder = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [user, loading] = useAuthState(auth);
    const dispatch = useDispatch();
    const quantityReference = useRef(null);
    const discountReference = useRef(null);
    const { selectedClient, products, orderDetails, selectedCity } = useSelector(state => state.orderManagement);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [updatedSeletedProduct, setUpdatedSelectedProduct] = useState([]);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [loading, navigate, user]);

    const onProductChange = (event) => {
        setSelectedProduct(event.target.value);
    }

    const updateUnitsDiscount = (event) => {
        if (event.target.value) {
            const totalPriceAfterDiscountPerUnit = selectedProduct.productPrice - event.target.value;
            const product = { ...selectedProduct, quantity: quantityReference.current.value, discountPerUnit: event.target.value, priceAfterDiscountPerUnit: totalPriceAfterDiscountPerUnit, totalAfterUnitsDiscount: totalPriceAfterDiscountPerUnit * quantityReference.current.value };
            setUpdatedSelectedProduct(product);
        }
    }
    const updateQuantity = (event) => {
        const product = { ...selectedProduct, quantity: quantityReference.current.value, total: selectedProduct.productPrice * event.target.value };
        setUpdatedSelectedProduct(product);
    }

    const aggregateOrder = () => {
        const productAlreadyExist = isProductExist(selectedProduct, orderDetails);
        if (productAlreadyExist) {
            AlertBox('warning', 'Product already exist in current order');
        } else if (updatedSeletedProduct?.quantity > 0 && !productAlreadyExist) {
            dispatch({ type: 'UPDATE_ORDER_DETAILS', payload: updatedSeletedProduct });
        }
        setSelectedProduct('');
        quantityReference.current.value = '';
        discountReference.current.value = '';
    }
    return (<>
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} sm={10}>
                <Button variant="outlined" startIcon={<ArrowBackOutlined />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Grid>
            {products?.length > 0 ? <><Grid item xs={12} sm={12} md={4} lg={4}>
                <Typography variant="h6">Place Order</Typography>
                <TextField
                    label="Client Name"
                    fullWidth={true}
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Client Name"
                    defaultValue={selectedClient?.clientName}
                    disabled={true}
                    margin="normal"
                />
                <TextField
                    label="Client Phone Number"
                    fullWidth={true}
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Client Phone Number"
                    defaultValue={selectedClient?.clientPhoneNo}
                    disabled={true}
                    margin="normal"
                />
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-label" >Select Product</InputLabel>
                    <Select
                        labelId="select-label"
                        variant="filled"
                        autoWidth={true}
                        label="Select Product"
                        value={selectedProduct}
                        onChange={onProductChange}
                    >
                        {products.map((product) => (
                            <MenuItem value={product}>
                                {product.productName}(&#8377; {product.productPrice}/{product.unit})
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        autoComplete="off"
                        margin="normal"
                        InputProps={{
                            inputProps: {
                                type: 'number',
                                min: 1,
                                inputmode: "decimal"
                            }
                        }}
                        inputRef={quantityReference}
                        onBlur={updateQuantity}
                    />
                    <TextField
                        label="Discount/Box"
                        type="number"
                        variant="outlined"
                        autoComplete="off"
                        margin="normal"
                        InputProps={{
                            inputProps: {
                                type: 'number',
                                inputmode: "decimal"
                            }
                        }}
                        inputRef={discountReference}
                        onBlur={updateUnitsDiscount}
                    />
                    <Button variant="contained" disabled={!selectedProduct} color="primary" onClick={aggregateOrder}>
                        Add to order
                    </Button>
                </FormControl>
            </Grid>
                {orderDetails.length > 0 && <OrderDetails orderItems={orderDetails} selectedClient={selectedClient} selectedCity={selectedCity} />}
            </> : <Grid item xs={12} sm={10}>
                Currently there are no products. please add products first from <span className={classes.link} onClick={() => navigate('/products')}>products</span> screen.
            </Grid>}
        </Grid>
    </>);
}

export default AddOrder;