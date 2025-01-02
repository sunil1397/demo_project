// dataTable
var productTable = $('#productList').DataTable({
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
        "url": base_url+"/list-product-management",
        "type": "POST",
        'data': function(data){
   
        },
        
    },
    'columns': [
        {data: 'product_id', name: 'product_id', orderable: true, searchable: false},
        {data: 'part_name', name: 'part_name', orderable: false, searchable: false},
        {data: 'category_id', name: 'category', orderable: false, searchable: false},
        {data: 'brand_id', name: 'make_brand', orderable: false, searchable: false},
        {data: 'part_number', name: 'part_number', orderable: false, searchable: false},
        {data: 'description', name: 'description', orderable: false, searchable: false},
        {data: 'selling_price', name: 'selling_price', orderable: false, searchable: false},
        {data: 'cost_price', name: 'cost_price', orderable: false, searchable: false},
        {data: 'uom_id', name: 'uom_name', orderable: false, searchable: false},
        {data: 'quantity_on_hand', name: 'quantity_on_hand', orderable: false, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {});

$('#ResetFilter').on('click', function(){
   
    productTable.draw();
})//
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="bulk_add_product_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="bulk_upload_product()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Bulk Upload Product</button> <button type="button" aria-haspopup="true" id="add_product_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="show_form()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Product</button> <button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportProductManagementTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportProductManagementTable() {
    var info = productTable.page.info();
    window.location.href = base_url+"/product-management-export?start="+info.start+"&end="+info.end;
}

function bulk_upload_product(){
    $.ajax({
        url:base_url+"/bulk-upload-product-form",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Bulk Upload Product");
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
             bulk_product_management();
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

// Bulk Product Management save
function bulk_product_management() {
    $("#CommonModal").find("#bulkProductUpload").validate({
        rules: {
            bulk_add_product: "required",
            alert: "required"
        },
        submitHandler: function() {
            var formData = new FormData($('#bulkProductUpload')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-bulk-upload-product",  
                type: "POST",
                data:  formData,
                contentType: false,
                cache: false,
                processData:false, 
                beforeSend:function(){  
                    showLoader();
                },  
                success:function(res){
                    if(res["status"] == 1) {
                        hideLoader();
                        $('#bulkProductUpload')[0].reset();
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

function show_form(){
    $.ajax({
        url:base_url+"/add-product-form",
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

function show_bulk_upload_form(){
    $.ajax({
        url:base_url+"/add-item-management-bulk-upload",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            $('.modal-title').text('').text("Add Item");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").removeClass('modal-lg');
            $(".modal-dialog").removeClass('modal-xl');
            $("#formContent").html(res);
            //$('.input-tags').tagsInput();
            //$("#engine_tag").attr("placeholder", "Engine No*");
            //$("#engine_tag").css("width", "100px");
            //$("#chassis_model_tag").attr("placeholder", "Chassis / Model");
            //$("#chassis_model_tag").css("width", "100px");
            //$("#manfg_no_tag").attr("placeholder", "Manufacturer No*");
            //$("#manfg_no_tag").css("width", "110px");
            //$("#altn_part_tag").attr("placeholder", "Alternate Part No*");
            //$("#altn_part_tag").css("width", "110px");
            //item_management_bulk_upload_form();
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
// View Item Management-->
$('body').on('click',"a.view-product",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/product-management/view-product",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Product Details");
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
// Delete Category 
$("body").on("click", "a.delete-item", function(e) {                   
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
                url:base_url+"/delete-product-management",  
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
                            productTable.draw();
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
// Edit Product Management-->
$('body').on('click',"a.edit-item",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-product-management",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Update Product");
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
                product_management();
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
// Add Category 
$('body').on('click', 'a.new-category', function() {
	$.ajax({
        url:base_url+"/add-category",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add Catagory");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            product_category_form();
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
function product_category_form() {
    $("#OrderPreviewModal").find("#productCategoryForm").validate({
        rules: {
            category_name: "required",
        },
        submitHandler: function() {
            var formData = new FormData($('#productCategoryForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-category",  
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
                        $('#productCategoryForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                            $("#category").append("<option value="+res.data.id+">"+res.data.name+"</option>");
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
// Make Brand
$('body').on('click', 'a.make-brand', function() {
    $.ajax({
        url:base_url+"/add-brand",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add Make (Brand)");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            make_brand_form();
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
function make_brand_form() {
    $("#OrderPreviewModal").find("#makeBrandForm").validate({
        rules: {
            make_brand_name: "required",  
        },
        submitHandler: function() {
            var formData = new FormData($('#makeBrandForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-brand",  
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
                        $('#makeBrandForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                           $("#make_brand_name").append("<option value="+res.data.id+">"+res.data.name+"</option>");
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
// UOM
$('body').on('click', 'a.add-uom', function() {
    $.ajax({
        url:base_url+"/add-uom",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            hideLoader();
            $('#OrderPreviewModal .modal-title').text('').text("Add UOM");
            $("#OrderPreviewModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#OrderPreviewModal .modal-dialog').removeClass('modal-xl');
            $("#OrderPreviewModal #formContent").html(res);
            $('.csv-upload').css('display', 'none');
            uom_form();
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
function uom_form() {
    $("#OrderPreviewModal").find("#uomForm").validate({
        rules: {
            uom_name: "required",  
        },
        submitHandler: function() {
            var formData = new FormData($('#uomForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-uom",  
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
                        $('#uomForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#OrderPreviewModal').modal('hide');
                            $("#uom_id").append("<option value="+res.data.id+">"+res.data.name+"</option>");
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