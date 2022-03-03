import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Swal from 'sweetalert2';
import { capitalizeFirstLetter } from './utils';

const firebaseConfig = {
    apiKey: "AIzaSyBOkpaloKBASRPKoo0HbkjgKyGP_kLrqKI",
    authDomain: "order-management-system-76fc0.firebaseapp.com",
    projectId: "order-management-system-76fc0",
    storageBucket: "order-management-system-76fc0.appspot.com",
    messagingSenderId: "476222645313",
    appId: "1:476222645313:web:91d30df7be165b7119d2c0"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await auth.signInWithPopup(googleProvider);
        const user = res.user;
        const query = await db
            .collection("users", "SF")
            .where("uid", "==", user.uid)
            .get();
        if (query.docs.length === 0) {
            await db.collection("users").add({
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message.split(':')[1].replace('auth/', '')
        });
    }
};

const addCityInBusiness = async (cityName) => {
    try {
        const docRef = await addDoc(collection(db, "cities"), {
            cityName: capitalizeFirstLetter(cityName),
            cityId: cityName.replace(/\s+/g, '-')
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

const addClientInCity = async (values, docId) => {
    try {
        const { clientName, clientPhoneNo, clientAddress } = values;
        addDoc(collection(db, "clients"), {
            clientName: capitalizeFirstLetter(clientName),
            clientPhoneNo,
            clientAddress: capitalizeFirstLetter(clientAddress),
            cityId: docId
        });

        /* Swal.fire({
            icon: 'success',
            title: 'New Client added successfully!'
        }); */
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const addNewProduct = async (values, dispatch) => {
    try {
        const { productName, productPrice, unit } = values;
        await addDoc(collection(db, "products"), {
            productName: capitalizeFirstLetter(productName),
            productPrice,
            unit
        });
        loadProducts(dispatch);
        /*  Swal.fire({
             icon: 'success',
             title: 'New Product added successfully!'
         }); */
    } catch (e) {
        console.error("Error adding product: ", e);
    }
}

const placeNewOrder = async (values, dispatch) => {
    try {
        await addDoc(collection(db, "orders"), values);
        Swal.fire({
            icon: 'success',
            title: 'Order has been place successfully!'
        });
        loadOrders(dispatch);
        return true;
    } catch (e) {
        console.error("Error adding product: ", e);
    }

}

const editProductDetails = async (values, dispatch) => {
    try {
        const { productName, productPrice, id, unit } = values;
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, {
            productName: capitalizeFirstLetter(productName), productPrice, unit
        });
        loadProducts(dispatch);
        /* Swal.fire({
            icon: 'success',
            title: 'Product updated successfully!'
        }); */
    } catch (e) {
        console.error("Error updating product: ", e);
    }
}

const editClientDetails = async (values, cityId, id) => {
    try {
        const { clientName, clientPhoneNo, clientAddress } = values;
        const clientRef = doc(db, "clients", id);
        updateDoc(clientRef, {
            clientName: capitalizeFirstLetter(clientName),
            clientPhoneNo,
            clientAddress: capitalizeFirstLetter(clientAddress),
            cityId
        });
        /*  Swal.fire({
             icon: 'success',
             title: 'Client updated successfully!'
         }); */
    } catch (e) {
        console.error("Error updating client: ", e);
    }
}
const deleteClient = async (id) => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this client!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (response) => {
            if (response) {
                const { isConfirmed } = response;
                if (isConfirmed) {
                    deleteDoc(doc(db, "clients", id));
                    /*  Swal.fire({
                         icon: 'success',
                         title: 'Client deleted successfully!'
                     }); */
                }
            }
        });
    } catch (e) {
        console.error("Error deleting client: ", e);
    }

}

const signInWithEmailAndPassword = async (email, password, dispatch, setloginButtonLoading) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        dispatch({ type: 'AUTHENTICATED_USER', payload: auth.currentUser })
    } catch (err) {
        setloginButtonLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message.split(':')[1].replace('auth/', '')
        });
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        await auth.currentUser.updateProfile({
            displayName: name,
            email: email
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message.split(':')[1].replace('auth/', '')
        });
    }
};

const sendPasswordResetEmail = async (email, navigate) => {
    try {
        await auth.sendPasswordResetEmail(email);
        navigate('/');
        Swal.fire({
            icon: 'success',
            title: 'Password reset link has been sent to your email!'
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message.split(':')[1].replace('auth/', '')
        });
    }
};

const logout = (dispatch) => {
    auth.signOut();
    dispatch({ type: 'LOGOUT' });
};

const loadProducts = async (dispatch) => {
    dispatch({ type: 'LOADING', payload: true });
    db.collection('products').onSnapshot(snap => {
        let products = [];
        snap.docs.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            products = [...products, data];
        });
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        //setProducts(products.length > 0 ? products : null);
        dispatch({ type: 'LOADING', payload: false });
    });
}
const loadOrders = async (dispatch, ordersByDate) => {
    dispatch({ type: 'LOADING', payload: true });
    db.collection('orders').where('orderPlacedOn', '==', ordersByDate).onSnapshot(snap => {
        let orders = [];
        snap.docs.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            orders = [...orders, data];
        });
        dispatch({ type: 'SET_ORDERS', payload: orders });
        dispatch({ type: 'LOADING', payload: false });
    });
}
const deleteProduct = async (id) => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (response) => {
            if (response) {
                const { isConfirmed } = response;
                if (isConfirmed) {
                    await deleteDoc(doc(db, "products", id));
                    /*  Swal.fire({
                         icon: 'success',
                         title: 'Product deleted successfully!'
                     }); */
                }
            }
        });
    } catch (e) {
        console.error("Error deleting client: ", e);
    }
}
const deleteSelectedOrder = async (id) => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (response) => {
            if (response) {
                const { isConfirmed } = response;
                if (isConfirmed) {
                    await deleteDoc(doc(db, "orders", id));
                    Swal.fire({
                        icon: 'success',
                        title: 'Order deleted successfully!'
                    });
                }
            }
        });
    } catch (e) {
        console.error("Error deleting client: ", e);
    }
}
const deleteAllOrders = async (ordersByDate) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover all records place on ${ordersByDate} !`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (response) => {
        if (response) {
            const { isConfirmed } = response;
            if (isConfirmed) {
                const emptyMessages = await db.collection('orders').where('orderPlacedOn', '==', ordersByDate).get()
                const batch = db.batch();
                emptyMessages.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                Swal.fire({
                    icon: 'success',
                    title: 'All orders deleted successfully!'
                });
            }
        }
    });
}
export {
    auth,
    db,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    logout,
    addCityInBusiness,
    addClientInCity,
    editClientDetails,
    deleteClient,
    addNewProduct,
    editProductDetails,
    deleteProduct,
    loadProducts,
    loadOrders,
    placeNewOrder,
    deleteSelectedOrder,
    deleteAllOrders
};