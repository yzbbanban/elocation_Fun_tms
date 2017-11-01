function orderDiversion() {
	var orderJs = '"';
	//未选择
	if(0 == $("input:checked").length) {
		alert("请选择订单");
		return;
	}
	$("#order_list input").each(function() {
		var i = 0;
		if($(this).is(':checked')) {
			//			orderJs += '{"orderId":' + $(this).val() + "},";
			
			orderJs += $(this).val() + ",";
		}
	});
	localStorage.setItem("orderDivJs","");
	orderJs = orderJs.substring(0, orderJs.lastIndexOf(","));
	orderJs += '"';
//	console.log(orderJs);
	localStorage.setItem("orderDivJs",orderJs)

	$(location).attr('href', 'allocated_order.html');
}