// dataTable
var supplierList = $('#supplierReport').DataTable({
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
        "url": base_url+"/supplier-report-list",
        "type": "POST",
        'data': function(data){
            data.filter_vendor_code=$("#filter_vendor_code").val();
            data.filter_name=$("#filter_name").val();
            data.filter_brand=$("#filter_brand").val();
        },
        
    },
    'columns': [
        {data: 'supplier_id', name: 'supplier_id', orderable: true, searchable: false},
        {data: 'vendor_code', name: 'vendor_code', orderable: false, searchable: false},
        {data: 'vendor_name', name: 'vendor_name', orderable: false, searchable: false},
        {data: 'address', name: 'address', orderable: false, searchable: false},
        {data: 'branch_name', name: 'branch', orderable: false, searchable: false},
        {data: 'email', name: 'email', orderable: false, searchable: false},
        {data: 'make_brand_name', name: 'make_brand_name', orderable: false, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {
});
$("#filter_vendor_code").on('keyup input',function(){
    supplierList.draw();
});
$("#filter_name").on('keyup input',function(){
    supplierList.draw();
});
$("#filter_brand").on('change',function(){
    supplierList.draw();
});
$('body').on('click', '.reset-filter', function() {
    $('#filter_vendor_code').val('');
    $('#filter_name').val('');
    $('#filter_brand').val('');
    supplierList.draw();
});
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_customer_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportSupplierTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Export</button>');
function ExportSupplierTable() {
    var info = supplierList.page.info();
    window.location.href = base_url+"/supplier-management-export?start="+info.start+"&end="+info.end;
}
// View Bulk Upload
function bulk_upload_supplier(){
    $.ajax({
        url:base_url+"/bulk-upload-supplier",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Bulk Upload Supplier");
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
             bulk_save_supplier();
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
function bulk_save_supplier() {
    $("#CommonModal").find("#bulkSupplierUpload").validate({
        rules: {
            bulk_add_product: "required",
            alert: "required"
        },
        submitHandler: function() {
            var formData = new FormData($('#bulkSupplierUpload')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-bulk-upload-supplier",  
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
                        $('#bulkSupplierUpload')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            supplierList.draw();
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
        url:base_url+"/add-supplier",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Add Supplier");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").addClass('modal-lg');
            $("#formContent").html(res);
            supplier_vendor_form();
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
// Supplier Vendor save
function supplier_vendor_form() {
    $("#CommonModal").find("#SupplierVendorForm").validate({
        rules: {
            vendor_code: "required",
            vendor_name: "required",
            address: "required",
            gst: "required",
            // branch: "required",
            contact_name: "required",
            email: {
                required: true,
                email: true
            },
            mobile_number_1: "required",
        },
        submitHandler: function() {
            var formData = new FormData($('#SupplierVendorForm')[0]);
            formData.append('country_name',$("#country option:selected").text());
            formData.append('state_name',$("#state option:selected").text());
            formData.append('city_name',$("#city option:selected").text());
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-supplier",  
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
                        $('#SupplierVendorForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            supplierList.draw();
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
$('body').on('click',"a.edit-supplier",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-supplier",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Update Supplier");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(".modal-dialog").addClass('modal-lg');
                $("#formContent").html(res["message"]);
                supplier_vendor_form();
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

//Get State
function getState(country_id){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/state-function",  
        type: "POST",
        data:  {country_id: country_id},
        dataType: 'json',
        success: function(res){
            if(res.status == 1) {
                $('#state').find('option:not(:first)').remove();
                var state = JSON.parse(res.data);
                for(i=0; i<state.length; i++){
                  $("#state").append('<option value="'+state[i]['iso2']+'">'+state[i]['name']+'</option>');
                }
            }
        }

    });
}

//Get Country
function getCity(state_id){
    var country = $('#country').val();
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/city-function",  
        type: "POST",
        data:  {country: country,state_id:state_id},
        dataType: 'json',
        success: function(res){
            if(res.status == 1) {
                $('#city').find('option:not(:first)').remove();
                var city = JSON.parse(res.data);
                for(i=0; i<city.length; i++){
                  $("#city").append('<option value="'+city[i]['id']+'">'+city[i]['name']+'</option>');
                }
            }
        }

    });
}

// Delete Customer 
$("body").on("click", "a.delete-supplier", function(e) {                   
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
                url:base_url+"/delete-supplier",  
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
                            supplierList.draw();
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
$('body').on('click',"a.view-supplier",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/view-supplier",  
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
