// Lấy database
var db = require("../utils/db");

//hàm trả về danh sách tất cả category lv 1
module.exports.allCategory = () => {
  return db.load(`SELECT * FROM category ORDER BY ID ASC`);
};

// Hàm trả về sản phẩm lọc theo tiêu chí trong database có phân trang
module.exports.pageAllCategoryFilter = (limit, offset, objQuery) => {
  // Gọi hàm querry từ db
  var query = "";
  if (objQuery.Name != "") {
    query += ` MATCH (NAME) AGAINST ('${objQuery.Name}' IN NATURAL LANGUAGE MODE) \n`;
    return db.load(`SELECT * FROM category WHERE ${query} ORDER BY ID ASC limit ${limit} offset ${offset}`);
  } else {
    return db.load(`SELECT * FROM category ORDER BY ID ASC limit ${limit} offset ${offset}`);
  }
};

// Hàm lấy số lượng sản phẩm product simple có status = 1
module.exports.quantityCategoryActive = (objQuery) => {
  // Gọi hàm querry từ db
  var query = "";
  if (objQuery.Name != "") {
    query += ` MATCH (NAME) AGAINST ('${objQuery.Name}' IN NATURAL LANGUAGE MODE) \n`;
    return db.load(`SELECT COUNT(*) AS QUANTITY FROM category WHERE ${query}`);
  } else {
    return db.load(`SELECT COUNT(*) AS QUANTITY FROM category`);
  }
};

// Hàm trả về danh sách tất cả category và số lượng sản phẩm thuộc category đó
module.exports.allWithDetailQuantity = () => {
  return db.load(`SELECT cat_pro.ID AS IDCAT, cat_pro.NAME AS NAMECAT, sub_cat.ID AS IDSUB, sub_cat.NAME AS NAMESUB, 
  cat_pro.quantityCat AS QUANTITYCAT, count(pro2.ID) as QUANTITYSUB
	FROM (sub_category sub_cat LEFT JOIN product pro2 ON sub_cat.ID = pro2.SUBCATEGORYID) RIGHT JOIN 
	(SELECT cat.ID, cat.NAME, count(pro2.ID) as quantityCat 
	FROM category cat LEFT JOIN product pro2 ON cat.ID = pro2.CATEGORYID 
	GROUP BY cat.ID, cat.NAME) AS cat_pro 
	ON sub_cat.CATEGORYID = cat_pro.ID
	GROUP BY cat_pro.ID, cat_pro.NAME, sub_cat.ID, sub_cat.NAME, cat_pro.quantityCat`);
};

// Lấy số lượng
module.exports.categoriesQuantity = () => {
  return db.load(`SELECT COUNT(ID) AS CATEGORY_QUANTITY FROM category`);
};

module.exports.singleById = categoryId => {
  return db.load(`SELECT * FROM category where ID = '${categoryId}'`);
};

module.exports.addCategory = category => {
  return db.add("category", category);
};

module.exports.updateCategory = category => {
  return db.update("category", "ID", category);
};

// Xóa category theo id
module.exports.deleteCategoryByCategoryId = categoryId => {
  return db.delete("category", "ID", categoryId);
};


