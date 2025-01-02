// Employee Management dataTable
var employeeTable = $('#employeeList').DataTable({
    "dom": "<'row'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-6'<'toolbar'>>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    "processing": true,
    "serverSide": true,
    'orderable': true,
    "responsive": true,   
    "pageLength" : 50,
    "order": [0, ''],
    "ajax": {
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        "url": base_url+"/list-employee-management",
        "type": "POST",
        'data': function(data){
            
        },
        
    },
    'columns': [
        {data: 'employee_id', name: 'employee_id ', orderable: true, searchable: false},
        {data: 'name', name: 'name', orderable: false, searchable: false},
        {data: 'role_name', name: 'role_name', orderable: false, searchable: false},
        {data: 'email', name: 'email', orderable: false, searchable: false},
        {data: 'phone_number', name: 'phone_number', orderable: false, searchable: false},
        {data: 'department_name', name: 'department_name', orderable: false, searchable: false},
        {data: 'designation_name', name: 'designation_name', orderable: false, searchable: false},
        {data: 'branch_name', name: 'branch_name', orderable: false, searchable: false},
        {data: 'status', name: 'status', orderable: false, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {});
$('#ResetFilter').on('click', function(){
    employeeTable.draw();
});
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="bulk_add_product_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="bulk_upload_employee()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Bulk Upload Employee</button> <button type="button" aria-haspopup="true" id="add_employee" aria-expanded="false" class="btn-shadow btn btn-info" onclick="show_form()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Employee</button> <button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportItemManagementTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportItemManagementTable() {
    var info = employeeTable.page.info();
    window.location.href = base_url+"/employee-management-export?start="+info.start+"&end="+info.end;
}

// Bulk Upload Employee
function bulk_upload_employee(){
    $.ajax({
        url:base_url+"/bulk-upload-employee",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Bulk Upload Employee");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").removeClass('modal-lg');
            $(".modal-dialog").addClass('modal-lg');
            $("#formContent").html(res);
            $('.input-tags').tagsInput();
            $("#engine_tag").attr("placeholder", "Engine No*");
            $("#engine_tag").css("width", "100px");
            $("#chassis_model_tag").attr("placeholder", "Chassis / Model");
            $("#chassis_model_tag").css("width", "100px");
            $("#manfg_no_tag").attr("placeholder", "Manufacturer No*");
            $("#manfg_no_tag").css("width", "110px");
            $("#altn_part_tag").attr("placeholder", "Alternate Part No*");
            $("#altn_part_tag").css("width", "110px");
             bulk_employee_management();
            // }
        },
        error:function(){
            swal({
              title: "Sorry!",
              text: "There is an error",
              type: "error" // type can be error/warning/success
            });
        },
        complete:function(){
            hideLoader();
        }
    })
}

// Save Employee Bulk
function bulk_employee_management() {
    $("#CommonModal").find("#bulkEmployeeUpload").validate({
        rules: {
            bulk_add_product: "required",
            alert: "required"
        },
        submitHandler: function() {
            var formData = new FormData($('#bulkEmployeeUpload')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-bulk-upload-employee",  
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
                    if(res["status"] == 1) {
                        hideLoader();
                        $('#bulkEmployeeUpload')[0].reset();
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

// Add Employee Form
function show_form(){
    $.ajax({
        url:base_url+"/add-employee",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Add Employee");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").removeClass('modal-lg');
            $(".modal-dialog").addClass('modal-xl');
            $("#formContent").html(res);
            $('.input-tags').tagsInput();
            $("#engine_tag").attr("placeholder", "Engine No*");
            $("#engine_tag").css("width", "100px");
            $("#chassis_model_tag").attr("placeholder", "Chassis / Model");
            $("#chassis_model_tag").css("width", "100px");
            $("#manfg_no_tag").attr("placeholder", "Manufacturer No*");
            $("#manfg_no_tag").css("width", "110px");
            $("#altn_part_tag").attr("placeholder", "Alternate Part No*");
            $("#altn_part_tag").css("width", "110px");
            employee_management_form();
            // }
        },
        error:function(){
            swal({
              title: "Sorry!",
              text: "There is an error",
              type: "error" // type can be error/warning/success
            });
        },
        complete:function(){
            hideLoader();
        }
    })
}


// Employee Management save
function employee_management_form() {
    $('.selectpicker').selectpicker().change(function(){
        $(this).valid()
    });
    $('.datepicker').datepicker({
        format  :  'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
    }).change(function(){
        $(this).valid()
    });
    $("#CommonModal").find("#EmployeeManagementForm").validate({
        rules: {
            first_name: "required",
            last_name: "required",
            phone_number: "required",
            email: {
                required: true,
                email: true
            },
            department: "required",
            designation: "required",
            branch_name: "required",
            user_role_id: "required"
        },
        submitHandler: function() {
            var formData = new FormData($('#EmployeeManagementForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-employee-management",  
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
                    console.log(res);
                    if(res["status"]) {
                        hideLoader();
                        $('#EmployeeManagementForm')[0].reset();
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
// View Employee Management-->
$('body').on('click',"a.view-employee",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/employee-management/view-employee",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Employee Details");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                //$(".modal-dialog").removeClass('modal-xl');
                $(".modal-dialog").addClass('modal-xl');
                $("#formContent").html(res["message"]);
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
// Edit Employee Management-->
$('body').on('click',"a.edit-employee",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-employee-management",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Update Employee");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(".modal-dialog").removeClass('modal-lg');
                $(".modal-dialog").addClass('modal-xl');
                $("#formContent").html(res["message"]);
                $('.input-tags').tagsInput();
                $("#engine_tag").attr("placeholder", "Engine");
                $("#engine_tag").css("width", "100px");
                $("#chassis_model_tag").attr("placeholder", "Chassis / Model");
                $("#chassis_model_tag").css("width", "100px");
                $("#manfg_no_tag").attr("placeholder", "Manufacturer No");
                $("#manfg_no_tag").css("width", "110px");
                $("#altn_part_tag").attr("placeholder", "Alternate Part");
                $("#altn_part_tag").css("width", "110px");
                employee_management_form();
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
$("#CommonModal").on('keyup input', '.category-search .bs-searchbox input', function(e) {
    var search_key = $(this).val();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url:base_url+"/get-category-data",
            data: {search_key:search_key},
            type: "POST",
            dataType: "json",
            beforeSend:function(){  
                // console.log("Before");
            },  
            success:function(res){
                console.log(res);
                var html='';
                if(res["status"]) {
                    $("#ct").html(res.data);
                    $("#ct").selectpicker('refresh');
                }else {
                    $("#ct").html(html);
                    $("#ct").selectpicker('refresh');
                }
            },
            error:function(){
            }
        });
});
// Designation
$('body').on('click', 'a.designation', function() {
	$.ajax({
        url:base_url+"/add-designation",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add Designation");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            designation_form();
        },
        error:function(){
            swal({
              title: "Sorry!",
              text: "There is an error",
              type: "error" // type can be error/warning/success
            });
        },
        complete:function(){
            hideLoader();
        }
    })
});
function designation_form() {
    $("#OrderPreviewModal").find("#designationForm").validate({
        rules: {
            category_name: "required",
            brand_id: "required",
        },
        submitHandler: function() {
            var formData = new FormData($('#designationForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-designation",  
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
                    // console.log(res);
                    if(res["status"]) {
                        hideLoader();
                        $('#designationForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                            $('#designation').append("<option value="+res.data.id+">"+res.data.name+"</option>");
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
// Department
$('body').on('click', 'a.department', function() {
    $.ajax({
        url:base_url+"/add-department",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add Department");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            department_form();
        },
        error:function(){
            swal({
              title: "Sorry!",
              text: "There is an error",
              type: "error" // type can be error/warning/success
            });
        },
        complete:function(){
            hideLoader();
        }
    })
});
function department_form() {
    $("#OrderPreviewModal").find("#departmentForm").validate({
        rules: {
            department: "required",  
        },
        submitHandler: function() {
            var formData = new FormData($('#departmentForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-department",  
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
                    // console.log(res);
                    if(res["status"]) {
                        hideLoader();
                        $('#departmentForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                            $('#department').append("<option value"+res.data.id+">"+res.data.name+"</option>")
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
// Branch
$('body').on('click', 'a.Branch', function() {
    $.ajax({
        url:base_url+"/add-branch",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add Branch");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            branch_form();
        },
        error:function(){
            swal({
              title: "Sorry!",
              text: "There is an error",
              type: "error" // type can be error/warning/success
            });
        },
        complete:function(){
            hideLoader();
        }
    })
});
function branch_form() {
    $("#OrderPreviewModal").find("#branchForm").validate({
        rules: {
            branch_name: "required",  
        },
        submitHandler: function() {
            var formData = new FormData($('#branchForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-branch",  
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
                    // console.log(res);
                    if(res["status"]) {
                        hideLoader();
                        $('#branchForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                            $('#branch_name').append("<option value="+res.data.id+">"+res.data.name+"</option>");
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
$("#OrderPreviewModal").on('keyup input', '.category-search .bs-searchbox input', function(e) {
    var search_key = $(this).val();
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/get-category-data",
        data: {search_key:search_key},
        type: "POST",
        dataType: "json",
        beforeSend:function(){  
            // console.log("Before");
        },  
        success:function(res){
            console.log(res);
            var html='';
            if(res["status"]) {
                $("#category_id").html(res.data);
                $("#category_id").selectpicker('refresh');
            }else {
                $("#category_id").html(html);
                $("#category_id").selectpicker('refresh');
            }
        },
        error:function(){
        }
    });
});
//Change Status
 $("body").on("click", "a.change-status", function(e) {                   
        var obj = $(this);
        var id = obj.data("id");
        var status = obj.data("status");
        swal({
            title: "Are you sure?",
            text: "You want to change this status!",
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
                    url:base_url+"/change-employee-status",  
                    type: "POST",
                    data:  {id: id, status:status},
                    beforeSend:function(){  
                        //$('#pageOverlay').css('display', 'block');
                    },  
                    success:function(res){
                        if(res["status"]) {
                            swal({
                                title: "Success!",
                                text: res["msg"],
                                type: "success"
                            }).then(function() {
                                if(res['employee_status'] == "Active") {
                                employeeTable.draw();
                            }else {
                                employeeTable.draw();
                            }
                            });
                        }else {
                            swal("Opps!", res["msg"], "error");
                        }
                    },
                    error: function(e) {
                        swal("Opps!", "There is an error", "error");
                    },
                    complete: function(c) {
                        //
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Data is safe :)", "error")
            }
        })
    });
 

$('.modal').on("hidden.bs.modal", function (e) { 
    if ($('.modal:visible').length) { 
        $('body').addClass('modal-open');
    }
});
$("body").on('click', '#download_template',function(){
  window.open(base_url+"/public/backend/file/item_management.csv");
});
$('body').on('click', '.file-upload-browse', function() {
    var file = $(this).parent().parent().parent().find('.file-upload-default');
    file.trigger('click');
});
$('body').on('change', '.file-upload-default', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
});
