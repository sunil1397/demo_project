// Inventory Management dataTable
var inventoryTable = $('#inventoryReport').DataTable({
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
        "url": base_url+"/list-inventory-report",
        "type": "get",
        'data': function(data){
            data.filter_product_id=$("#filter_product_id").val();
            data.filter_part_no=$("#filter_part_no").val();
            data.filter_part_name=$("#filter_part_name").val();
            data.filter_category_name=$("#filter_category").val();
            data.filter_uom_name=$("#filter_uom").val();
        },
        
    },
    'columns': [
        {data: 'product_id', name: 'product_id', orderable: true, searchable: false},
        {data: 'part_number', name: 'part_number', orderable: false, searchable: false},
        {data: 'part_name', name: 'part_name', orderable: false, searchable: false},
        {data: 'uom_id', name: 'uom_name', orderable: false, searchable: false},
        {data: 'category_id', name: 'category', orderable: false, searchable: false},
        {data: 'quantity_on_hand', name: 'quantity_on_hand', orderable: false, searchable: false},
        {data: 'selling_price', name: 'selling_price', orderable: false, searchable: false},
        {data: 'transit_quantity', name: 'transit_quantity', orderable: false, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {

    });
    $("#filter_product_id").on('keyup input',function(){
        inventoryTable.draw();
    });
    $("#filter_part_no").on('keyup input',function(){
        inventoryTable.draw();
    });
    $("#filter_part_name").on('change',function(){
        inventoryTable.draw();
    });
    $("#filter_category").on('change',function(){
        inventoryTable.draw();
    });
    $("#filter_uom").on('change',function(){
        inventoryTable.draw();
    });
    $('body').on('click', '.reset-filter', function() {
        $('#filter_part_no').val('');
        $('#filter_part_name').val('');
        $('#filter_category').val('');
        $("#filter_product_id").val('');
        inventoryTable.draw();
    });

$('#ResetFilter').on('click', function(){
   
    productTable.draw();
})//
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportProductManagementTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportProductManagementTable() {
    var info = inventoryTable.page.info();
    window.location.href = base_url+"/inventory-management-export?start="+info.start+"&end="+info.end;
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
// View Inventory Management-->
$('body').on('click',"a.view-inventory",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/view-inventory",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Inventory Details");
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