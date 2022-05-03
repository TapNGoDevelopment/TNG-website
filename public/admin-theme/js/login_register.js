$(document).ready(function(){

	
	$("body").on('submit','#formLogin',function(){
		let formId = $(this).attr('id');
		let username = $("#username").val();
		let password = $("#password").val();
		let sendData = { username: username, password: password};
		$("#loader").show();
		$.ajax({
				url: '/user/auth/',
				type: 'POST',
				data: sendData, 
				success: function (data) {
					$("#loader").hide();
					let json = JSON.stringify(data);
					if(data.is_loggedin == "Yes"){
						window.location = "/super-user/dashboard";
					}else{
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Wrong username and password',
						})
					}
				}
			});
	});
	
});	