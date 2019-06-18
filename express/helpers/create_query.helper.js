
//Tạo chuỗi query
module.exports.createQuerySimple = function(catID,subCatID,brandID,name) {
    console.log(catID, subCatID, brandID, name);
    var data = {
        'catId': catID,
        'subCatId': subCatID,
        'brandId': brandID,
        'name': name
    };
    var query = encodeQueryData(data);
    if(query !=""){
        query = `&${query}`;
    }
    console.log(query);
    return query;
};

//Tạo chuỗi query
module.exports.createQueryCombo = function(name, nameSimple) {
    var data = {
        'name': name,
        'nameSimple': nameSimple
    };
    var query = encodeQueryData(data);
    if(query !=""){
        query = `&${query}`;
    }
    return query;
};


function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        if (data[d] != 0) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
    return ret.join('&');
}