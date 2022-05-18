$(document).ready(function(){
	
	
	$("body").on('submit','#formHomeDetails',function(){
		let formId = $(this).attr('id');
		var formData = new FormData();
		var main_title = tinymce.get("main_title").getContent();
		var second_heading = tinymce.get("second_heading").getContent();
		var third_heading= tinymce.get("third_heading").getContent();
		var fourth_heading= tinymce.get("fourth_heading").getContent();
		var five_heading= tinymce.get("five_heading").getContent();
		var six_heading= tinymce.get("six_heading").getContent();
		var section_4_heading= tinymce.get("section_4_heading").getContent();
		var sub_4_1_heading=tinymce.get("sub_4_1_heading").getContent();
		var sub_4_1_details=tinymce.get("sub_4_1_details").getContent();
		var sub_4_2_heading=tinymce.get("sub_4_2_heading").getContent();
		var sub_4_2_details=tinymce.get("sub_4_2_details").getContent();
		var sub_4_3_heading=tinymce.get("sub_4_3_heading").getContent();
		var sub_4_3_details=tinymce.get("sub_4_3_details").getContent();
		var sub_4_4_heading=tinymce.get("sub_4_4_heading").getContent();
		var sub_4_4_details=tinymce.get("sub_4_4_details").getContent();
		var sub_3_1_heading=tinymce.get("sub_3_1_heading").getContent();
		var sub_3_1_details=tinymce.get("sub_3_1_details").getContent();
		var sub_3_2_heading=tinymce.get("sub_3_2_heading").getContent();
		var sub_3_2_details=tinymce.get("sub_3_2_details").getContent();

		
		formData.append('main_title', main_title);
		formData.append('second_heading', second_heading);
		formData.append('main_image', $('#formFile')[0].files[0]);
		formData.append('third_heading', third_heading);
		formData.append('fourth_heading', fourth_heading);
		formData.append('five_heading', five_heading);
		formData.append('six_heading', six_heading);
		formData.append('section_4_heading', section_4_heading);
		formData.append('sub_4_1_heading', sub_4_1_heading);
		formData.append('sub_4_1_details', sub_4_1_details);
		formData.append('sub_4_2_heading', sub_4_2_heading);
		formData.append('sub_4_2_details', sub_4_2_details);
		formData.append('sub_4_3_heading', sub_4_3_heading);
		formData.append('sub_4_3_details', sub_4_3_details);
		formData.append('sub_4_4_heading', sub_4_4_heading);
		formData.append('sub_4_4_details', sub_4_4_details);
		formData.append('sub_3_1_heading', sub_3_1_heading);
		formData.append('sub_3_1_details', sub_3_1_details);
		formData.append('sub_3_2_heading', sub_3_1_heading);
		formData.append('sub_3_2_details', sub_3_1_details);
		

		$(".mask_loader").show();
		$.ajax({
				url: '/super-user/homepage/update',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function (data) {
					$(".mask_loader").hide();
					$(".showAlert").show();
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

	$("body").on('click','.btnNewLogo',function(){
		$("#formNewContent").slideToggle();
	})

	$("body").on('submit','#formNewLogo',function(){
		let formId = $(this).attr('id');
		var formData = new FormData();
		formData.append('redirect_link', $("#redirect_link").val());
		formData.append('logo', $('#formFile')[0].files[0]);
		$(".mask_loader").show();
		$.ajax({
				url: '/super-user/homepage/new_logo',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function (data) {
					$(".mask_loader").hide();
					$(".showAlert").show();
					if(data == "Yes"){
						$(".showAlert").addClass("alert-success fade show");
						$("#showMessage").html("New logo has been uploaded successfully");
						Swal.fire({
							type: 'success',
							title: 'success',
							icon: 'success',
							text: 'New logo has been uploaded successfully',
							confirmButtonText: 'Ok',
							showCloseButton: false
						})
						.then(function (result) {
							location.reload();
						})
						
					}else{
						$(".showAlert").addClass("alert-danger fade show");
						$("#showMessage").html("Something went wrong");
					}
				}
			});
	});

		
	$("body").on('click','.btnDeleteLogo',function(){
		var id = $(this).attr("data-id");
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#565e64',
			confirmButtonText: 'Yes, delete it!',
		  }).then((result) => {
			if (result.isConfirmed) {
				$(".mask_loader").show();
				let sendData = { id: id};
				$.ajax({
					url: '/super-user/homepage/remove_logo',
					type: 'POST',
					data: sendData,
					success: function (data) {

						$(".mask_loader").hide();
						$('.showAlert').show();
						$('table > tbody >  tr[id='+id+']').remove();
						if(data == "Yes"){
							$(".showAlert").addClass("alert-success fade show");
							$("#showMessage").html("Logo has been deleted successfully");
						}else{
							$(".showAlert").addClass("alert-danger fade show");
							$("#showMessage").html("Something went wrong");
						}
					}
				});
			}
		  })
	});

});
