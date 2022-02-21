import React, { useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBackOutlined } from '@material-ui/icons';
import { auth } from '../firebase';
import Pdf from "react-to-pdf";


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

const ViewBill = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [user, loading] = useAuthState(auth);
    const { billDetails } = useSelector(state => state.orderManagement);
    const pdfRef = createRef();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [loading, navigate, user]);

    return (<>
        <Grid container className={classes.container} spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <Button variant="outlined" startIcon={<ArrowBackOutlined />} onClick={() => navigate('/orders')}>
                    Back
                </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <Pdf targetRef={pdfRef} filename="code-example.pdf">
                    {({ toPdf }) => <Button variant="contained" onClick={toPdf}>Download</Button>}
                </Pdf>
            </Grid>
            <Grid item xs={12}>
                <div ref={pdfRef} style={{ width: 800 }} x={.5} y={.5} scale={0.5} >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tb">
                        <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td colspan="2"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td height="49" valign="bottom" style={{ fontSize: '20px', color: '#d04e00', fontWeight: '800', fontFamily: 'Muli sans-serif' }}>HC Agency</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }} >GSTIN : 03ALNPK2641M1ZZ</td>
                                        </tr>
                                        {/*  <tr>
                                            <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Pan No : AA444111FFFF</td>
                                        </tr> */}
                                        <tr>
                                            <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Office : B\O BHAGAT SINGH CHOWNK<br />MANSA, PUNJAB</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Email: hcagencies@gmail.com</td>
                                        </tr>
                                    </tbody>
                                </table></td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td height="36" colspan="4">&nbsp;</td>
                            </tr>
                            <tr>
                                <td width="3%">&nbsp;</td>
                                <td colspan="2"><table width="100%" border="0" cellpadding="0" cellspacing="0" class="tb1">
                                    <tbody>
                                        <tr>
                                            <td><table style={{ border: '1px solid #999999', width: '100%' }} border='0' cellspacing="0" cellpadding="0">
                                                <tbody>
                                                    <tr>
                                                        <td width="16%" height="25"><strong><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Client Name </span></strong></td>
                                                        <td width="49%"><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>{billDetails.clientName}</span></td>
                                                        <td width="20%"><strong><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Invoice Date</span></strong></td>
                                                        <td width="15%"><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>{billDetails.orderPlacedOn}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td height="25"><strong><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Address</span></strong></td>
                                                        <td><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>{billDetails.clientAddress}</span></td>
                                                        {/* <td><strong><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>Invoice Number</span></strong></td>
                                                        <td><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>#333GHG</span></td> */}
                                                    </tr>
                                                    <tr>
                                                        <td height="25"><strong><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>GSTIN</span></strong></td>
                                                        <td><span style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>0748MJKKLLL***</span></td>
                                                        <td>&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table></td>
                                        </tr>
                                        <tr>
                                            <td height="31" style={{ borderTop: '1px solid #999999' }}>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td><table style={{ border: '1px solid #999999', width: '100%' }} border="1" cellpadding="0" cellspacing="0" class="tb2">
                                                <tbody>
                                                    <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td width="7%" height="30" align="center"><strong>S.N</strong></td>
                                                        <td width="60%" align="center"><strong>Description </strong></td>
                                                        <td width="8%" align="center"><strong>Qty </strong></td>
                                                        <td width="12%" align="center"><strong>Rate </strong></td>
                                                        <td width="13%" align="center"><strong>Amount (&#8377;)</strong></td>
                                                    </tr>
                                                    {billDetails.products.map((product) => (<tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td height="30" align="center">1.</td>
                                                        <td align="center"> {product.productName}</td>
                                                        <td align="center">{product.quantity}</td>
                                                        <td align="center">{product.productPrice}/{product.unit}</td>
                                                        <td align="center">{product.total}</td>
                                                    </tr>))}
                                                    {
                                                        billDetails.discount > 0 && <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                            <td height="30" align="right" colspan={4}><strong>Discount(&#8377;)&nbsp;&nbsp;&nbsp;&nbsp;</strong></td>
                                                            <td align="center">{billDetails.discount}</td>
                                                        </tr>
                                                    }
                                                    <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td height="30" align="right" colspan={4}><strong>Taxable Total&nbsp;&nbsp;&nbsp;&nbsp;</strong></td>
                                                        <td align="center">{billDetails.totalAfterDiscount}</td>
                                                    </tr>
                                                </tbody>
                                            </table></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td><table width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                                                <tbody>
                                                    <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td height="30" align="right" colspan={4}>&nbsp;<strong>State Tax</strong>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                        <td width="13%" align="center">9%&nbsp;</td>
                                                    </tr>
                                                    <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td height="30" align="right" colspan={4}>&nbsp;<strong>Central Tax</strong>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                        <td width="13%" align="center">9%&nbsp;</td>
                                                    </tr>
                                                    <tr style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }}>
                                                        <td height="30" align="right" colspan={4}><strong>Grand Total&nbsp;&nbsp;&nbsp;&nbsp;</strong></td>
                                                        <td align="center">{billDetails.totalAmountToBePaid}</td>
                                                    </tr>
                                                </tbody>
                                            </table></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table></td>
                                <td width="3%">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="4">&nbsp;</td>
                            </tr>
                            <tr>
                                <td height="32">&nbsp;</td>
                                <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }} width="47%" height="32"><strong>Date : 07 JUNE 2020</strong></td>
                                <td height="32">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="4">&nbsp;</td>
                            </tr>
                            <tr>
                                <td height="72">&nbsp;</td>
                                <td>&nbsp;</td>
                                <td style={{ fontSize: '13px', color: '#000', padding: '5px', fontFamily: 'Muli sans-serif' }} align="right" valign="bottom"><strong>Authorised Signature</strong></td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="4">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Grid>
        </Grid>
    </>);
}

export default ViewBill;