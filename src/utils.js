import Swal from 'sweetalert2';
export const getTotalWithoutGst = (items) => {
    let totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
        totalPrice += items[i].total;
    }
    return totalPrice;
}

/* export const getTotalWithDiscount = (items, discount) => {
    return discount ? getTotalWithoutGst(items) - discount : getTotalWithoutGst(items);
}

export const getTotalWithGst = (items) => {
    return getTotalWithDiscount(items) + getTotalWithDiscount(items) * 5 / 100;
}
 */
export const getCalculation = (items, discount) => {
    const totalAfterDiscount = discount ? getTotalWithoutGst(items) - discount : getTotalWithoutGst(items);
    return {
        totalAmount: getTotalWithoutGst(items),
        totalAfterDiscount: totalAfterDiscount,
        totalAmountToBePaid: totalAfterDiscount//(totalAfterDiscount + totalAfterDiscount * 18 / 100).toFixed(2)
    }
}

export const isValidated = (values) => {
    const phoneRegex = /^\d{10}$/;
    const { clientName, clientPhoneNo, clientAddress } = values;
    if (clientName === '' || !clientName) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Client Name cannot be empty.'
        });
        return false;
    } else if (clientPhoneNo === '' || !clientPhoneNo) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Client Phone Number cannot be empty.'
        });
        return false;
    } else if (clientPhoneNo && !clientPhoneNo.match(phoneRegex)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Client Phone Number should be of 10 digits.'
        });
        return false;
    } else if (clientAddress === '' || !clientAddress) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Client Address  cannot be empty.'
        });
        return false;
    } else if (clientName && clientPhoneNo && clientAddress) {
        return true;
    }
}

export const capitalizeFirstLetter = (val) => {
    return val.replace(/\b(\w)/g, s => s.toUpperCase());
}

export const isProductExist = (selectedProduct, orderDetails) => {
    const existingOrders = [];
    const {id} = selectedProduct;
    for (let i = 0; i < orderDetails.length; i++) {
        existingOrders.push(orderDetails[i].id);
    }
    return (existingOrders.includes(id));

}