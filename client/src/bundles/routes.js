import { createRouteBundle } from 'redux-bundler'

// import Landing from '../pages/landing'
// import SignIn from '../pages/signIn'
// import CreateOrder from '../pages/createOrder'
// import MyOrders from '../pages/myOrders'
// import Profile from '../pages/profile'
// import AcceptInvitation from '../pages/acceptInvitation'
// import CreateInvitation from '../pages/createInvitation'
// import CreateSupplier from '../pages/createSupplier'
// import MySuppliers from '../pages/mySuppliers'
// import SupplierProfile from '../pages/supplierProfile'
// import MyGroup from '../pages/myGroup'
// import SignUp from '../pages/signUp'
// import SupplierProducts from '../pages/supplierProducts'
// import NewProduct from '../pages/newProduct'
// import EditProduct from '../pages/editProduct'
// import AddWants from '../pages/addWants'
// import Order from '../pages/order'
// import OrderConfirmation from '../pages/orderConfirmation'

import Home from '../pages/home'

const routes = {
  '': {
    component: Home,
    protected: true
  },
  '/': {
    component: Home,
    protected: true
  },
  // 'sign-in': {
  //   component: SignIn,
  //   protected: false
  // },
  // 'sign-up': {
  //   component: SignUp,
  //   protected: false
  // },
  // 'orders/new': {
  //   component: CreateOrder,
  //   protected: true
  // },
  // 'orders': {
  //   component: MyOrders,
  //   protected: true
  // },
  // 'my-profile': {
  //   component: Profile,
  //   protected: true
  // },
  // 'accept-invitation': {
  //   component: AcceptInvitation,
  //   protected: true
  // },
  // 'create-invitation': {
  //   component: CreateInvitation,
  //   protected: true
  // },
  // 'create-supplier': {
  //   component: CreateSupplier,
  //   protected: true
  // },
  // 'suppliers': {
  //   component: MySuppliers,
  //   protected: true
  // },
  // 'suppliers/:supplierId': {
  //   component: SupplierProfile,
  //   protected: true
  // },
  // 'my-group': {
  //   component: MyGroup,
  //   protected: true
  // },
  // 'suppliers/:supplierId/products': {
  //   component: SupplierProducts,
  //   protected: true
  // },
  // 'suppliers/:supplierId/products/new': {
  //   component: NewProduct,
  //   protected: true
  // },
  // 'products/:productId': {
  //   component: EditProduct,
  //   protected: true
  // },
  // 'orders/:orderId/wants': {
  //   component: AddWants,
  //   protected: true
  // },
  // 'orders/:orderId': {
  //   component: Order,
  //   protected: true
  // },
  // 'orders/:orderId/confirmation': {
  //   component: OrderConfirmation,
  //   protected: true
  // },
  '*': {
    component: Home,
    protected: false
  }

}

export default createRouteBundle({
  ...routes
}, {
  routeInfoSelector: 'selectHash'
})
