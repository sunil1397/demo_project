var productManagement = (function () {
    var productTable = "";
    function table(){
        productTable = $('#ProductManagement').DataTable({
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
                "url": base_url+"/admin/get-product-list",
                "type": "POST",
                'data': function(data){},
            },
            'columns': [
                {data: 'id', name: 'id', orderable: true, searchable: false},
                {data: 'product_name', name: 'product_name', orderable: false, searchable: false},
                {data: 'price', name: 'price', orderable: false, searchable: false},
                {data: 'description', name: 'description', orderable: false, searchable: false},
                {data: 'productImage', name: 'userImage', orderable: false, searchable: false},
                {data: 'action', name: 'action', orderable: false, searchable: false},
            ],
            }).on('xhr.dt', function(e, settings, json, xhr) {

        });
        $('div.toolbar').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn-shadow btn btn-info show-product" title="Add Product"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Product</button>');
    }

    // Show Product From

    function show_form(){
		$(document).ready( function () {
			$('body').on('click','.show-product', function() {
				$.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
					url:base_url+"/admin/add-product",
					type:'post',
					dataType:'html',
					success:function(res){
                        hideLoader();
                        $('.modal-title').text('').text("Add Product");
                        $("#CommonModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#formContent").html(res);
                        save_product_form();
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

    // Product Data save
    function save_product_form() {
        $("#CommonModal").find("#productForm").validate({
            rules: {
                product_name: "required",
                price: "required",
                description: "required"
            },
            submitHandler: function() {
                var formData = new FormData($('#productForm')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    url:base_url+"/admin/save-product",
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
                            $('#productForm')[0].reset();
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

    // Edit Product
    function editProduct(){
        $('body').on('click',"a.edit-product",function(){
            var id = $(this).data('id');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/admin/edit-product",
                type: "POST",
                data:  {id:id},
                dataType:"json",
                beforeSend:function(){
                    showLoader();
                },
                success:function(res){
                    if(res["status"]) {
                        hideLoader();
                        $('.modal-title').text('').text("Update Product");
                        $("#CommonModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#formContent").html(res["message"]);
                        save_product_form();
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

    // Product Delete
    function deleteProduct(){
        $("body").on("click", "a.delete-product", function(e) {
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
                        url:base_url+"/admin/delete-product",
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
                                    productTable.draw();
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

    function deleteProductImages(){
        $(document).on('click', '.delete-product-images', function(){
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
                        url:base_url+"/admin/product-image-delete",
                        type: "POST",
                        data:  {id: id},
                        beforeSend:function(){
                        },
                        success:function(res){
                            if(res["status"] == 1) {
                                $(document).find('#img-'+id).remove();
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
            editProduct();
            deleteProduct();
            deleteProductImages();
            table();
        },
    };
}());
$(document).ready(function () { productManagement.init(); });
