$(function() {
	$.extend({
		/** 
		 * url get parameters 
		 * @public 
		 * @return array() 
		 */
		urlGet: function() {
			return localStorage.getItem("orderDivJs");
		},
		getOrder: function(allocatedOrder) {
//			console.log("aaaa--->"+allocatedOrder);
			allocatedOrderList(allocatedOrder);
		}
	});
	$.getOrder($.urlGet());
});

function allocatedOrderList(allocatedOrder) {
//	console.log("bbb--->"+allocatedOrder);
	//替换所有字符
	if(allocatedOrder == null) {
		return;
	}
	//	allocatedOrder = allocatedOrder.replace(/'/g, '"');
	//	alert(allocatedOrder);
	//	var aoJs = JSON.parse(allocatedOrder);
	$.ajax({
		type: "post",
		url: "http://fleet01.elocation.com.cn/WebService_API/API_TMS_Service.asmx/QUR_ORDER_CTRANSSHIPMENT",
		async: true,
		data: {
			"BatchNo": localStorage.getItem("BatchNo"),
			"OrdecrList": allocatedOrder,
			"CheckKey": ""
		},
		dataType: "xml",
		success: function(result) {
			//			console.log("-----d------> " + result);
			var jsDetail = $(result).find("string").text(); //获取其中的json字符串
			var aoJs = JSON.parse(jsDetail); //转换为object对象
			console.log(aoJs);
			getAllocatedOrderData(aoJs);
		},
		error: function() {
			alert("数据出错");
		}
	});

	getAllocatedOrderData();

}

function getAllocatedOrderData(aoJs) {
	//	alert(data.length);
	var allocated_order_loc_count = 0;
	var allocated_order_loc_box_count = 0;
	var orderNoJs = "{orderNo,"
	for(var i = 0; i < aoJs.length; i++) {
		//		var id = JSON.stringify(aoJs[i]);
		//		id = id.replace(/"/g, "'");
		var id = aoJs[i].OrderNo;
		var orderNum = aoJs[i].OrderNo; //订单号
		var locName = aoJs[i].DeliveryStopName; //配送点名字
		var city = aoJs[i].City; //城市
		var loc = aoJs[i].DeliveryStopAddr; //配送点地址
		var count = parseInt(aoJs[i].TotalVolume); //总箱数

		var allocatedOrder = $("#allocated_order");
		var aso = "";
		orderNoJs += orderNum + ",";
		//配送点、箱数

		allocated_order_loc_count++;
		allocated_order_loc_box_count += count;
		//console.log(allocated_order_loc_box_count);
		$("#allocated_order_loc_count").text(allocated_order_loc_count);
		$("#allocated_order_loc_box_count").text(allocated_order_loc_box_count);
		aso = setallocatedOrderData(id, orderNum, locName, loc, city, count);
		var $aso = $(aso);
		allocatedOrder.append($aso);

	}
	orderNoJs = orderNoJs.substring(0, orderNoJs.lastIndexOf(",")) + "}";
	//sconsole.log(orderNoJs);
	makeCode(orderNoJs);
}

function makeCode(orderNoJs) {
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width: 100,
		height: 100
	});
	qrcode.makeCode(orderNoJs);
}

function setallocatedOrderData(id, orderNum, locName, loc, city, count) {
	return '<a href="order_detail.html?orderId=' + id + '" class="weui-media-box weui-media-box_appmsg">' +
		'<div class="weui-media-box__hd">' +
		'<img style="margin-top: 10px;" src="img/city.png" width="30" height="30" alt="">' +
		'<p style="line-height: 20px;">' + city + '</p>' +
		'</div>' +
		'<div class="weui-media-box__bd">' +
		'<div class="weui-cell">' +
		'<div class="weui-cell__hd"><img src="img/order.png" alt="" class="order_img"></div>' +
		'<div class="weui-cell__bd">' +
		'<p>订单号</p>' +
		'</div>' +
		'<div class="weui-cell__ft">' + orderNum + '</div>' +
		'</div>' +
		'<div class="weui-cell">' +
		'<div class="weui-cell__hd"><img src="img/location.png" alt="" class="order_img"></div>' +
		'<div class="weui-cell__bd">' +
		'<p>配送点</p>' +
		'</div>' +
		'<div class="weui-cell__ft">' + locName + '</div>' +
		'</div>' +
		'<div class="weui-cell">' +
		'<div class="weui-cell__hd"><img src="img/count.png" alt="" class="order_img"></div>' +
		'<div class="weui-cell__bd">' +
		'<p>总数量</p>' +
		'</div>' +
		'<div class="weui-cell__ft">' + count + '箱</div>' +
		'</div>' +
		'</div>' +
		'<img src="img/more.png" alt="">' +
		'</a>';
}