$(function() {
	$.extend({
		/** 
		 * url get parameters 
		 * @public 
		 * @return array() 
		 */
		urlGet: function() {
			var aQuery = window.location.href; //取得Get参数 
//			console.log(aQuery);
//			aQuery = aQuery.replace(/%27/g, "\"");

//			console.log(aQuery);

			aQuery = aQuery.substring(aQuery.lastIndexOf("?") + 1, aQuery.length);

			aQuery = decodeURI(decodeURI(aQuery)); //js 解码  
//			alert(aQuery);
			var aGET = new Array();
			aGET = aQuery.split("=");
			return aGET[1];
		},

		getDetail: function(detailId) {
			//alert(detailId);
			getDetailData(detailId);
		}
	});
	$.getDetail($.urlGet());
});

function getDetailData(detailId) {
	$.ajax({
		type:"post",
		url:"http://fleet01.elocation.com.cn/WebService_API/API_TMS_Service.asmx/QUR_ORDER_CTRANSSHIPMENT",
		async:true,
		data:{
			"BatchNo":localStorage.getItem("BatchNo"),
			"OrdecrList":detailId,
			"CheckKey":""
		},
		dataType: "xml",
		success:function(result){
//			alert("-----d------> " + result);
			var jsDetail = $(result).find("string").text(); //获取其中的json字符串
//			alert("-----d------> " + jsDetail);
			var detail = JSON.parse(jsDetail); //转换为object对象
			
			setDetailData(detail[0]);
		},
		error:function(){
			alert("数据出错");
		}
	});
	
}

function setDetailData(data) {
	//OrderNo
	//City
	//DeliveryStopAddr
	//DetailQuantity

		//	alert(data);
	var city = data.City;
	var orderNum = data.OrderNo;
	var locName = data.DeliveryStopName;
	var loc = data.DeliveryStopAddr;
//	alert(city);
	var order_detial = $("#order_detial");
	var sor = "";
	sor = '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">' +
		'<div class="weui-media-box__hd">' +
		'<img style="margin-top: 10px;" src="img/detail_count.png" width="30" height="30" alt="">' +
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
		'<p>名称</p>' +
		'</div>' +
		'<div class="weui-cell__ft">' + locName + '</div>' +
		'</div>' +
		'<div class="weui-cell">' +
		'<div class="weui-cell__hd"><img src="img/order_loc.png" alt="" class="order_img"></div>' +
		'<div class="weui-cell__bd">' +
		'<p>地址</p>' +
		'</div>' +
		'<div class="weui-cell__ft">' + loc + '</div>' +
		'</div>' +
		'</div>' +
		'</a>';
	var $so = $(sor);
	order_detial.append($so);
	
	var de=JSON.parse(data.Detail)
//	alert(de);
	var order_detial_list = $("#order_detial_list");
	var sd = ""
	for(var j = 0; j < de.length; j++) {
//		var orderName = data.DetailItem[j].name;
		var orderName=de[j].ItemName
//		var box_count = data.DetailItem[j].box_count;
		var box_count=de[j].Container;
		sd = '<div class="weui-cell">' +
			'<div class="weui-cell__hd"><img src="img/goods.png" alt="" style="width:20px;margin-right:5px;display:block"></div>' +
			'<div class="weui-cell__bd">' +
			'<p>品项：' + orderName + '</p>' +
			'</div>' +
			'<div class="weui-cell__ft">' +
			'<div id="order_bottom" class="">' +
			'<img src="img/detail_count.png" alt="" class="order_foot_img order_case">' +
			'<p class="order_foot_p" id="orde_case_count">箱数：' + box_count + '箱</p>' +
			'</div>' +
			'</div>' +
			'</div>';
		var $sd = $(sd)
		order_detial_list.append($sd);
	}

}