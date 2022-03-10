import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBackOutlined, AddCircleOutlined, EditOutlined, DeleteOutlined } from '@material-ui/icons';
import AddProduct from './AddProduct';
import { deleteProduct, auth } from '../firebase';
import EditProduct from './EditProduct';
import Loading from '../assets/loading.gif';

const useStyles = makeStyles((theme) => ({
    actionButtons: {
        marginLeft: '5px',
        [theme.breakpoints.up('xs')]: {
            marginTop: '5%',
            '@media (orientation: portrait)': {
                marginTop: '5%'
            },
        }
    },
    addProduct : {
        textAlign:'right'
    },
    container: {
        [theme.breakpoints.up('xs')]: {
            marginTop: '20%',
            '@media (orientation: portrait)': {
                marginTop: '20%'
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
const ProductList = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [user, loading] = useAuthState(auth);
    const [addNewProduct, setAddNewProduct] = useState(false);
    //const [products, setProducts] = useState();
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [selectedProductToEdit, setSelectedProductToEdit] = useState();
    const { loading: stateLoader, products } = useSelector(state => state.orderManagement);
    const dispatch = useDispatch();

    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [loading, navigate, user]);

    const editSelectedProduct = (product) => {
        setSelectedProductToEdit(product);
        setIsEditProductModalOpen(true);
    }

    return (<>
    <Grid container className={classes.container} spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <Button variant="outlined" startIcon={<ArrowBackOutlined />} onClick={() => navigate('/dashboard')}>
                Back
            </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <Button variant="contained" color="primary" className={classes.addProduct} startIcon={<AddCircleOutlined />} onClick={() => setAddNewProduct(true)}>
                Add Product
            </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
            {products?.length > 0 ? <div className="myWebApp"><table>
                <tr>
                    <th></th>
                    <th>Product Name</th>
                    <th>Price(&#8377;)</th>
                    <th>Unit</th>
                    <th>Actions</th>
                </tr>
                {products?.map((product, i) => (<React.Fragment key={product.id}>
                    <tr>
                        <td>{i + 1}</td>
                        <td>{product.productName}</td>
                        <td>{product.productPrice}</td>
                        <td>{product.unit}</td>
                        <td>
                            <Button variant="outlined" className={classes.actionButtons} startIcon={<EditOutlined />} onClick={() => editSelectedProduct(product)}></Button>
                            <Button variant="outlined" className={classes.actionButtons} startIcon={<DeleteOutlined />} onClick={() => deleteProduct(product.id, dispatch)}></Button>
                        </td>
                    </tr>
                </React.Fragment>))}
            </table></div> : <Grid item xs={6} sm={12}>
                {stateLoader ? <img src={Loading} alt='loading data' /> : `Products Not Available`}
            </Grid>}
        </Grid>
        </Grid>
        {addNewProduct && <AddProduct isOpen={addNewProduct} setAddNewProduct={setAddNewProduct} />}
        {isEditProductModalOpen && <EditProduct isOpen={isEditProductModalOpen} closeModal={setIsEditProductModalOpen} selectedProduct={selectedProductToEdit} />}
    </>);
}

export default ProductList;