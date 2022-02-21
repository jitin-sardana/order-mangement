import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBackOutlined } from '@material-ui/icons';
import { auth } from '../firebase';
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
    addProduct: {
        textAlign: 'right'
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
const OrderList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [user, loading] = useAuthState(auth);
    const { loading: stateLoader, orders } = useSelector(state => state.orderManagement);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [loading, navigate, user]);

    const viewBill = (billDetails) => {
        dispatch({type: 'VIEW_BILL', payload: billDetails});
        navigate('/bill');
    }
    return (<>
        <Grid container className={classes.container} spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <Button variant="outlined" startIcon={<ArrowBackOutlined />} onClick={() => navigate('/dashboard')}>
                    Back
                </Button>
            </Grid>

            <Grid item xs={12}>
                {orders?.length > 0 ? <div className="myWebApp"><table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Order Date</th>
                            <th>City</th>
                            <th>Client Name</th>
                            <th>Client Address</th>
                            <th>Client Phone No</th>
                            <th>Order Details</th>
                            <th>Discount (&#8377;)</th>
                            <th>GST</th>
                            <th>Total (&#8377;)</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((orderItem, i) => (
                            <tr key={orderItem.id}>
                                <td>{i + 1}</td>
                                <td>{orderItem.orderPlacedOn}</td>
                                <td>{orderItem.cityName}</td>
                                <td>{orderItem.clientName}</td>
                                <td>{orderItem.clientAddress}</td>
                                <td>{orderItem.clientPhoneNo}</td>
                                <td>{orderItem.products.map((product) => (<p key={product.id}>{product.productName}({product.productPrice}*{product.quantity}/{product.unit} = {product.total})</p>))}</td>
                                <td>{orderItem.discount}</td>
                                <td>18%</td>
                                <td>{orderItem.totalAmountToBePaid}</td>
                                <td><Button variant="contained" onClick={() => viewBill(orderItem)}>
                    View Bill
                </Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>: <Grid item xs={6} sm={12}>
                    {stateLoader ? <img src={Loading} alt='loading data' /> : `No Order is placed so far`}
                </Grid>}
            </Grid>
        </Grid>
    </>);
}

export default OrderList;