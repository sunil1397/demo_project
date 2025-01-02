// dataTable
var userRoleTable = $('#userRoleList').DataTable({
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
        "url": base_url+"/list-user-role",
        "type": "POST",
        'data': function(data){
           
        },
        
    },
    'columns': [
        {data: 'role_name', name: 'role_name', orderable: true, searchable: false},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {});
$('#ResetFilter').on('click', function(){
    
    userRoleTable.draw();
})//
$('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_role" aria-expanded="false" class="btn-shadow btn btn-info" onclick="show_form()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add User Role</button> <button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportUserRoleTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportUserRoleTable() {
    var info = userRoleTable.page.info();
    window.location.href = base_url+"/user-role-export?start="+info.start+"&end="+info.end;
}
function select_userType(_val){
$("#user_role").val(_val);
}
function show_form(){
    $.ajax({
        url:base_url+"/add-user-role",
        type:'get',
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Add User Role");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").removeClass('modal-lg');
            $(".modal-dialog").removeClass('modal-xl');
            $("#formContent").html(res);
            user_role_form();
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
// User Role save
function user_role_form() {
    $("#CommonModal").find("#UserRoleForm").validate({
        rules: {
            role_name: "required",
        },

        submitHandler: function() {
            var formData = new FormData($('#UserRoleForm')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/save-user-role",  
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
                        $('#UserRoleForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#CommonModal').modal('hide');
                            userRoleTable.draw();
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
// View User Role-->
$('body').on('click',"a.view-user-role",function(){
    var id = $(this).data('id');
    var name = $(this).data('name');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/view-user-role",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            if(res["status"]) {

                $('.modal-title').text('').text("User Role ("+name+")");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#formContent").html(res["message"]);
                user_role_form();
                hideLoader();
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
})

$("body").on("change", ".submenu", function(e) {
    if ($(this).is(':checked')) {
        var obj = $(this);
        var parent = obj.data("parent");
        $('#menu'+parent).prop("checked", true);
    }
});
$("body").on("change",".parent_menu",function(){
    if ($(this).is(':checked')) {
        var obj = $(this);
        obj.parents("li").find(".submenu").prop("checked", true);
    }
    else if (!$(this).is(':checked')) {
        var obj = $(this);
        obj.parents("li").find(".submenu").prop("checked", false);
    }
});
// Delete User Role 
$("body").on("click", "a.remove-user-role", function(e) {                   
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
                url:base_url+"/delete-user-role",  
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
                            userRoleTable.draw();
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
// User Role Edit -->
$('body').on('click',"a.edit-role",function(){
    var id = $(this).data('id');
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-user-role",  
        type: "POST",
        data:  {id:id},
        dataType:"json", 
        beforeSend:function(){  
            showLoader();
        },  
        success:function(res){
            hideLoader();
            if(res["status"]) {
                $('.modal-title').text('').text("Update User Role");
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
                $('#password').prop('disabled', true);
                $('#confirm_password').prop('disabled', true);
                $('#employee_id').prop('disabled', true);
                $('#employee').css("display", "none");
                
                user_role_form();
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