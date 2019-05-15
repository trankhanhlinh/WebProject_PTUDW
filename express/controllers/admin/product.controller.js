// Gọi productmodel
var productModel = require("../../models/product.model");
// Gọi branchModel
var brandModel = require("../../models/brand.model");
// Gọi categoryModel
var categoryModel = require("../../models/category.model");
// Gọi categoryLv2Model
var categoryLv2Model = require("../../models/category_level_2.model");

// Thêm dữ liệu vào trang product
module.exports.productShow = function(req, res) {
  // Lấy dữ liệu sản phẩm
  var dataProducts = productModel.allProduct();

  // Lấy dữ liệu nhãn hiệu
  var dataBrands = brandModel.allBrand();

  // Lấy dữ liệu category1
  var dataCategoryLv1 = categoryModel.allCategory_lv1();
  
  // Lấy dữ liệu category2
  var dataCategoryLv2 = categoryLv2Model.allCategory_lv2(1);

  dataProducts.then(products => {
    dataBrands.then(brands => {
      dataCategoryLv1.then(categorylv1 => {
        dataCategoryLv2.then(categorylv2 => {
          res.locals.sidebar[4].active = true;

          //Truyền vào trong UI
          res.render("admin/product-show", {
            layout: "main-admin.hbs",
            brands: brands,
            products: products,
            categorylv1s: categorylv1,
            categorylv2s: categorylv2
          });
        });
      });
    });
  });
};

//Xử lý post từ productadd
module.exports.productAddNew = function(req, res) {
  console.log(req.body);
};

//Thêm dữ liệu vào trang productadd
module.exports.productAdd = function(req, res) {
  //Lấy dữ liệu nhãn hiệu
  var dataBrands = productModel.allBrand();

  //Lấy dữ liệu category1
  var dataCategoryLv1 = productModel.allCategory_lv1();
  //Lấy dữ liệu category2
  var dataCategoryLv2 = productModel.allCategory_lv2(1);

  dataBrands.then(brands => {
    dataCategoryLv1.then(categorylv1 => {
      dataCategoryLv2.then(categorylv2 => {
        res.locals.sidebar[5].active = true;

        //Truyền vào trong UI
        res.render("admin/product-add", {
          layout: "main-admin.hbs",
          brands: brands,
          categorylv1s: categorylv1,
          categorylv2s: categorylv2
        });
      });
    });
  });
};
