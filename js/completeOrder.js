$(function() {
	$("#completeOrder").click(function() {
		//		take_photos.html?status=1
		//		alert("completeOrder");
		getCompleteOrderList(0);
	});
	$("#errorOrder").click(function() {
		//		take_photos.html?status=1
		//		alert("errorOrder");
		getCompleteOrderList(1);
		//
	});
});

function getCompleteOrderList(status) {
	//选取的订单
	//设置传送的href
	var locationName = "";
	var areaName="";
	var order_name="";
	var checkCity = 0;//只允许相同城市
	$("#order_list input").each(function() {
		var i = 0;
		
		if($(this).is(':checked')) {
			var v = $(this).val();
			var data = v.split(",");
			var deliveryStopName = data[1];
			var order_no=data[0];
			if(locationName.indexOf(deliveryStopName) == -1 && deliveryStopName != null) {//不同城市添加
				locationName += ("" + deliveryStopName + ",");
				checkCity++;
			} 

			order_name += ("" + order_no + ",");
		}
	});
	if(checkCity > 1) {
		alert("请选择相同城市的订单");
		return;
	}
	console.log("--------> " + locationName);
	$(location).attr('href', 'take_photos.html?locationName=' + locationName + '&shippingno=' 
	+ localStorage.getItem("BatchNo")+"&status="+status+ '&order_name=' + order_name);
}