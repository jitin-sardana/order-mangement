import "./App.css";
import { Grid, Container }  from '@material-ui/core';
import TopBar from './CommonComponents/TopBar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Reset from "./Authentication/Reset";
import Dashboard from "./Dashboard/Dashboard";
import Shops from "./Shops/Shops";
import ProductList from "./Products/ProductList";
import AddOrder from "./Orders/AddOrder";
import OrderList from "./Orders/OrderList";
import ViewBill from "./Orders/ViewBill";

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div className="app">
      <Container fixed>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Router>
              <TopBar />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/place-order" element={<AddOrder />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/bill" element={<ViewBill />} />
              </Routes>
            </Router>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default App;