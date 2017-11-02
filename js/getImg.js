function plusReady() {
	var tmpl = '<li class="weui-uploader__file"><img id="cImg" alt=""  width="77px" height="77px" src="#url#"/></li>',
		$gallery = $("#gallery"),
		$galleryImg = $("#galleryImg"),
		$uploaderInput = $("#uploaderInput"),
		$uploaderFiles = $("#uploaderFiles");

	$uploaderFiles.on("click", "img", function() {
		$galleryImg.attr("src", this.getAttribute("src"));
		$gallery.fadeIn(100);
	});
	$gallery.on("click", function() {

		$gallery.fadeOut(100);
	});
	// 弹出系统选择按钮框  
	mui("body").on("tap", ".imageup", function() {

		page.imgUp($uploaderFiles,tmpl);
	})

}
var page = null;
page = {
	imgUp: function($uploaderFiles,tmpl) {
		var m = this;
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: [{
					title: "拍照"
				},
				{
					title: "从相册中选择"
				}
			]
		}, function(e) { //1 是拍照  2 从相册中选择  
			switch(e.index) {
				case 1:
					clickCamera($uploaderFiles,tmpl);
					break;
				case 2:
					clickGallery($uploaderFiles,tmpl);
					break;
			}
		});
	}
	//摄像头  
}

//选取照片

function clickGallery($uploaderFiles,tmpl) {
	plus.gallery.pick(function(path) {
		console.log("clickGallery-----> " + path);

		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			var localUrl = entry.toLocalURL();

			console.log("clickGallery-----> " + localUrl);
			plus.zip.compressImage({
				src: localUrl,
				dst: "_doc/chat/gallery/" + localUrl,
				quality: 20,
				overwrite: true
			}, function(e) {
				console.log("clickGallery-----> " + e.target);
				$("#text1").hide();

				$uploaderFiles.append($(tmpl.replace('#url#', e.target)));
				//$("#cImg").attr('src', e.target);
				//$("#text1").removeClass("weui-uploader__input-box");
			}, function(err) {
				console.log("压缩失败：  " + err.message);
			});

		});

	}, function(err) {});
};

// 拍照  

function clickCamera($uploaderFiles,tmpl) {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	cmr.captureImage(function(path) {
		//alert("clickCamera");
		//plus.io.resolveLocalFileSystemURL(path, function(entry) {  
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			var localUrl = entry.toLocalURL();
			console.log("-----> " + localUrl);
			plus.zip.compressImage({
				src: localUrl,
				dst: "_doc/chat/camera/" + localUrl,
				quality: 20,
				overwrite: true
			}, function(e) {
				console.log("-----> " + e.target);
				$("#text1").hide();

				$uploaderFiles.append($(tmpl.replace('#url#', e.target)));
				//$("#cImg").attr('src', e.target);
				//$("#text1").removeClass("weui-uploader__input-box");
			}, function(err) {
				console.log("压缩失败：  " + err.message);
			});
		});
	}, function(err) {
		console.error("拍照失败：" + err.message);
	}, {
		index: 1
	});
};

if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}