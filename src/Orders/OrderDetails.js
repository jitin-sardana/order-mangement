import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutlined } from '@material-ui/icons';
import { getCalculation } from '../utils';
import { useDispatch } from 'react-redux';
import { placeNewOrder } from '../firebase';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    actionButtons: {
        marginLeft: '5px'
    },
    placeOrder: {
        fullWidth: true,
        marginTop:'5%'
    }
}));

const OrderDetails = ({ orderItems, selectedClient, selectedCity }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [discount, setDiscount] = useState(0);
    const [calculation, updateCalculation] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        updateCalculation(getCalculation(orderItems, discount));
    }, [orderItems, discount]);

    const deleteItemFromOrder = (id) => {
        dispatch({ type: 'DELETE_PRODUCT_FROM_ORDER', payload: id })
    }

    const addDiscount = (event) => {
        setDiscount(event.target.value)
    }

    const getMessageDetails = () => {
        /*
         var whatsappMessage= "My title"+"\r\n\r\n"+"My description and link"
        return window.encodeURIComponent(whatsappMessage);
        */
        const greetings = 'Greeting%20from%20H.C%20Agency%0A';
        let orderDetails = '%0A';
        for (let i = 0; i < orderItems.length; i++) {
            orderDetails += `${orderItems[i].productName}(${orderItems[i].productPrice}*${orderItems[i].quantity}${orderItems[i].unit})=${orderItems[i].total}%0A`
        }
        const totalAmount = `%0ATotal = ${calculation?.totalAmount}%0A`;
        const discountedAmount = discount ? `%0ADiscount = ${discount}%0A` : `%0A`;
        const totalAfterDiscount = discount ? `Total = ${calculation?.totalAfterDiscount}%0A` : `%0A`;
        const gst = `State GST = 9% %0ACentral GST = 9% %0A`;
        const totalAmountToBePaid = `Total Amount to be Paid = ${calculation?.totalAmountToBePaid}%0A%0A`;
        const thanks = 'Thanks for choosing us %0A Take Care'

        return `${greetings}${orderDetails}${totalAmount}${discountedAmount}${totalAfterDiscount}${gst}${totalAmountToBePaid}${thanks}`;

    }
    const placeOrder = () => {
        const { totalAfterDiscount, totalAmountToBePaid } =  calculation;
        const orderPlacedOn = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'});
        const payload = {...{products: orderItems}, ...selectedClient, ...selectedCity, discount, totalAfterDiscount, totalAmountToBePaid, orderPlacedOn};
        placeNewOrder(payload, dispatch);
        navigate('/orders');
    }

    return (<><Grid container xs={12} sm={12} md={8} lg={8} >
        <Grid item xs={12} sm={12} >
        <Typography variant="h6">Aggregate Bill</Typography><br />
        <div className="myWebApp">
        <table>
            <tr>
                <th></th>
                <th>Product Name</th>
                <th>Unit</th>
                <th>Price(&#8377;)</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
            </tr>
            {orderItems?.map((order, i) => (<React.Fragment key={order.id}>
                <tr>
                    <td>{i + 1}</td>
                    <td>{order.productName}</td>
                    <td>{order.unit}</td>
                    <td>{order.productPrice}</td>
                    <td>{order.quantity}</td>
                    <td>{order.productPrice * order.quantity}</td>
                    <td>
                        <Button variant="outlined" className={classes.actionButtons} onClick={() => deleteItemFromOrder(order.id)} startIcon={<DeleteOutlined />}></Button>
                    </td>
                </tr>
            </React.Fragment>))}
            <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Total</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><strong>{calculation?.totalAmount}</strong></td></tr>

            <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Discount(&#8377;)</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><input type='text' name='discount' autoComplete='off' style={{ width: '50px' }} defaultvalue={discount} onChange={addDiscount} /></td></tr>

            <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Taxable Total</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><strong>{calculation?.totalAfterDiscount}</strong></td></tr>

            <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>State Tax</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><strong>9%</strong></td></tr>
                <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Central Tax</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><strong>9%</strong></td></tr>

            <tr style={{ backgroundColor: 'white' }}><td colSpan='5' style={{ textAlign: 'Right' }}><strong>Total</strong></td>
                <td colSpan='2' style={{ textAlign: 'Left' }}><strong>{calculation?.totalAmountToBePaid}</strong></td></tr>
        </table>
        </div>
        </Grid>
        <Grid item xs={4} sm={4} >
            <a target='_blank' rel="noreferrer" href={`https://api.whatsapp.com/send/?phone=91${selectedClient?.clientPhoneNo}&text=${getMessageDetails()}`} style={{ fontSize: '15px', color: '#3f51b5', textDecoration: 'none' }}><i className="fa fa-whatsapp"></i> Send Watsapp</a>
        </Grid>
        <Grid item xs={4} sm={4} >
            <a target='_blank' rel="noreferrer" href={`sms:+91${selectedClient?.clientPhoneNo};?&body=${getMessageDetails()}`} style={{ fontSize: '15px', color: '#3f51b5', textDecoration: 'none' }}><i className="fa fa-envelope"></i> Sms </a>
        </Grid>
        <Grid item xs={4} sm={4}>
            <a target='_blank' rel="noreferrer" href={`tel:+91${selectedClient?.clientPhoneNo}`} style={{ fontSize: '15px', color: '#3f51b5', textDecoration: 'none' }}><i className="fa fa-phone"></i> Call </a>
        </Grid>
        <Grid item xs={12} sm={12} lg={12} className={classes.placeOrder}>
            <Button variant="contained" color="primary" onClick={placeOrder}>Place Order</Button>
        </Grid>
    </Grid>
        
    </>);
}

export default OrderDetails;