$(document).ready(function() {
  // Kiểm tra xem có sản phẩm nào trong giỏ hàng không
  checkHaveProductInCart();

  sumPriceInFastCart();

  // Add product simple in cart
  $(document).on("click", "#containProductSimple div div #aAddProductSimple", function() {
    var $idProductToCart = $(this).attr("id-product-to-cart");
    var $id = $(this).attr("id-product-simple");

    $.post(
      "/customer/cart/add-product-in-cart",
      { productId: $id, quantityProduct: 1, isSimple: true }, 
      function(data) {
        if (data === "success") {
          addProductSimpleToCart($idProductToCart, $id);
          checkHaveProductInCart();
          sumPriceInFastCart();
        }
        else if (data === "notEnough") {
          $("#not-enough-product-modal").modal();
        }
      }
    );
  });

  // Add product combo in cart
  $(document).on("click", "#containProductCombo div div #aAddProductCombo", function()  {
    var $idProductToCart = $(this).attr("id-product-to-cart");
    var $id = $(this).attr("id-product-combo");

    $.post(
      "/customer/cart/add-product-in-cart",
      { productId: $id,  quantityProduct: 1, isSimple: false },
      function(data) {
        if (data === "success") {
          addProductComboToCart($idProductToCart, $id);
          checkHaveProductInCart();
          sumPriceInFastCart();
        }
        else if (data === "notEnough") {
          $("#not-enough-product-modal").modal();
        }
      }
    );
  });

  // Remove product simple in cart
  $(document).on("click", "#containProductSimpleInCart #btnDeleteQuantitySimple", function() {
    var $idQuantityCart = $(this).attr("id-quantity-cart");
    var $id = $(this).attr("id-quantity-simple");

    $.post(
      "/customer/cart/remove-product-in-cart",
      { productId: $id, isSimple: true },
      function(data) {
        if (data === "success") {
          removeProductSimpleToCart($idQuantityCart, $id);
          checkHaveProductInCart();
          sumPriceInFastCart();
        }
      }
    );
  });

  // Remove product combo in cart
  $(document).on("click", "#containProductComboInCart #btnDeleteQuantityCombo", function()  {
    var $idQuantityCart = $(this).attr("id-quantity-cart");
    var $id = $(this).attr("id-quantity-combo");

    $.post(
      "/customer/cart/remove-product-in-cart",
      { productId: $id, isSimple: false },
      function(data) {
        if (data === "success") {
          removeProductComboToCart($idQuantityCart, $id);
          checkHaveProductInCart();
          sumPriceInFastCart();
        }
      }
    );
  });

  function sumPriceInFastCart() {
    var sumPrice = 0;
    // Lặp tìm vị trí product cần xóa
    $(".component-show-fast-cart-items #containPriceAndQuantity").each(function() {
      var $id = $(this).attr("id-quantity-cart");

      var priceProduct = Number(
        $(`.component-show-fast-cart-items #spanPriceInRow[id-quantity-cart-price=${$id}]`)
          .text()
          .replace(/[^0-9.-]+/g, "")
      );

      var quantity =  Number(
        $(`.component-show-fast-cart-items #spanQuantityProduct[id-quantity-cart=${$id}]`)
          .text()
      );

      sumPrice += priceProduct * quantity;
    });

    $("#spanSumPriceInFastCart").text(
      String(sumPrice).replace(/(.)(?=(\d{3})+$)/g, "$1,")
    );
  }

  function checkHaveProductInCart() {
    if (
      $("#containProductSimpleInCart").children().length +
        $("#containProductComboInCart").children().length >
      0
    ) {
      $("#parentContainQuantityProduct").css("display", "");
    } else {
      $("#parentContainQuantityProduct").css("display", "none");
    }
  }

  function addProductSimpleToCart(idProductToCart, id) {
    // Lấy tên của sản phẩm
    var title = $(
      `#containProductSimple div div[id-product-to-cart=${idProductToCart}]`
    ).attr("title");

    var formatTitle = title;
    if (title.length > 25) formatTitle = title.substr(0, 25) + "...";

    // Lấy đường dẫn của ảnh
    var src = $(
      `#containProductSimple div img[id-product-to-cart=${idProductToCart}]`
    ).attr("src");
    // Lấy giá tiền
    var salePrice = $(
      `#containProductSimple div span[id-product-to-cart=${idProductToCart}]`
    ).text();

    // Tăng số lượng trong giỏ hàng
    $("#pQuantityProduct").text(+$("#pQuantityProduct").text() + 1);

    var isNewProductInCart = true;
    $("#containProductSimpleInCart .component-show-fast-cart-items").each(
      function() {
        var $id = $(this).attr("id-quantity-cart");

        // Có tồn tại hàng sản phẩm này trong giỏ hàng
        if ($id === idProductToCart) {
          isNewProductInCart = false;
        }
      }
    );

    // Có tồn tại hàng sản phẩm này trong giỏ hàng
    if (isNewProductInCart === false) {
      $(
        `#containProductSimpleInCart span[id-quantity-cart=${idProductToCart}]`
      ).text(
        +$(
          `#containProductSimpleInCart span[id-quantity-cart=${idProductToCart}]`
        ).text() + 1
      );
    }
    // Không tồn tại sản phẩm này trong giỏ hàng
    else {
      $("#containProductSimpleInCart").append(`
        <div class="component-show-fast-cart-items" id-quantity-cart="${idProductToCart}">
        <div class="d-flex align-items-center pl-3 pr-3 pb-3">
            <div class="position-relative product-image" data-toggle="tooltip"
                title="${title}">
                <a class="stretched-link"
                    href="/customer/product/product-detail/product-simple/${idProductToCart}"></a>
                <img src="${src}" class="mt-3 w-100 h-100" alt="" />
            </div>
 
            <div class="product-info text-left">
                <a href="/customer/product/product-detail/product-simple/${idProductToCart}"
                    class="title text-decoration-none" data-toggle="tooltip"
                    title="${title}">${formatTitle}</a>
 
                <div class="price mt-2" id="containPriceAndQuantity" id-quantity-cart="${idProductToCart}">
                    <span id="spanPriceInRow"
                    id-quantity-cart-price="${idProductToCart}">${salePrice}</span>
                    <span><u>đ</u></span>
                    &nbsp;
                    <span>x</span>
                    <span id-quantity-cart="${idProductToCart}" id="spanQuantityProduct" id="${id}"
                    >1</span>
                </div>
            </div>
 
            <div class="product-delete text-right">
                <button id="btnDeleteQuantitySimple" id-quantity-simple=${id} id-quantity-cart="${idProductToCart}" class="p-0 border-0" data-toggle="tooltip" title="Xóa">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <hr class="m-0 ml-2 mr-2" />
        </div>`);
    }
  }

  function addProductComboToCart(idProductToCart, id) {
    // Lấy tên của sản phẩm
    var title = $(
      `#containProductCombo div div[id-product-to-cart=${idProductToCart}]`
    ).attr("title");

    var formatTitle = title;
    if (title.length > 25) formatTitle = title.substr(0, 25) + "...";
    // Lấy đường dẫn của ảnh
    var src1 = $(
      `#containProductCombo div img[id-product-to-cart-src-1=${idProductToCart}]`
    ).attr("src");
    var src2 = $(
      `#containProductCombo div img[id-product-to-cart-src-2=${idProductToCart}]`
    ).attr("src");
    var src3 = $(
      `#containProductCombo div img[id-product-to-cart-src-3=${idProductToCart}]`
    ).attr("src");
    // Lấy giá tiền
    var salePrice = $(
      `#containProductCombo div span[id-product-to-cart=${idProductToCart}]`
    ).text();

    // Tăng số lượng trong giỏ hàng
    $("#pQuantityProduct").text(+$("#pQuantityProduct").text() + 1);

    var isNewProductInCart = true;
    $("#containProductComboInCart .component-show-fast-cart-items").each(
      function() {
        var $id = $(this).attr("id-quantity-cart");
        //console.log("TCL: addProductToCart -> id", id)

        // Có tồn tại hàng sản phẩm này trong giỏ hàng
        if ($id === idProductToCart) {
          isNewProductInCart = false;
        }
      }
    );

    // Có tồn tại hàng sản phẩm này trong giỏ hàng
    if (isNewProductInCart === false) {
      $(
        `#containProductComboInCart span[id-quantity-cart=${idProductToCart}]`
      ).text(
        +$(
          `#containProductComboInCart span[id-quantity-cart=${idProductToCart}]`
        ).text() + 1
      );
    }
    // Không tồn tại sản phẩm này trong giỏ hàng
    else {
      $("#containProductComboInCart").append(`
      <div class="component-show-fast-cart-items" id-quantity-cart="${idProductToCart}">
      <div class="d-flex align-items-center pl-3 pr-3 pb-3">
          <div class="position-relative product-image-combo pt-3 pb-3" data-toggle="tooltip"
              title="${title}">
              <a class="stretched-link"
                  href="/customer/product/product-detail/product-combo/{{ID}}"></a>
              <img src="${src1}" class="image-combo"
                  alt="" />
              <img src="${src2}" class="image-combo"
                  alt="" />
              <img src="${src3}" class="image-combo"
                  alt="" />
          </div>

          <div class="product-info text-left">
              <a href="/customer/product/product-detail/product-combo/{{ID}}"
                  class="title text-decoration-none" data-toggle="tooltip"
                  title="${title}">${formatTitle}</a>

              <div class="price mt-2" id="containPriceAndQuantity" id-quantity-cart="${idProductToCart}">
                  <span id="spanPriceInRow"
                  id-quantity-cart-price="${idProductToCart}">${salePrice}</span>
                  <span><u>đ</u></span>
                  &nbsp;
                  <span>x</span>
                  <span id="spanQuantityProduct"
                  id-quantity-cart="${idProductToCart}">1</span>
              </div>
          </div>

          <div class="product-delete text-right">
              <button id="btnDeleteQuantityCombo" id-quantity-combo=${id} id-quantity-cart="${idProductToCart}" class="p-0 border-0" data-toggle="tooltip" title="Xóa">
                  <i class="fas fa-times"></i>
              </button>
          </div>
        </div>
        <hr class="m-0 ml-2 mr-2" />
      </div>`);
    }
  }

  function removeProductSimpleToCart(idQuantityCart, id) {
    // Lấy số lượng có của sản phẩm này.
    var quantityProduct = +$(
      `#containProductSimpleInCart span[id-quantity-cart=${idQuantityCart}]`
    ).text();

    // Giảm số lượng sản phẩm đã xóa trong giỏ hàng
    $("#pQuantityProduct").text(
      +$("#pQuantityProduct").text() - quantityProduct
    );

    $("#containProductSimpleInCart .component-show-fast-cart-items").each(
      function() {
        var $id = $(this).attr("id-quantity-cart");

        // Có tồn tại hàng sản phẩm này trong giỏ hàng
        if ($id === idQuantityCart) {
          $(this).remove();

          return false;
        }
      }
    );
  }

  function removeProductComboToCart(idQuantityCart, id) {
    // Lấy số lượng có của sản phẩm này.
    var quantityProduct = +$(
      `#containProductComboInCart span[id-quantity-cart=${idQuantityCart}]`
    ).text();

    // Giảm số lượng sản phẩm đã xóa trong giỏ hàng
    $("#pQuantityProduct").text(
      +$("#pQuantityProduct").text() - quantityProduct
    );

    $("#containProductComboInCart .component-show-fast-cart-items").each(
      function() {
        var $id = $(this).attr("id-quantity-cart");

        // Có tồn tại hàng sản phẩm này trong giỏ hàng
        if ($id === idQuantityCart) {
          $(this).remove();

          return false;
        }
      }
    );
  }
});
