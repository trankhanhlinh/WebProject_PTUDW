require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");

var customerIndexRoute = require("./routes/customer/index.route");
var customerProductRoute = require("./routes/customer/product.route");
var customerInfoRoute = require("./routes/customer/info.route");
var customerCartRoute = require("./routes/customer/cart.route");

var adminIndexRoute = require("./routes/admin/index.route");
var adminProductRoute = require("./routes/admin/product.route");
var adminInfoRoute = require("./routes/admin/info.route");
var adminCustomerRoute = require("./routes/admin/customer.route");
var adminReportRoute = require("./routes/admin/report.route");
var adminOrderRoute = require("./routes/admin/order.route");
var adminCommentRoute = require("./routes/admin/comment.route");
var adminAuthRoute = require("./routes/admin/auth.route");

// var apiProductRoute = require('./api/routes/product.route');
// var apiUserRoute = require('./api/routes/user.route')

var adminAuthMiddleware = require("./middlewares/admin/auth.middleware");
var adminSidebarActiveMiddleware = require("./middlewares/admin/sidebar/active.middleware");
var adminSidebarQuantityBadgeMiddleware = require("./middlewares/admin/sidebar/quantity_badge.middleware");

var customerCategoryMiddleware = require("./middlewares/customer/category.middleware");
// var sessionMiddleware = require('./middlewares/session.middleware');

var format_money = require("./helpers/format_money");
var comment_stars = require("./helpers/comment_stars");
var select_selected = require("./helpers/select_selected");

var port = 3000;

var app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
//app.use(sessionMiddleware);

const hbs = exphbs.create({
  layoutsDir: "views/_layouts",

  // create custom helpers
  helpers: {
    format_money: format_money,
    comment_stars: comment_stars,
    select_selected: select_selected
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use("/admin/auth", adminAuthRoute);

/* admin */
// // Mdw kiểm tra admin
// app.use(adminAuthMiddleware.requireAuth);
// Mdw sidebar
// app.use(adminSidebarActiveMiddleware);
// app.use(adminSidebarQuantityBadgeMiddleware);
/* admin */

/* customer */

// // Mdw hiển thị category
// app.use(customerCategoryMiddleware);
/* customer */

app.use("/customer/index", customerCategoryMiddleware, customerIndexRoute);
app.use("/customer/product", customerCategoryMiddleware, customerProductRoute);
app.use("/customer/info", customerCategoryMiddleware, customerInfoRoute);
app.use("/customer/cart", customerCategoryMiddleware, customerCartRoute);

app.use(
  "/admin/index",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminIndexRoute
);
app.use(
  "/admin/product",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminProductRoute
);
app.use(
  "/admin/info",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminInfoRoute
);
app.use(
  "/admin/customer",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminCustomerRoute
);
app.use(
  "/admin/report",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminReportRoute
);
app.use(
  "/admin/order",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminOrderRoute
);
app.use(
  "/admin/comment",
  adminAuthMiddleware.requireAuth,
  adminSidebarActiveMiddleware,
  adminSidebarQuantityBadgeMiddleware,
  adminCommentRoute
);

// app.get('/',function( req, res) {
// 	res.render('login');
// });

// app.get('/404NotFound',function( req, res) {
// 	res.render('404NotFound');
// });

// app.use('/users', authMiddleware.requireAuth, userRoute);
// app.use('/products', productRoute);
//app.use('/admin/auth', authRoute);
// app.use('/cart', cartRoute);
// app.use('/api/products',apiProductRoute);
// app.use('/api/users',apiUserRoute);

app.listen(port, function() {
  console.log("Server listening on port" + port);
});
