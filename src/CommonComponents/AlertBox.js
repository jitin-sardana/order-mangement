import Swal from 'sweetalert2';
const AlertBox = (icon, title) => {
    Swal.fire({
        icon: icon,
        title: title
    });
}
export default AlertBox;