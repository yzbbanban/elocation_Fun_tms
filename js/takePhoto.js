$(function() {
	$.extend({
		/**
		 * 获取上个界面get请求中的url参数值
		 */
		urlGet: function() {
			//			alert("sss");
			var aQuery = window.location.href; //取得Get参数 
			console.log(aQuery);

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
		/**
		 * 告诉页面是否异常
		 * @param {Object} status
		 */
		setStatus: function(aGET) {
			//alert(aGET["status"]);
			var status = aGET["status"]
			if(status == 0) {
				$("#exception_reason").hide();
				//$("#completeOrder").show();
				//$("#errorOrder").hide();

			} else {
				//$('#completeOrder').hide();
				//$("#errorOrder").show();
			}

		}

	});
	$.setStatus($.urlGet());
});