// Gọi productModel
var productModel = require("../../models/product.model");
// Gọi productComboModel
var productComboModel = require("../../models/product_combo.model");
// Gọi categoryModel
var categoryModel = require("../../models/category.model");
// Gọi newsModel
var newsModel = require("../../models/news.model");
// Gọi sessionCartModel
var sessionCartModel = require("../../models/session_cart.model");
// Gọi tagModel
var tagModel = require("../../models/tag.model");

// Gọi formatStringHelper
var formatStringHelper = require("../../helpers/format_string_hide.helper");
// Gọi convertToDateHelper
var convertToDateHelper = require("../../helpers/convert_to_date.helper");
// Gọi formatPrice
var formatPriceHelper = require("../../helpers/format_price.helper");

async function getAllTagForNews(arrNews) {
  for (news of arrNews) {
    var result = await tagModel.allTagFollowInfoId(news.ID);
    news.tags = result;
  }

  return arrNews;
}

module.exports.indexShow = function(req, res, next) {
  try {
    Promise.all([
      productModel.topNProductBestSalerFollowOffset(8, 0),
      productComboModel.topNProductComboBestSalerFollowOffset(6, 0),
      categoryModel.allCategory(),
      newsModel.topNNewestNews(3)
    ]).then(values => {
      getAllTagForNews(values[3]).then(result => {     
        res.render("customer/index", {
          layout: "main-customer.hbs",
          products: values[0],
          productsCombo: values[1],
          categories: values[2],
          news: result,
          helpers: {
            // Hàm định dạng title của product simple lấy 36 kí tự
            formatTitleProductSimple:
              formatStringHelper.formatTitleProductSimple,
            // Hàm định dạng title của product combo lấy 52 kí tự
            formatTitleProductCombo: formatStringHelper.formatTitleProductCombo,
            // Hàm định dạng title của info lấy 85 kí tự
            formatTitleInfo: formatStringHelper.formatTitleInfo,
            // Hàm định dạng short content của info lấy 320 kí tự
            formatShortContentInfo: formatStringHelper.formatShortContentInfo
          }
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loadMoreProductSimple = function(req, res, next) {
  // Get offset
  var offset = req.body.offset;

  try {
    Promise.all([
      productModel.topNProductBestSalerFollowOffset(8, offset)
    ]).then(values => {
      // Định dạng lại để đưa kết quả trả về cho lệnh ajax
      for (productSimple of values[0]) {
        // Giá
        productSimple.PRICE = formatPriceHelper(productSimple.PRICE);
        productSimple.SALEPRICE = formatPriceHelper(productSimple.SALEPRICE);

        // Tên của sản phẩm
        productSimple.FORMATNAME = formatStringHelper.formatTitleProductSimple(
          productSimple.NAME
        );
      }

      res.json(JSON.stringify(values[0]));
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loadMoreProductCombo = function(req, res, next) {
  // Get offset
  var offset = req.body.offset;

  try {
    Promise.all([
      productComboModel.topNProductComboBestSalerFollowOffset(6, offset)
    ]).then(values => {
      //console.log("TCL: module.exports.loadMoreProductCombo -> values[0]", values[0])
      // console.log("TCL: module.exports.loadMoreProductCombo ->  values[0]",  values[0])
      // Định dạng lại để đưa kết quả trả về cho lệnh ajax
      for (productCombo of values[0]) {
        // Giá
        productCombo.PRICE = formatPriceHelper(productCombo.PRICE);
        productCombo.SALEPRICE = formatPriceHelper(productCombo.SALEPRICE);

        // Tên của sản phẩm
        productCombo.FORMATNAME = formatStringHelper.formatTitleProductSimple(
          productCombo.NAME
        );
      }

      res.json(JSON.stringify(values[0]));
    });
  } catch (error) {
    next(error);
  }
};

// module.exports.addProductToSession = function(req, res, next) {
//   try {
//     // Lấy ID của product simple
//     var productId = req.params.idProductSimple;
//     // Lấy ID của product combo
//     var sessionId = req.signedCookies.sessionId;

//     // Đối tượng session cart danh cho product
//     var session_cart = {
//       ID: sessionId,
//       PRODUCT_ID: productId,
//       PRODUCT_COMBO_ID: 0,
//       QUANTITY: 1,
//       IS_LOGIN: 0
//     };

//     sessionCartModel.allRowFollowID(sessionId).then(sessionCarts => {
//       // var isFind = false;
//       var index = sessionCarts.findIndex(
//         sessionCart =>
//           sessionCart.PRODUCT_COMBO_ID == session_cart.PRODUCT_COMBO_ID &&
//           sessionCart.PRODUCT_ID == session_cart.PRODUCT_ID &&
//           sessionCart.ID == session_cart.ID
//       );

//       if (index === -1) {
//         sessionCartModel.addSessionCart(session_cart).then(result => {
//           res.redirect("/customer/index");
//         });
//       } else {
//         // Tăng quantity lên 1 đơn vị
//         session_cart.QUANTITY = ++sessionCarts[index].QUANTITY;

//         sessionCartModel.update3PrimaryKey(session_cart).then(result => {
//           console.log(result);
//           res.redirect("/customer/index");
//         });
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports.addProductComboToSession = function(req, res, next) {
//   try {
//     // Lấy ID của product simple
//     var productComboId = req.params.idProductCombo;
//     // Lấy ID của product combo
//     var sessionId = req.signedCookies.sessionId;

//     // Đối tượng session cart danh cho product
//     var session_cart = {
//       ID: sessionId,
//       PRODUCT_ID: 0,
//       PRODUCT_COMBO_ID: productComboId,
//       QUANTITY: 1,
//       IS_LOGIN: 0
//     };

//     sessionCartModel.allRowFollowID(sessionId).then(sessionCarts => {
//       var index = sessionCarts.findIndex(
//         sessionCart =>
//           sessionCart.PRODUCT_COMBO_ID == session_cart.PRODUCT_COMBO_ID &&
//           sessionCart.PRODUCT_ID == session_cart.PRODUCT_ID &&
//           sessionCart.ID == session_cart.ID
//       );

//       if (index === -1) {
//         sessionCartModel.addSessionCart(session_cart).then(result => {
//           res.redirect("/customer/index");
//         });
//       } else {
//         // Tăng quantity lên 1 đơn vị
//         session_cart.QUANTITY = ++sessionCarts[index].QUANTITY;

//         sessionCartModel.update3PrimaryKey(session_cart).then(result => {
//           console.log(result);
//           res.redirect("/customer/index");
//         });
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
