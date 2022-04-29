$(document).ready(function(){
	
	
	$("body").on('submit','#formContactDetails',function(){
		let formId = $(this).attr('id');
		var main_heading = tinymce.get("main_heading").getContent();
		var office_details = tinymce.get("office_details").getContent();
		let phone_no = $("#phone_no").val();
		let email = $("#email").val();
		let sendData = { main_heading: main_heading, office_details: office_details, phone_no: phone_no, email: email};
		$(".mask_loader").show();
		$.ajax({
				url: '/super-user/contact/update',
				type: 'POST',
				data: sendData, 
				success: function (data) {
					$(".mask_loader").hide();
					let json = JSON.stringify(data);
					if(data == "Yes"){
						$(".showAlert").addClass("alert-success fade show");
						$("#showMessage").html("Contact details ha been updated successfully");
					}else{
						$(".showAlert").addClass("alert-danger fade show");
						$("#showMessage").html("Something went wrong");
					}
				}
			});
	});
});
