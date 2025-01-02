// Customer dataTable
var customerList = $('#CustomerList').DataTable({
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
        "url": base_url+"/list-customer-management",
        "type": "POST",
        'data': function(data){
          // console.log(data);
        },
        
    },
    'columns': [
        {data: 'customer_id', name: 'customer_id', orderable: true, searchable: false},
        {data: 'customer_name', name: 'customer_name', orderable: false, searchable: false},
        {data: 'branch_name', name: 'branch_name', orderable: false, searchable: false},
        {data: 'contact_phone_1', name: 'contact_phone_1', orderable: false, searchable: false},
        {data: 'email_1', name: 'email_1', orderable: false, searchable: false},
        {data: 'customer_address', name: 'customer_address', orderable: false, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {
});
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="bulk_add_customer_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="bulk_upload_customer()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Bulk Upload Customer</button> <button type="button" aria-haspopup="true" id="add_customer_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="show_form()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Customer</button> <button type="button" aria-haspopup="true" id="add_customer_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Export</button>');
function ExportTable() {
    var info = customerList.page.info();
    window.location.href = base_url+"/customer-management-export?start="+info.start+"&end="+info.end;
}

// Bulk Upload Customer 
function bulk_upload_customer(){
    $.ajax({
        url:base_url+"/bulk-upload-customer",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Bulk Upload Customer");
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
             bulk_customer_management();
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

// Save Bulk Upload 
function bulk_customer_management() {
    $("#CommonModal").find("#bulkCustomerUpload").validate({
        rules: {
            bulk_add_product: "required",
            alert: "required"
        },
        submitHandler: function() {
            var formData = new FormData($('#bulkCustomerUpload')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-bulk-upload-customer",  
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
                        $('#bulkCustomerUpload')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            customerList.draw();
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

function show_form(){
     $.ajax({
        url:base_url+"/add-customer-master",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Add Customer");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").addClass('modal-lg');
            $("#formContent").html(res);
            customer_master_form();
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
// Customer Management save
function customer_master_form() {
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
    $("#CommonModal").find("#CustomerMasterForm").validate({
        rules: {
            // customer_code: "required",
            customer_name: "required",
            // customer_industry: "required",
            // customer_employee_size: "required",
            // customer_annual_turnover: "required",
            // customer_web: "required",
            customer_address: "required",
            // branch_id: "required",
            //employee_id: "required",
            country: "required",
            state: "required",
            city: "required",
            // latitude: "required",
            // longititude: "required",
            // gst_number: "required",
            contact_phone_1: "required",
            email_1: {
                required: true,
                email: true
            },
            name_1: "required",
            // landline_number: "required",
            // dob: "required",
            // designation_id: "required",
            // department_id: "required",
            // business_facilation_details: "required",
            // password: "required",
            // gender: "required",
        },
        submitHandler: function() {
            var formData = new FormData($('#CustomerMasterForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-customer-management",  
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
                        $('#CustomerMasterForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            customerList.draw();
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
// Edit Customer-->
$('body').on('click',"a.edit-customer",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-customer-management",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Update Customer");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(".modal-dialog").addClass('modal-lg');
                $("#formContent").html(res["message"]);
                $('#password').prop('disabled', true);
                customer_master_form();
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
// Delete Customer 
$("body").on("click", "a.delete-customer", function(e) {                   
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
                url:base_url+"/delete-customer-management",  
                type: "POST",
                data:  {id: id},
                beforeSend:function(){  
                    //$('#pageOverlay').css('display', 'block');
                },  
                success:function(res){
                    // console.log(res);
                    if(res["status"]) {
                        //DataTable4CylinderTypeTable.draw();
                        //$('#pageOverlay').css('display', 'none');
                        swal({
                            title: "Success!",
                            text: res["msg"],
                            type: "success"
                        }).then(function() {
                            customerList.draw();
                        });
                    }else {
                        //$('#pageOverlay').css('display', 'none');
                        swal("Opps!", res["msg"], "error");
                    }
                },
                error: function(e) {
                    //$('#pageOverlay').css('display', 'none');
                    swal("Opps!", "There is an error", "error");
                },
                complete: function(c) {
                    //$('#pageOverlay').css('display', 'none');
                }
            });
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swal("Cancelled", "Data is safe :)", "error")
        }
    })
});
// View Customer Management-->
$('body').on('click',"a.view-customer",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/customer-management/view-customer",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Customer Details");
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
