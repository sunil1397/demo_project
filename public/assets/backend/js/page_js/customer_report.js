// Customer dataTable
var customerList = $('#customerReport').DataTable({
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
        "url": base_url+"/customer-report-list",
        "type": "post",
        'data': function(data){
            data.filter_customer_name=$("#filter_customer").val();
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
$("#filter_customer").on('keyup input',function(){
    customerList.draw();
});
$('body').on('click', '.reset-filter', function() {
    $('#filter_customer').val('');
    customerList.draw();
});
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_customer_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Export</button>');
    // $("#filter_product_id").on('keyup input',function(){
    //     inventoryTable.draw();
    // });
    // $("#filter_part_no").on('keyup input',function(){
    //     inventoryTable.draw();
    // });
    // $("#filter_part_name").on('change',function(){
    //     inventoryTable.draw();
    // });
    // $("#filter_category").on('change',function(){
    //     inventoryTable.draw();
    // });
    // $("#filter_uom").on('change',function(){
    //     inventoryTable.draw();
    // });
    // $('body').on('click', '.reset-filter', function() {
    //     $('#filter_part_no').val('');
    //     $('#filter_part_name').val('');
    //     $('#filter_category').val('');
    //     // $("#filter_supplier").val('').selectpicker("refresh");
    //     // $("#filter_warehouse").val('').selectpicker("refresh");
    //     // $("#filter_status").val('');
    //     $("#filter_product_id").val('');
    //     inventoryTable.draw();
    // });


    function ExportTable() {
        var info = customerList.page.info();
        window.location.href = base_url+"/customer-management-export?start="+info.start+"&end="+info.end;
    }
// Add Inventory Form
function show_form(){
    $.ajax({
        url:base_url+"/",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Add Product");
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
            product_management();
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

// Product Management save
function product_management() {
    $("#CommonModal").find("#ProductManagementForm").validate({
        rules: {
            part_name: "required",
            category: "required",
            make_brand_name: "required",
            part_number: "required",
            selling_price: "required",
            uom_name: "required",
            quantity: "required",
            cost_price: "required",
            alert: "required"
        },
        messages: {
            'warehouse_id[]': "This field is required",
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "part_brand_id") {
                error.appendTo(element.parent());
            }else if (element.attr("name") == 'part_name_id') {
                error.appendTo(element.parent());
            }else if (element.attr("name") == 'car_manufacture_id') {
                error.appendTo(element.parent());
            }else if (element.attr("name") == 'car_name_id') {
                error.appendTo(element.parent());
            }else if (element.attr("name") == 'ct') {
                error.appendTo(element.parent());
            }else if (element.attr("name") == 'car_model_id[]') {
                error.appendTo(element.parent());
            }else {
                error.insertAfter(element);
            }
        },
        submitHandler: function() {
            var formData = new FormData($('#ProductManagementForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-product-management",  
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
                        $('#ProductManagementForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            productTable.draw();
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
// View Customer Report-->
$('body').on('click',"a.view-customer",function(){
    var id = $(this).data('id');
    console.log(id);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/view-customer-report",  
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