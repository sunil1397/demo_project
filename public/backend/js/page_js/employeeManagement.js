var employeeManagement = (function () {
    var employeeTable = "";
    function table(){
        employeeTable = $('#EmployeeManagement').DataTable({
            "dom": "<'row'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-6'<'toolbar'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            "processing": true,
            "serverSide": true,
            "responsive": true,
            "order": [0, 'desc'],
            "ajax": {
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                "url": base_url+"/admin/get-employee-list",
                "type": "POST",
                'data': function(data){},
            },
            'columns': [
                {data: 'id', name: 'id', orderable: true, searchable: false},
                {data: 'first_name', name: 'first_name', orderable: false, searchable: false},
                {data: 'department', name: 'department', orderable: false, searchable: false},
                {data: 'email', name: 'email', orderable: false, searchable: false},
                {data: 'address', name: 'address', orderable: false, searchable: false},
                {data: 'userImage', name: 'userImage', orderable: false, searchable: false},
                {data: 'action', name: 'action', orderable: false, searchable: false},
            ],
            }).on('xhr.dt', function(e, settings, json, xhr) {

        });
        $('div.toolbar').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn-shadow btn btn-info show-employee" title="Add Employee"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Employee</button>');
    }
    function show_form(){
		$(document).ready( function () {
			$('body').on('click','.show-employee', function() {
				$.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
					url:base_url+"/admin/add-employee",
					type:'post',
					dataType:'html',
					success:function(res){
                        hideLoader();
                        $('.modal-title').text('').text("Add Employee");
                        $("#CommonModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#formContent").html(res);
                        save_employee_form();
					},
					error:function(){
						swal({
                            title: "Sorry!",
                            text: "There is an error",
                            type: "error"
                          });
					},
					complete:function(){
                        hideLoader();
                    }
				})
			})
		});
	}

    // Employee Data save
    function save_employee_form() {
        $("#CommonModal").find("#employeeForm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                department: "required",
                email: "required",
                phone_number: "required",
                address: "required",
            },
            submitHandler: function() {
                var formData = new FormData($('#employeeForm')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    url:base_url+"/admin/save-employee",
                    type: "POST",
                    data:  formData,
                    contentType: false,
                    cache: false,
                    processData:false,
                    dataType:"json",
                    beforeSend:function(){
                        showLoader();
                    },
                    success:function(res){
                        if(res["status"]) {
                            hideLoader();
                            $('#employeeForm')[0].reset();
                            swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                                $('#CommonModal').modal('hide');
                                employeeTable.draw();
                            });
                        }else {
                            hideLoader();
                            swal("Opps!", res["msg"], "error");
                        }
                    },
                    error: function(e) {
                        hideLoader();
                        swal("Opps!", "There is an error", "error");
                    },
                    complete: function(c) {
                        hideLoader();
                    }
                });
            }
        });
    }

    // Edit Employee
    function editEmployee(){
        $('body').on('click',"a.edit-employee",function(){
            var id = $(this).data('id');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/admin/edit-employee",
                type: "POST",
                data:  {id:id},
                dataType:"json",
                beforeSend:function(){
                    showLoader();
                },
                success:function(res){
                    if(res["status"]) {
                        hideLoader();
                        $('.modal-title').text('').text("Update Employee");
                        $("#CommonModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#formContent").html(res["message"]);
                        save_employee_form();
                    }else {
                        hideLoader();
                    }
                },
                error: function(e) {
                    hideLoader();
                    swal("Opps!", "There is an error", "error");
                },
                complete: function(c) {
                    hideLoader();
                }
            });
        });
    }

    // Employee Delete
    function deleteEmployee(){
        $("body").on("click", "a.delete-employee", function(e) {
            var obj = $(this);
            var id = obj.data("id");
            swal({
                title: "Are you sure?",
                text: "You want to delete it.",
                type: "warning",
                showCancelButton: !0,
                confirmButtonText: "Yes.",
                cancelButtonText: "No!",
                confirmButtonClass: "btn btn-success mr-5",
                cancelButtonClass: "btn btn-danger",
                buttonsStyling: !1
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        url:base_url+"/admin/delete-employee",
                        type: "POST",
                        data:  {id: id},
                        beforeSend:function(){
                        },
                        success:function(res){
                            if(res["status"]) {
                                swal({
                                    title: "Success!",
                                    text: res["msg"],
                                    type: "success"
                                }).then(function() {
                                    employeeTable.draw();
                                });
                            }else {
                                swal("Opps!", res["msg"], "error");
                            }
                        },
                        error: function(e) {
                            swal("Opps!", "There is an error", "error");
                        },
                        complete: function(c) {
                        }
                    });
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swal("Cancelled", "Data is safe :)", "error")
                }
            })
      });
    }


    return {
        init: function () {
            show_form();
            editEmployee();
            deleteEmployee();
            table();
        },
    };
}());
$(document).ready(function () { employeeManagement.init(); });
