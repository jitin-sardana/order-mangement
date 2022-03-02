import React, { useCallback, useEffect, useState, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid, CardHeader, CardContent, Typography, Card, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Pdf from "react-to-pdf";
import { auth, loadOrders, deleteAllOrders, deleteSelectedOrder } from '../firebase';
import Loading from '../assets/loading.gif';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#cccdee',
        marginTop: '15px',
        background: "linear-gradient(45deg, #cccdee 30%, #3f51b5 70%)",
        transition: "0.3s",
        boxShadow: "0 15px 40px -12px rgba(3,3,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,05,0,0.3)"
        }
    },
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
    desktop: {
        [theme.breakpoints.up('xs')]: {
            display: 'none'
        },
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('lg')]: {
            display: 'block'
        }
    },
    mobile: {
        [theme.breakpoints.up('xs')]: {
            display: 'block'
        },
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        },
        [theme.breakpoints.up('lg')]: {
            display: 'none'
        }
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
    const [date, setDate] = useState(new Date());
    const pdfRef = createRef();
    const mobilePdfRef = createRef();

    const fetchOrders = useCallback((date) => {
        setDate(date);
        const ordersByDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
        loadOrders(dispatch, ordersByDate);
    }, [dispatch]);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchOrders(date);
        // console.log(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }));
    }, [loading, navigate, user, fetchOrders, date]);

    /* const viewBill = (billDetails) => {
        dispatch({ type: 'VIEW_BILL', payload: billDetails });
        navigate('/bill');
    } */

    return (<>
        <Grid container className={classes.container} spacing={2}>
            <Grid item xs={12}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <DatePicker selected={date} onChange={(date) => fetchOrders(date)} />
                </Grid>
            </Grid>
            {orders?.length === 0 && <Grid item xs={12}>
                <h2>Orders placed on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
            </Grid>}

            <Grid item xs={6}>
                {orders?.length > 0 && <Button variant="contained" onClick={() => deleteAllOrders(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }))}>
                    Delete All
                </Button>}
            </Grid>
            {orders?.length > 0 && <Grid item xs={6} className={classes.desktop}>
                <Pdf targetRef={pdfRef} filename={`orders_${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}`}>
                    {({ toPdf }) => <Button variant="contained" onClick={toPdf}>Download</Button>}
                </Pdf>
            </Grid>}
            {orders?.length > 0 && <Grid item xs={6} className={classes.mobile}>
                <Pdf targetRef={mobilePdfRef} filename={`orders_${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}`}>
                    {({ toPdf }) => <Button variant="contained" onClick={toPdf}>Download</Button>}
                </Pdf>
            </Grid>}
            <Grid item xs={12} className={classes.desktop}>
                {orders?.length > 0 ? <div className="myWebApp" ref={pdfRef} style={{ width: 800 }} x={.5} y={.5} scale={0.5}>
                    <Grid item xs={12}>
                        <h2>Orders placed on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
                    </Grid>
                    <table>
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
                                <th>Total (&#8377;)</th>
                                <th>Actions</th>
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
                                    <td>{orderItem.totalAmountToBePaid}</td>
                                    <td> <Button variant="contained" onClick={() => deleteSelectedOrder(orderItem.id)}>Delete</Button>
                                    </td>
                                    {/* <td><Button variant="contained" onClick={() => viewBill(orderItem)}>
                                    View Bill
                                </Button></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table></div> : <Grid className={classes.desktop} item xs={6} sm={12}>
                    {stateLoader ? <img src={Loading} alt='loading data' /> : `No Order is placed so far`}
                </Grid>
                }
            </Grid>
            {orders?.length > 0 ? <Grid className={classes.mobile} item xs={12} sm={12} md={12} ref={mobilePdfRef}>
                <Grid item xs={12}>
                    <h2>Orders placed on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
                </Grid>
                {orders?.map((orderItem, i) => (<>
                    <Card className={classes.root}>
                        <CardHeader
                            title={orderItem.clientName}
                            className={classes.cardHeader}
                        />
                        <CardContent>
                            <p><strong>Order Details:</strong></p>
                            {orderItem.products.map((product) => (<>
                                <Typography variant="body1" component="p">
                                    {product.productName}({product.productPrice}*{product.quantity}/{product.unit} = {product.total})
                                </Typography>
                            </>))}
                            <p><Typography variant="body2" component="p"><strong>Discount: </strong> {orderItem.discount}</Typography>
                                <Typography variant="body3" component="p"><strong>Total: (&#8377;) </strong>{orderItem.totalAmountToBePaid}</Typography></p>
                            <p><Button variant="contained" onClick={() => deleteSelectedOrder(orderItem.id)}>Delete</Button></p>
                        </CardContent>
                    </Card>
                </>))}
            </Grid> : <Grid className={classes.mobile} item xs={6}>
                {stateLoader ? <img src={Loading} alt='loading data' /> : `No Order is placed so far`}
            </Grid>}
        </Grid>
    </>);
}

export default OrderList;