// Gọi productModel
var productModel = require("../../models/product.model");
// Gọi productComboModel
var productComboModel = require("../../models/product_combo.model");
// Gọi orderInfoModel
var orderInfoModel = require("../../models/order_info.model");
// Gọi productModel
var productModel = require("../../models/product.model");
// Gọi productComboModel
var productComboModel = require("../../models/product_combo.model");

// Gọi formatStringHelper
var formatStringHelper = require("../../helpers/format_string_hide.helper");
// Gọi formatPrice
var formatPriceHelper = require("../../helpers/format_price.helper");

module.exports.orderInfoShow = function(req, res, next) {
  try {
    // Lấy user hiện tại
    var customerId = res.locals.authUser.ID;

    var isHaveType1 = true;
    var isHaveType2 = true;
    var isHaveType3 = true;
    var isHaveType4 = true;

    var quantityHaveType1 = 0;
    var quantityHaveType2 = 0;
    var quantityHaveType3 = 0;
    var quantityHaveType4 = 0;

    Promise.all([
      orderInfoModel.topNOrderInfoFollowIdCustomerAndOrderStatusIdAndOffset(
        customerId,
        1,
        6,
        0
      ),
      orderInfoModel.topNOrderInfoFollowIdCustomerAndOrderStatusIdAndOffset(
        customerId,
        2,
        6,
        0
      ),
      orderInfoModel.topNOrderInfoFollowIdCustomerAndOrderStatusIdAndOffset(
        customerId,
        3,
        6,
        0
      ),
      orderInfoModel.topNOrderInfoFollowIdCustomerAndOrderStatusIdAndOffset(
        customerId,
        4,
        6,
        0
      ),
      orderInfoModel.quantityOrderInfoFollowIdCustomerAndOrderStatusId(
        customerId,
        1
      ),
      orderInfoModel.quantityOrderInfoFollowIdCustomerAndOrderStatusId(
        customerId,
        2
      ),
      orderInfoModel.quantityOrderInfoFollowIdCustomerAndOrderStatusId(
        customerId,
        3
      ),
      orderInfoModel.quantityOrderInfoFollowIdCustomerAndOrderStatusId(
        customerId,
        4
      ),
      productModel.topNProductBestSalerFollowOffset(4, 0),
      productComboModel.topNProductComboBestSalerFollowOffset(3, 0)
    ]).then(values => {
      // console.log("TCL: module.exports.showOrderInfo -> values", values)
      if (values[0].length === 0) isHaveType1 = false;

      if (values[1].length === 0) isHaveType2 = false;

      if (values[2].length === 0) isHaveType3 = false;

      if (values[3].length === 0) isHaveType4 = false;

      quantityHaveType1 = +values[4][0].QUANTITY;
      //console.log("TCL: module.exports.orderInfoShow -> values[4][0].QUANTITY", values[4][0].QUANTITY)
      quantityHaveType2 = +values[5][0].QUANTITY;
      quantityHaveType3 = +values[6][0].QUANTITY;
      quantityHaveType4 = +values[7][0].QUANTITY;

      res.render("customer/order-info-show", {
        layout: "main-customer.hbs",
        orderInfoType1: values[0],
        orderInfoType2: values[1],
        orderInfoType3: values[2],
        orderInfoType4: values[3],
        products: values[8],
        productsCombo: values[9],
        isHaveType1: isHaveType1,
        isHaveType2: isHaveType2,
        isHaveType3: isHaveType3,
        isHaveType4: isHaveType4,
        quantityHaveType1: quantityHaveType1,
        quantityHaveType2: quantityHaveType2,
        quantityHaveType3: quantityHaveType3,
        quantityHaveType4: quantityHaveType4,
        helpers: {
          // Hàm định dạng title của product simple lấy 36 kí tự
          formatTitleProductSimple: formatStringHelper.formatTitleProductSimple,
          // Hàm định dạng title của product combo lấy 52 kí tự
          formatTitleProductCombo: formatStringHelper.formatTitleProductCombo
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.orderDetailShow = function(req, res, next) {
  try {
    var orderInfoId = req.body.orderInfoId;

    Promise.all([
      orderInfoModel.allRowProductSimpleFollowID(orderInfoId),
      orderInfoModel.allRowProductComboFollowID(orderInfoId)
    ]).then(values => {
      for (productSimple of values[0]) {
        productSimple.TOTALMONEY = formatPriceHelper(productSimple.TOTALMONEY);

        // Tên của sản phẩm
        productSimple.FORMATNAME = formatStringHelper.formatTitleProductForCartDetail(
          productSimple.NAME
        );
      }

      for (productCombo of values[1]) {
        productCombo.TOTALMONEY = formatPriceHelper(productCombo.TOTALMONEY);

        // Tên của sản phẩm
        productCombo.FORMATNAME = formatStringHelper.formatTitleProductForCartDetail(
          productCombo.NAME
        );
      }

      res.json({
        productsSimple: JSON.stringify(values[0]),
        productsCombo: JSON.stringify(values[1])
      });
    });
  } catch (error) {
    next(error);
  }
};