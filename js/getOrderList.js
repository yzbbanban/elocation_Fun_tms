/**
 * 从微信url中获取userId信息
 */
$(function() {
	$.extend({
		/** 
		 * 获取url中的装载号
		 * url get parameters 
		 * @public 
		 * @return array() 
		 */
		urlGet: function() {
			//			var aQuery = window.location.href; //取得Get参数 
			//模拟数据
			var aQuery = 'Http://fleet02.elocation.com.cn/Fun_TMS/Query/Task_Detail.aspx' +
				'?No=' + 123 + '&ID=' + 123456 + '&SendNo=' + 123456789 + '&WarehouseNo=' + 456;
			//			console.log(aQuery);
			aQuery = aQuery.substring(aQuery.lastIndexOf("?") + 1, aQuery.length);
			//alert(aQuery);
			var aGET = new Array();
			//保存为键值对
			var aBuf = aQuery.split("&");
			for(var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
				var aTmp = aBuf[i].split("="); //分离key与Value
				//				console.log("aTmp: " + aTmp);
				aGET[aTmp[0]] = aTmp[1];
			}

			return aGET;
		},

		getDetail: function(aGET) {
			//			console.log(aGET["ID"]);
			//从aGet获取装载号，weixinId
			//SetCookie("BatchNo", 156321489, 2); //存储装载号
			Window.BatchNo='156321489';.3
			
			localStorage.setItem("BatchNo", "156321489");
			localStorage.setItem("WeChatID", "oAYYRxCY_PoUPldf7ZVcGwkQxNk8");
			//SetCookie(aGET["ID"]);//存储weinxinID
			//558485632
			getCarDetail("156321489", "oAYYRxCY_PoUPldf7ZVcGwkQxNk8");
		}
	});
	$.getDetail($.urlGet());
});

function getCarDetail(orderNum, weixinId) {
	Window.orderNum=orderNum;
	//SetCookie("orderNum", orderNum, 2);

	//	console.log("1");
	$.ajax({
		type: "post",
		url: "http://fleet01.elocation.com.cn/WebService_API/API_TMS_LTL.asmx/WCT_SER_QUERY",
		data: {
			"WeChatID": weixinId,
			"CheckKey": ""
		},
		async: false,
		dataType: "xml", //xml格式
		success: function(result) {
			var resCar = $(result).find("string").text(); //获取其中的json字符串
			//模拟数据
			//			console.log("resCar: " + resCar);
			var jsCar = JSON.parse(resCar); //转换为object对象
			//			console.log("jsCar: " + jsCar[0].UserName)
			Window.UserName=jsCar[0].UserName;
			Window.UserPho=jsCar[0].UserPho;
			Window.WeChatID=jsCar[0].WeChatID;
			Window.IPNO=jsCar[0].IPNO;
			//SetCookie("UserName", jsCar[0].UserName, 2);
			//SetCookie("UserPho", jsCar[0].UserPho, 2);
			//SetCookie("WeChatID", jsCar[0].WeChatID, 2);
			//SetCookie("IPNO", jsCar[0].IPNO, 2);
			//			console.log(getCookie("UserName")+"："+getCookie("UserPho"));
//						console.log("1.success");
		},
		error: function() {
			alert("车辆信息获取失败,请检查网络!");
			return;
			//console.log("1.error");
		}
	});
	//	console.log("2");
	$.ajax({
		type: "post",
		url: "http://fleet01.elocation.com.cn/WebService_API/API_TMS_LTL.asmx/CON_GET_COMPINFO",
		data: {
			"BathNo": orderNum,
			"CheckKey": ""
		},
		async: false,
		dataType: "xml", //xml格式
		success: function(result) {
			var resUser = $(result).find("string").text(); //获取其中的json字符串
			//模拟数据
			//alert("resUser: " + resUser);
			var jsUser = JSON.parse(resUser); //转换为object对象
			//alert("jsCar: " + jsUser[0].Comp)
			Window.UserID=jsUser[0].UserID;
			Window.Comp=jsUser[0].Comp;
			Window.SubComp=jsUser[0].SubComp;
			//			alert(getCookie("Comp")+"："+getCookie("UserID"));
			getOrderList();
			//console.log("2.success");
		},
		error: function() {
			alert("车辆信息获取失败,,请检查网络");
			return;
			//console.log("2.error");

		}
	});
	//	console.log("3");
	//	getOrderList();
}

/**
 * 获取订单类表数据
 */
function getOrderList() {
	//		console.log(getCookie("Comp")+"："+getCookie("UserID"));
	//数据加载弹窗
	var $loadingToast = $('#loadingToast');
	if($loadingToast.css('display') != 'none') return;
	//$loadingToast.fadeIn(100);

	//获取订单列表数据
	$.ajax({
		type: "post",
		url: "http://fleet01.elocation.com.cn/WebService_API/API_TMS_Service.asmx/QUR_SER_QUERY",
		async: true,
		data: {
			'Comp': Window.Comp,
			'UserID': Window.UserID,
			'QueryNo': 'queryOrderList',
			'Params': '{"BatchNo":"' + Window.orderNum + '","UserID":"'+Window.WeChatID+'"}',
			'CheckKey': ''
		},
		dataType: "xml",
		success: function(result) {
			var resOrder = $(result).find("string").text();
			//获取的订单数据
			if(resOrder=="暂无该用户的订单资料"){
				alert(resOrder);
				return;
			}
			//alert("jsOrder: " + resOrder);
			var jsOrder = JSON.parse(resOrder);
			setOrderList(jsOrder);
			//弹窗消失
			//$loadingToast.fadeOut(100);
		},
		error: function() {
			//$loadingToast.fadeOut(100);
		}
	});
}
/**
 * 设置订单列表数据
 * @param {Object} codeResult
 */
function setOrderList(codeResult) {
	//	console.log("5");
	var data = codeResult;
	var orderListMenu = $("#order_list_detail");
	orderListMenu.html("");
	var sDiv = "";
	var cities = [];
	var deliveryStopNames = [];
	for(var i = 0; i < data.length; i++) {
		//		var id = JSON.stringify(data[i]);
		//		id=id.replace(/"/g,"'");

		var id = data[i].OrderNo;
		//console.log("-----------> " + id);
		var orderNum = data[i].OrderNo;
		var locName = data[i].DeliveryStopName; //配送点名称
		var count = data[i].TotalContainers; //总数量
		var cId = data[i].DeliveryStopAddr; //配送点地址
		var lId = data[i].Ship_To_Name;
		var deliveryStopName = data[i].DeliveryStopName; //配送点名称
		var city = data[i].City; //城市名称
		//		var deliveryStopName = data[i].DeliveryStopName; 
		// 添加城市元素 city
		if(cities.indexOf(city) == -1 && city != null) {
			//alert("bb: " + cities);
			//console.log("city: " + city + "index： " + cities.indexOf(city));
			cities.push(city);
		}
		//添加配送点元素 deliveryStopName
		if(deliveryStopNames.indexOf(deliveryStopName) == -1 && deliveryStopName != null) {
			deliveryStopNames.push(deliveryStopName);
		}

		//城市以及配送点筛选
		
		var jsFilter = localStorage.getItem("cityJs");

		console.log("ban---->"+jsFilter);
		if(jsFilter != "" && jsFilter != null) {
			//alert(jsFilter);
			//生成的城市字符串
			var jp = JSON.parse(jsFilter);
			//			console.log(jp.cityIds.length);
			for(var j = 0; j < jp.cities.length; j++) {

				var cI = jp.cities[j].city;
				if(city == cI || deliveryStopName == cI) {
					//					//生成界面
					//										console.log("j:" + jp.cities[j].city);
					sDiv = getOrderData(orderNum, locName, count, id);
					setSDiv(orderListMenu, sDiv, orderNum, locName, count, id);

				}
			}
		} else { //生成界面
			//			console.log("bbbbbb");
			sDiv = getOrderData(orderNum, locName, count, id);
			setSDiv(orderListMenu, sDiv, orderNum, locName, count, id);

		}

	}
	//alert("1: "+getCookie("cityJs"));
	Window.cityJs="";
	//SetCookie("cityJs", "", 2); //过滤完删除cookie
	//初始化城市、配送点界面
	Window.cities=cities;
	//addCookie("cities", cities, 2);
	Window.deliveryStopNames=deliveryStopNames;
	//addCookie("deliveryStopNames", deliveryStopNames, 2);

}
/**
 * 设置订单列表图形
 * @param {Object} orderListMenu
 * @param {Object} sDiv
 * @param {Object} orderNum
 * @param {Object} loc
 * @param {Object} count
 * @param {Object} id
 */
function setSDiv(orderListMenu, sDiv, orderNum, loc, count, id) {
	//	console.log("6");
	var $sd = $(sDiv);
	$sd.data("orderNum", orderNum);
	$sd.data("loc", loc);
	$sd.data("count", count);
	orderListMenu.append($sd);
}

$(function() {
	var check_order_click = true;
	//点击订单列表事件
	$("#order_list_detail").on("click", "#orderN", function() {
		var sd = $(this);
		var loc = sd.data("loc");
		//		alert(loc);
	});
	//点击全选
	$("#check_all_order").click(function() {

		$("#order_list input").each(function() {
			if(!check_order_click) {
				$(this).prop("checked", false);
			} else {
				$(this).prop("checked", true);
			}
		});
		if(check_order_click) {
			check_order_click = false;
		} else {
			check_order_click = true;
		}
	});
})
/**
 * 订单列表图形
 * @param {Object} orderNum
 * @param {Object} locName
 * @param {Object} count
 * @param {Object} id
 */
function getOrderData(orderNum, locName, count, id) {
	var sd = "";
	var compJs = "" + id + "," + locName;
	sd += '<div class="weui-cells weui-cells_checkbox">';
	sd += '<label class="weui-cell weui-check__label" >';
	sd += '<div class="weui-cell__hd">';
	sd += '<input type="checkbox" class="weui-check" name="checkbox1" value="' + compJs + '"/>';
	sd += '<i class="weui-icon-checked"></i>';
	sd += '</div>';
	sd += '<div class="weui-panel__bd" style="font-size: 10px;width: 100%;">';
	sd += '<a href="order_detail.html?order_id= ' + id + '" class="weui-media-box weui-media-box_appmsg" >';
	sd += '<div class="weui-media-box__bd">';
	sd += '<div class="weui-cell">';
	sd += '<div class="weui-cell__hd"><img src="img/order.png" alt="" class="order_img"></div>';
	sd += '<div class="weui-cell__bd">';
	sd += '<p>订单号</p>';
	sd += '</div>';
	sd += '<div class="weui-cell__ft">' + orderNum + '</div>';
	sd += '</div>';
	sd += '<div class="weui-cell">';
	sd += '<div class="weui-cell__hd"><img src="img/location.png" alt="" class="order_img"></div>';
	sd += '<div class="weui-cell__bd">';
	sd += '<p>配送点</p>';
	sd += '</div>';
	sd += '<div class="weui-cell__ft">' + locName + '</div>';
	sd += '</div>';
	sd += '<div class="weui-cell">';
	sd += '<div class="weui-cell__hd"><img src="img/count.png" alt="" class="order_img"></div>';
	sd += '<div class="weui-cell__bd">';
	sd += '<p>总数量</p>';
	sd += '</div>';
	sd += '<div class="weui-cell__ft">' + count + '箱</div>';
	sd += '</div>';
	sd += '</div>';
	sd += '<img src="img/more.png" alt="">';
	sd += '</a>';
	sd += '</div></label>';
	return sd;
}