"use strict";

var jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
var content = document.getElementById('content');
var pageid = document.getElementById('pageid');
var jsonData = {}; //這邊不管是用陣列[]或是用物件{}都可以

function getData() {
  axios.get(jsonUrl).then(function (response) {
    jsonData = response.data.result.records; // console.log(jsonData);

    pagination(jsonData, 1);
  });
}

getData();

function pagination(jsonData, nowPage) {
  console.log(nowPage); // 取得全部資料長度

  var dataTotal = jsonData.length; //console.log(dataTotal);
  // 設定要顯示在畫面上的資料數量
  // 預設每一頁只顯示5筆資料

  var perpage = 5; //console.log(`全部資料:${dataTotal} 每一頁顯示:${perpage}筆`);
  // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
  // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。

  var pageTotal = Math.ceil(dataTotal / perpage);
  console.log("\u5168\u90E8\u8CC7\u6599:".concat(dataTotal, " \u6BCF\u4E00\u9801\u986F\u793A:").concat(perpage, "\u7B46 \u7E3D\u9801\u6578").concat(pageTotal)); // 當前頁數，對應現在當前頁數

  var currentPage = nowPage; // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
  // 所以要在寫入一個判斷避免這種狀況。
  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況，例如：nowPage 突然發神經？！

  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  } // 由前面可知最小數字為6，所以用答案來回推公式


  var minData = currentPage * perpage - perpage + 1;
  var maxData = currentPage * perpage; // 先建立新陣列

  var data = []; // 這邊將會使用 ES6 forEach 做資料處理
  // 首先必須使用索引來判斷資料位子，所以要使用index

  jsonData.forEach(function (item, index) {
    //獲取陣列索引，但因為索引是從 0 開始所以要 +1
    var num = index + 1; // 這邊判斷式會稍微複雜一點
    // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。

    if (num >= minData && num <= maxData) {
      data.push(item);
    }
  }); //因為要將分頁相關資訊傳到另一個 function做處理，所以將page相關所需要的東西改用物件傳遞。
  // 用物件方式傳遞資料

  var page = {
    pageTotal: pageTotal,
    currentPage: currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal
  }; // console.log(page);

  displayData(data);
  pageBtn(page);
} // 將卡片資料渲染到頁面上


function displayData(data) {
  var str = '';
  data.forEach(function (item) {
    str += "\n        <div class=\"col-md-6 py-2 px-1\">\n        <div class=\"card\">\n          <div class=\"card bg-dark text-white text-left\">\n            <img class=\"card-img-top bg-cover\" height=\"200px\" src=\"".concat(item.Picture1, "\">\n            <div \n            class=\"\n                    card-img-overlay\n                    d-flex\n                    justify-content-between\n                    align-items-end \n                    p-0\n                    px-3\n                    \"\n            style=\"\n                    background-color:rgba(0, 0, 0, .2)\n                  \"\n            >\n              <h5 class=\"card-img-title-lg\">").concat(item.Name, "</h5>\n              <h5 class=\"card-img-title-sm\">").concat(item.Zone, "</h5>  \n            </div>\n          </div>\n          <div class=\"card-body text-left\">\n            <p class=\"card-p-text\"><i class=\"far fa-clock fa-clock-time\"></i>&nbsp;").concat(item.Opentime, "</p>\n            <p class=\"card-p-text\"><i class=\"fas fa-map-marker-alt fa-map-gps\"></i>&nbsp;").concat(item.Add, "</p>\n            <div class=\"d-flex justify-content-between align-items-end\">\n              <p class=\"card-p-text\"><i class=\"fas fa-mobile-alt fa-mobile\"></i>&nbsp;").concat(item.Tel, "</p>\n              <p class=\"card-p-text\"><i class=\"fas fa-tags text-warning\"></i>&nbsp;").concat(item.Ticketinfo, "</p>\n            </div>\n          </div>\n        </div>\n      </div>");
  });
  content.innerHTML = str;
}

function pageBtn(page) {
  var str = '';
  var total = page.pageTotal;

  if (page.hasPage) {
    str += "<li class=\"page-item\"><a class='page-link' href='#' data-page=\"".concat(Number(page.currentPage) - 1, "\">Previous</a></li>");
  } else {
    str += "<li class=\"page-item disabled\"><span class=\"page-link\">Previous</span></li>";
  }

  for (var i = 1; i <= total; i++) {
    if (Number(page.currentPage) === i) {
      str += "<li class=\"page-item active\"><a class='page-link' href='#' data-page=\"".concat(i, "\">").concat(i, "</a></li>");
    } else {
      str += "<li class=\"page-item\"><a class='page-link' href='#' data-page=\"".concat(i, "\">").concat(i, "</a></li>");
    }
  }

  ;

  if (page.hasNext) {
    str += "<li class=\"page-item\"><a class='page-link' href='#' data-page=\"".concat(Number(page.currentPage) + 1, "\">Next</a></li>");
  } else {
    str += "<li class=\"page-item disabled\"><span class=\"page-link\">Next</span></li>";
  }

  pageid.innerHTML = str;
}

function switchPage(e) {
  e.preventDefault();

  if (e.target.nodeName !== 'A') {
    return;
  }

  var page = e.target.dataset.page;
  pagination(jsonData, page);
}

pageid.addEventListener('click', switchPage);
//# sourceMappingURL=all.js.map
