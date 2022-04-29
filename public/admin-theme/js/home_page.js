$(document).ready(function(){
	
	
	$("body").on('submit','#formHomeDetails',function(){
		let formId = $(this).attr('id');
		var main_title = tinymce.get("main_title").getContent();
		var second_heading = tinymce.get("second_heading").getContent();
		let main_image =  $('input[type=file]')[0].files[0];
		var third_heading= tinymce.get("third_heading").getContent();
		var fourth_heading= tinymce.get("fourth_heading").getContent();
		var five_heading= tinymce.get("five_heading").getContent();
		var six_heading= tinymce.get("six_heading").getContent();
		var sevent_heading= tinymce.get("sevent_heading").getContent();
		var eight_heading= tinymce.get("eight_heading").getContent();
		
		

		let sendData = { main_title: main_title, second_heading: second_heading, main_image: main_image,third_heading: third_heading, fourth_heading: fourth_heading, five_heading: five_heading, six_heading: six_heading, sevent_heading : sevent_heading, eight_heading: eight_heading};
		$(".mask_loader").show();
		$.ajax({
				url: '/super-user/homepage/update',
				type: 'POST',
				data: sendData, 
				success: function (data) {
					$(".mask_loader").hide();
					if(data == "Yes"){
						$(".showAlert").addClass("alert-success fade show");
						$("#showMessage").html("Home details ha been updated successfully");
					}else{
						$(".showAlert").addClass("alert-danger fade show");
						$("#showMessage").html("Something went wrong");
					}
				}
			});
	});
});

