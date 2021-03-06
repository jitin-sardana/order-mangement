import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutlined } from '@material-ui/icons';
import { getCalculation } from '../utils';
import { useDispatch } from 'react-redux';
import { placeNewOrder } from '../firebase';
//import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    actionButtons: {
        marginLeft: '5px'
    },
    placeOrder: {
        fullWidth: true,
        marginTop: '5%',
        textAlign: 'center'
    },
    linkButtonWatsApp: {
        fontSize: '15px',
        backgroundColor: '#3f51b5',
        padding: '12px 12px 12px 12px',
        borderRadius: '5px',
        color: '#FFF',
        textDecoration: 'none',
        width: '50%',
        display: 'inherit',
        marginLeft: '25%',
        marginTop: '5%',
        textAlign: 'center'
    },
    linkButton: {
        fontSize: '15px',
        backgroundColor: '#3f51b5',
        padding: '12px 12px 12px 12px',
        borderRadius: '5px',
        color: '#FFF',
        textDecoration: 'none',
        width: '50%',
        display: 'inherit',
        marginLeft: '25%',
        marginTop: '5%',
        textAlign: 'center',
        [theme.breakpoints.up('lg')]: {
            display: 'none',
            '@media (orientation: portrait)': {
                display: 'none'
            }
        }
    }
}));

const OrderDetails = ({ orderItems, selectedClient, selectedCity }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [discount, setDiscount] = useState(0);
    const [calculation, updateCalculation] = useState();
    const [disablePlaceOrderButton, setDisablePlaceOrderButton] = useState(false);
    //const navigate = useNavigate();

    useEffect(() => {
        updateCalculation(getCalculation(orderItems, discount));
    }, [orderItems, discount]);

    const deleteItemFromOrder = (id) => {
        dispatch({ type: 'DELETE_PRODUCT_FROM_ORDER', payload: id })
    }

    const addDiscount = (event) => {
        setDiscount(event.target.value)
    }

    const orderMessageString = (item) => {
        return (item?.priceAfterDiscountPerUnit) ? `${item.productName}(~${item.productPrice}~ %20${item.priceAfterDiscountPerUnit}*${item.quantity}${item.unit})=${item.totalAfterUnitsDiscount}%0A` 
        : `${item.productName}(${item.productPrice}*${item.quantity}${item.unit})=${item.total}%0A`;
    }
    const getMessageDetails = () => {
        const greetings = 'Greeting%20from%20H. C%20Agencies%0A';
        let orderDetails = '%0A';
        for (let i = 0; i < orderItems.length; i++) {
            orderDetails += orderMessageString(orderItems[i]);
        }
        const totalAmount = discount ? `%0ATotal = ${calculation?.totalAmount}%0A` : ``;
        const discountedAmount = discount ? `%0ADiscount = ${discount}%0A` : `%0A`;
        const totalAfterDiscount = discount ? `Total = ${calculation?.totalAfterDiscount}%0A` : ``;
        const totalAmountToBePaid = `Total Amount to be Paid = ??? *${calculation?.totalAfterDiscount}* %0A%0A`;
        const thanks = 'Thanks for placing order with us.%0ATake Care '

        return `${greetings}${orderDetails}${totalAmount}${discountedAmount}${totalAfterDiscount}${totalAmountToBePaid}${thanks}`;
    }

    /* const getMessageDetailsOld = () => {
        const greetings = 'Greeting%20from%20H. C%20Agencies%0A';
        let orderDetails = '%0A';
        for (let i = 0; i < orderItems.length; i++) {
            orderDetails += `${orderItems[i].productName}(${orderItems[i].productPrice}*${orderItems[i].quantity}${orderItems[i].unit})=${orderItems[i].total}%0A`
        }
        const totalAmount = discount ? `%0ATotal = ${calculation?.totalAmount}%0A` : ``;
        const discountedAmount = discount ? `%0ADiscount = ${discount}%0A` : `%0A`;
        const totalAfterDiscount = discount ? `Total = ${calculation?.totalAfterDiscount}%0A` : ``;
        const totalAmountToBePaid = `Total Amount to be Paid = (indian rupee) ${calculation?.totalAfterDiscount}%0A%0A`;
        const thanks = 'Thanks for placing order with us.%0ATake Care '

        return `${greetings}${orderDetails}${totalAmount}${discountedAmount}${totalAfterDiscount}${totalAmountToBePaid}${thanks}`;
    } */
    const placeOrder = async () => {
        const { totalAfterDiscount, totalAmountToBePaid } = calculation;
        const orderPlacedOn = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
        const payload = { ...{ products: orderItems }, ...selectedClient, ...selectedCity, discount, totalAfterDiscount, totalAmountToBePaid, orderPlacedOn };
        setDisablePlaceOrderButton(true);
        await placeNewOrder(payload, dispatch);
        setDisablePlaceOrderButton(false);
    }

    return (<><Grid container xs={12} sm={12} md={8} lg={8} >
        <Grid item xs={12} sm={12} >
            <Typography variant="h6" style={{ marginLeft: '15px' }}>Aggregate Bill</Typography><br />
            <div className="myWebApp">
                <table>
                    <tr>
                        <th></th>
                        <th>Product Name</th>
                        <th>Unit</th>
                        <th>Price(&#8377;)</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                    {orderItems?.map((order, i) => (<React.Fragment key={order.id}>
                        <tr>
                            <td>{i + 1}</td>
                            <td>{order.productName}</td>
                            <td>{order.unit}</td>
                            <td>{order?.priceAfterDiscountPerUnit ? <><strike style={{color:'red'}}>{order.productPrice}</strike><br/>{order.priceAfterDiscountPerUnit}</> : order.productPrice}</td>
                            <td>{order.quantity}</td>
                            <td>{order.totalAfterUnitsDiscount > 0 ? order.totalAfterUnitsDiscount : order.productPrice * order.quantity }</td>
                            <td>
                                <Button variant="outlined" className={classes.actionButtons} onClick={() => deleteItemFromOrder(order.id)} startIcon={<DeleteOutlined />}></Button>
                            </td>
                        </tr>
                    </React.Fragment>))}
                    <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Total</strong></td>
                        <td colSpan='2' style={{ textAlign: 'Left' }}><strong>{calculation?.totalAmount}</strong></td></tr>

                    <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Discount(&#8377;)</strong></td>
                        <td colSpan='2' style={{ textAlign: 'Left' }}><input type='text' name='discount' autoComplete='off' style={{ width: '50px' }} defaultvalue={discount} onChange={addDiscount} /></td></tr>

                    <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Total</strong></td>
                        <td colSpan='2' style={{ textAlign: 'Left' }}><strong>{calculation?.totalAmountToBePaid}</strong></td></tr>
                </table>
            </div>
        </Grid>
        <Grid container >
        <Grid item xs={12} sm={12} md={3} lg={3} className={classes.placeOrder} >
            <a variant={'button'} target='_blank' rel="noreferrer" href={`https://api.whatsapp.com/send/?phone=91${selectedClient?.clientPhoneNo}&text=${getMessageDetails()}`} className={classes.linkButtonWatsApp}><i className="fa fa-whatsapp"></i> Send Watsapp</a>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={1}  className={classes.placeOrder} >
            <a target='_blank' rel="noreferrer" href={`sms:+91${selectedClient?.clientPhoneNo};?&body=${getMessageDetails()}`} className={classes.linkButton}><i className="fa fa-envelope"></i> Sms </a>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={1}  className={classes.placeOrder}>
            <a target='_blank' rel="noreferrer" href={`tel:+91${selectedClient?.clientPhoneNo}`} className={classes.linkButton}><i className="fa fa-phone"></i> Call </a>
        </Grid>
         <Grid item xs={12} sm={12} md={3} lg={3} className={classes.placeOrder}
         style={{marginBottom:'30px', marginTop:'30px',width:'60%'}}>
            <Button variant="contained" color="primary"
                disabled={disablePlaceOrderButton}
                onClick={placeOrder}>
                {disablePlaceOrderButton ? <><i class="fa fa-refresh fa-spin"></i>&nbsp;Placing Order</> : "Place Order"}
            </Button>
        </Grid>
        </Grid>
    </Grid>

    </>);
}

export default OrderDetails;