    var saleOrderTable = $('#saleReturn').DataTable({
        "dom": "<'row'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-6'<'toolbar'>>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        "processing": true,
        "serverSide": true,
        "ordering":true,
        "responsive": true,
        "order": [0, ''],
        "ajax": {
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            "url": base_url+"/sales-return-list",
            "type": "POST",
            'data': function(data){
              data.filter_customer=$("#filter_customer").val();
              data.filter_formDate=$("#form_date").val();
              data.filter_toDate=$("#to_date").val();
            },
            
        },
        'columns': [
            // {data: 'invoice_number', name: 'invoice_number', orderable: false, searchable: false},
            {data: 'sale_order_id', name: 'sale_order_id', orderable: false, searchable: false},
            {data: 'username', name: 'username', orderable: false, searchable: false},
            {data: 'invoiceDate', name: 'invoiceDate', orderable: false, searchable: false},
            {data: 'total_quantity', name: 'total_quantity', orderable: false, searchable: false},
            {data: 'good_quantity', name: 'good_quantity', orderable: false, searchable: false},
            {data: 'bad_quantity', name: 'bad_quantity', orderable: false, searchable: false},
            {data: 'action', name: 'action', orderable: false, searchable: false},
        ]
       
    }).on('xhr.dt', function(e, settings, json, xhr) {

    });
    $(".datetimepicker").datepicker({
      format: "yyyy-mm-dd",
      todayHighlight: true,
      autoclose: true,
    });
    $("#filter_customer").on('keyup',function(){
      saleOrderTable.draw();
    });
    
    $("#to_date").change(function(){
      var formDate = $("#form_date").val();
      var toDate = $("#to_date").val();
      if($("#form_date").val() != '' && (new Date(toDate) >= new Date(formDate))){
        saleOrderTable.draw();
      }
    });
    $('body').on('click', '.reset-filter', function() {
      $('#filter_customer').val('');
      $('#form_date').val('');
      $('#to_date').val('');
      saleOrderTable.draw();
  });
    $('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_order1_management" aria-expanded="false" class="btn-shadow btn btn-info" onclick="addSalesReturn()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-plus fa-w-20"></i></span>Add Sale Return</button>');

// Add sales Return
function addSalesReturn() {
  $.ajax({
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
      url: base_url + "/add-sales-return",
      type: "post",
      beforeSend: function () {
        showLoader();
      },
      success: function (res) {
        hideLoader();
        $(".modal-title").text("").text("Add sales Return");
        $("#CommonModal").modal({
          backdrop: "static",
          keyboard: false,
        });
        $("#formContent").html(res);
        $(".datetimepicker").datepicker({
          format: "dd/mm/yyyy",
          todayHighlight: true,
          autoclose: true,
        });
        $(".modal-dialog").addClass("modal-xl");
        sales_return_form();
      },
      error: function () {
        hideLoader();
        swal({ title: "Sorry!", text: "There is an error", type: "error" });
      },
      complete: function () {
        hideLoader();
      },
    });
  }


  function sales_return_form() {
    $("#CommonModal")
      .find("#SalesReturnForm")
      .validate({
        rules: {
          order_id: "required",
        },
        submitHandler: function () {
          var last_tr = $("body #inviceDetailsTbody tr").find("input");
          if (last_tr.length > 0) {
            var x = 0;
            $(last_tr).each(function () {
              if (
                $(this).val() == "" &&
                !$(this).hasClass("received_qty") &&
                !$(this).hasClass("good_qty") &&
                !$(this).hasClass("bad_qty") &&
                !$(this).hasClass("reason") &&
                !$(this).hasClass("remarks")
              ) {
                x = 1;
              }
            });
            if (x == 1) {
              swal("Warning!", "Enter data first", "warning");
            } else {
              var formData = new FormData($("#SalesReturnForm")[0]);
              $.ajax({
                headers: {
                  "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                },
                url: base_url + "/save-sales-return",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                beforeSend: function () {
                  showLoader();
                },
                success: function (res) {
                  if (res["status"] == 2) {
                    swal("Opps!", res["msg"], "error");
                    return false;
                  }
                  if (res["status"] == 1) {
                    swal({
                      title: "Success!",
                      text: res["msg"],
                      type: "success",
                    }).then(function () {
                      window.location.reload();
                    });
                  } else {
                    hideLoader();
                    swal("Opps!", res["msg"], "error");
                  }
                },
                error: function (e) {
                  hideLoader();
                  swal("Opps!", "There is an error", "error");
                },
                complete: function (c) {
                  hideLoader();
                },
              });
            }
          } else {
            swal("Warning!", "Load data first", "warning");
          }
        },
      });
  }

  // Get Invoice Details
  function addSalesReturninvoice(){
    var invoiceId = $("#invoiceId").val();
    var returnType = $("#returnType").val();
    // console.log(invoiceId); 
    // return false;
    if (invoiceId == "") {
      swal("Sorry!", "Please Select Invoice ID", "warning");
    } else {
      $.ajax({
        headers: {
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: base_url + "/get-invoice-details",
        type: "POST",
        data: { invoiceId: invoiceId },
        dataType: "json",
        beforeSend: function () {
          showLoader();
        },
        success: function (res) {
          console.log(res);
          if (res["status"]) {
            console.log();
            hideLoader();
            $("#inviceDetailsTbody").html("");
            $("#inviceDetailsTbody").append(res.data);
            // $("#hidden_warehouse_id").val(res.order_id);
            $(".modal-dialog").addClass("modal-xl");
          } else {
            hideLoader();
            swal("Sorry!", res.msg, "warning");
          }
        },
        error: function (e) {
          hideLoader();
          swal("Opps!", "There is an error", "error");
        },
        complete: function (c) {
          hideLoader();
        },
      });
    }
  }

  $('body').on('keyup','#inviceDetailsTbody .received_qty',function(){
    _this = $(this);
    var qty = parseInt(_this.parents('tr').find('.total-qty').val());
    var received_qty  = parseInt(_this.parents('tr').find('.received_qty').val());
    if(qty < received_qty){
      swal("Warning!", "Please Enter correct Quantity", "error");
      _this.parents('tr').find('.received_qty').val("0");
    }
  });

$('body').on('keyup','#inviceDetailsTbody .good_qty',function(){
  _this = $(this);
  var received_qty  = parseInt(_this.parents('tr').find('.received_qty').val());
  var good_qty  = parseInt(_this.parents('tr').find('.good_qty').val());

  if(received_qty < good_qty){
    swal("Warning!", "Please Enter correct Quantity", "error");
    _this.parents('tr').find('.good_qty').val("0");
  }else{
    bad_qty = (received_qty - good_qty);
    _this.parents('tr').find('.bad_qty').val(bad_qty);

  }
});

$('body').on('keyup','#inviceDetailsTbody .bad_qty',function(){
  _this = $(this);
  var received_qty  = parseInt(_this.parents('tr').find('.received_qty').val());
  var bad_qty  = parseInt(_this.parents('tr').find('.bad_qty').val());

  if(received_qty < bad_qty){
    swal("Warning!", "Please Enter correct Quantity", "error");
    _this.parents('tr').find('.bad_qty').val("0");
  }else{
    good_qty = (received_qty - bad_qty);
    _this.parents('tr').find('.good_qty').val(good_qty);

  }
});

  function viewSalesReturn(id){
      $.ajax({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          url:base_url+"/view-sales-return",
          type:'post',
          dataType:'JSON',
          data: {id:id},
          beforeSend:function(){
              showLoader();
          },
          success:function(res){
              if(res['status']) {
                  hideLoader();
                  $('.modal-title').text('').text("Sale Return Details");
                  $("#CommonModal").modal({
                      backdrop: 'static',
                      keyboard: false
                  });
                  $("#formContent").html(res['message']);
                  $(".modal-dialog").addClass('modal-xl');
              }else {
                  hideLoader();
              }
          },
          error:function(){
              hideLoader();
              swal({title: "Sorry!", text: "There is an error", type: "error"});
          },
          complete:function(){
              hideLoader();
          }
      });
  }
    // View sales Order Details
$(document).on('click', 'a.view-sales-return', function() {
  
  var obj = $(this);
  var id = obj.data("id");
  $.ajax({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url:base_url+"/view-sales-order-details",
      type:'post',
      dataType:'JSON',
      data: {id:id},
      beforeSend:function(){
          showLoader();
      },
      success:function(res){
          if(res['status']) {
              hideLoader();
              $('.modal-title').text('').text("View Order Details");
              $("#CommonModal").modal({
                  backdrop: 'static',
                  keyboard: false
              });
              $("#formContent").html(res['message']);
              $(".modal-dialog").addClass('modal-xl');
          }else {
              hideLoader();
          }
      },
      error:function(){
          hideLoader();
          swal({title: "Sorry!", text: "There is an error", type: "error"});
      },
      complete:function(){
          hideLoader();
      }
  });
});
  // $(document).on("click", "#get_order_detailss", function () {
  //   var order_id = $("#orderId").val();
  //   if (order_id == "") {
  //     swal("Sorry!", "Please Select Order ID", "warning");
  //   } else {
  //     $("#DownloadBarCode").show();
  //     $.ajax({
  //       headers: {
  //         "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
  //       },
  //       url: base_url + "/get-order-details",
  //       type: "POST",
  //       data: { order_id: order_id },
  //       dataType: "json",
  //       beforeSend: function () {
  //         showLoader();
  //       },
  //       success: function (res) {
  //         console.log(res);
  //         if (res["status"]) {
  //           console.log();
  //           hideLoader();
  //           $("#entryProductTbody").html("");
  //           $("#entryProductTbody").append(res.data);
  //           $("#hidden_warehouse_id").val(res.order_id);
  //           $(".modal-dialog").addClass("modal-xl");
  //         } else {
  //           hideLoader();
  //           swal("Sorry!", res.msg, "warning");
  //         }
  //       },
  //       error: function (e) {
  //         hideLoader();
  //         swal("Opps!", "There is an error", "error");
  //       },
  //       complete: function (c) {
  //         hideLoader();
  //       },
  //     });
  //   }
  // });
  

    function ExportSaleOrderTable() {
    window.location.href = base_url+"/sale-order-management-export";
    }
    function show_form(){
        $.ajax({
            url:base_url+"/add-new-order",
            type:'get',
            dataType:'html',
            beforeSend:function(){
                showLoader();
            },
            success:function(res){
                // console.log(res);
                hideLoader();
                // if(res['status']) {
                $('.modal-title').text('').text("Sale Order");
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
                // order_management_form();
                $('.selectpicker').selectpicker().change(function(){
                    $(this).valid()
                });
                $("#preview").hide();
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

    
    // List product by Part No
  $(document).off().on('keyup', '#order_row .part_no', function(element){
    var _this = $(this);
    var client = $('#client').val();
    var part_no = $(this).val();
    if(client == "") {
        swal("Warning!", "Please select a customer.", "error");
        $(this).val('');
    }else if(part_no != "") {
      
          $.ajax({
            url : base_url+"/getProductByPart", 
            type: 'GET',
            headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {part_no: part_no, client:client},
            dataType:'json',
            beforeSend:function(){  
                //showLoader();
            },
            success: function(res){
                if(res['status']) {
                    hideLoader();
                    _this.parents('td').find('.list-group').remove();
                    _this.parents('td').find('.part_no').after(res.data);
                }else {
                    _this.parents('td').find('.list-group').remove();
                    //hideLoader();
                }
            },
            error:function(error){
                //hideLoader();
                swal("Warning!", "Sorry! There is an error", "error");
            },
            complete:function(){
                //hideLoader();
            }
        });
      
        
    }else {
        _this.parents('td').find('.list-group').remove();
        _this.parents('tr').find('.entry-part-no').val('');
        _this.parents('tr').find('.entry-product-name').val('');
        _this.parents('tr').find('.entry-product-id').val('');
        _this.parents('tr').find('.entry-product-id').val('');
        _this.parents('tr').find('.category_name').val('');
        _this.parents('tr').find('.category_id').val('');
        _this.parents('tr').find('.gst').val('');
        _this.parents('tr').find('.mrp').val('');
    }
  });

  function checkAlreadyExistsProduct(_this,product_id)
    {
      console.log("ok",product_id);
      var parentTr = $(_this).parents("tr");
      var last_tr=$('table #order_row tr').not(parentTr).find('.product_id');
      var r=0;
      $(last_tr).not(_this).each(function(){
        if($(this).val()==product_id)
        {
          r=1;
          
        }
      });
      return r;
    }
  // Get Product Details
  $(document).on("click",'.sales-product-details',function(){
    var _this = $(this);
    var product_id = $(this).data('product-id');
    var pmpno = $(this).data('pmpno');
    if(!checkAlreadyExistsProduct(_this, product_id)) {
      $.ajax({
        url : base_url+"/salesOrder-product-details", 
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {part_no:pmpno},
        dataType:'json',
        beforeSend:function(){  
        },
        success: function(res){
          if(res.status == 1) {
            _this.parents('tr').find('.product_id').val(res.data[0].product_id);
            _this.parents('tr').find('.part_no').val(res.data[0].part_number);
            _this.parents('tr').find('.name').val(res.data[0].part_name);
            _this.parents('tr').find('.category_name').val(res.data[0].c_name);
            _this.parents('tr').find('.category_id').val(res.data[0].category_id);

            _this.parents('tr').find('.brand_id').val(res.data[0].category_id);
            _this.parents('tr').find('.uom_id').val(res.data[0].category_id);

            _this.parents('tr').find('.viewSupplierPrice').text("MRP: "+res.data[0].cost_price);
            _this.parents('tr').find('.avlQty').text(res.data[0].avl_qty);
            _this.parents('td').find('.list-group').remove();
          }else {
            _this.parents('tr').find('.part_no').val('');
            _this.parents('tr').find('.product_id').val("");
            _this.parents('tr').find('.name').val("");
            _this.parents('tr').find('.category_name').val("");
            _this.parents('tr').find('.category_id').val("");
            _this.parents('tr').find('.gst').val("");
            _this.parents('tr').find('.mrp').val("");
            _this.parents('tr').find('.stock').html("");
          }
        },
        error:function(error){
          swal("Warning!", "Sorry! There is an error", "error");
        },
        complete:function(){
        }
      });
    }else{
      swal("Warning!", "Sorry! You have already added this product", "error");
    }
      
  });

  $(document).on('click','.new_row',function(){
    $('#displayMessage').html('');
    var last_tr = $('body #order_row tr').find('input');
    var x=0;
    $(last_tr).each(function(){
        if($(this).val()=="" && !$(this).hasClass('mrp') && !$(this).hasClass('qty') &&  !$(this).hasClass('tax')) {
            x=1;
        }
    })
   if(x==1)
   {
     swal("Warning!", "Enter data first", "error");
   }else {
     var html='<tr><td><input type="hidden" name="product_id[]" class="form-control product_id"><input type="text" name="part_no[]" class="form-control part_no" autocomplete="off"></td><td><input type="text" readonly="readonly" name="name[]" class="form-control name"></td><td><input type="text" readonly="readonly" name="category_name[]" class="form-control category_name"><input type="hidden" name="category_id[]" class="form-control category_id"><input type="hidden" name="brand_id[]" id="brand_id" class="form-control brand_id"><input type="hidden" name="uom_id[]" id="uom_id" class="form-control uom_id"></td><td><input type="text" name="mrp[]" class="form-control mrp"><span class="viewSupplierPrice"></span></td><td class="stock" style="display:none"></td><td><input type="number" min="1" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="4" name="qty[]" class="form-control qty"><span class="">Avl Qty</span>-<span class="avlQty"></span></td><td><input type="number" min="1" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="4" name="tax[]" class="form-control tax"><input type="hidden" name="total_price[]" class="form-control total_price" id="totalPrice" value=""></td><td class="row_total"></td><td><button type="button" class="btn-shadow btn btn-info new_row" title="Add New Row"><i class="fa fa-plus"></i></button> <button type="button" class="btn-shadow btn btn-info trash" title="Trash"><i class="fa fa-trash"></i></button></td></tr>'
     $("#order_row").append(html);
   }
 });
 $(document).on('click','.trash',function(){
   $(this).parents('tr').remove();
   final_calculation();
 });

  $('body').on('keyup','#order_row .tax, #order_row .qty, #order_row .mrp',function(){
    _this = $(this);
    var qty = _this.parents('tr').find('.qty').val();
    var supplier_price = _this.parents('tr').find('.mrp').val();
    var avlQty = _this.parents('tr').find('.avlQty').text();
    console.log(avlQty);  
    var tax = _this.parents('tr').find('.tax').val();
    // if(qty > parseInt(avlQty)){
    //   _this.parents('tr').find('.qty').val("");
    // }else{
      var taxAmount =  (tax / 100) * (qty * supplier_price);
      var totalTaxAmount = (taxAmount+(qty * supplier_price));
      _this.parents('tr').find('.row_total').html(totalTaxAmount);
      var totalPrice = _this.parents('tr').find('.total_price').val(totalTaxAmount);
    // }
});

  function final_calculation(){
    var sub_total=0;
    var total_tax=0;
    var grand_total=0;
    $('#order_row tr').each(function(){
      var mrp = parseFloat($(this).find('.mrp').val());
      var qty = $(this).find('.qty').val()==""?0:parseFloat($(this).find('.qty').val());
      var csub_total =(mrp*qty);
      sub_total += parseFloat(csub_total);
    });
    grand_total = sub_total+total_tax;
    $("#sub-total").val(sub_total.toFixed(3));
    $("#expertSubTotalWithTax").val(grand_total.toFixed(3));

    $("#sub-total1").html(sub_total.toFixed(3));
    $("#expertSubTotalWithTax1").html(grand_total.toFixed(3));
  }


  // Save Request Order
$(document).on('click', '#saveSalesOrder', function(){
  var form = $('#CreateNewOrderForm');
  var client = $('#client').val();
  if(client == '') {
      swal("Sorry!", "Please select client", "error");
  }else {
      var last_tr = $('body #order_row tr').find('input');
      var x=0;
      $(last_tr).each(function(){
          if($(this).val()=="" && !$(this).hasClass('part_no') && !$(this).hasClass('name') ) {
              x=1;
          }
      })
      if(x==1) {
          swal("Sorry!", "Enter data first", "error");
      }else {
          swal({
              title: "Are you sure?",
              text: "You want to save this order request!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes',
              cancelButtonText: "No",
          }).then(function(isConfirm) {
              if (isConfirm && isConfirm.value) {
                  var formData = form.serializeArray();
                  formData.push({ name: "orders_status", value: "SaveOrder" });
                  $.ajax({
                      url : base_url+"/save-sales-order-management", 
                      type: 'post',
                      headers: {
                          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                      },
                      data: formData,
                      dataType:'json',
                      beforeSend:function(){  
                        $("#loader").css("display","block");
                      },
                      success: function(res){
                          if(res['status']) {
                              swal({
                                  title: 'Success',
                                  text: res['msg'],
                                  icon: 'success',
                                  type:'success',
                              }).then(function() {
                              window.location.href=base_url+"/"+res.return_url;
                          });
                      }
                      else {
                          swal("Warning!", res['msg'], "error");
                      }
                  },
                  error:function(error){
                    swal("Warning!", "Sorry! There is an error", "error");
                  },
                  complete:function(){
                    $("#loader").css("display","none");
                  }
                });
              }
          });
      }
  }            
});

// View Approve Order Details
$(document).on('click', 'a.approve-order-details', function() {
  console.log("Hello");
  var obj = $(this);
  var id = obj.data("id");
  $.ajax({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url:base_url+"/approve-sales-order-details",
      type:'post',
      dataType:'JSON',
      data: {id:id},
      beforeSend:function(){
          showLoader();
      },
      success:function(res){
          if(res['status']) {
              hideLoader();
              $('.modal-title').text('').text("Approve Order Details");
              $("#CommonModal").modal({
                  backdrop: 'static',
                  keyboard: false
              });
              $("#formContent").html(res['message']);
              $(".modal-dialog").addClass('modal-xl');
              checkSaleOrderItem();
          }else {
              hideLoader();
          }
      },
      error:function(){
          hideLoader();
          swal({title: "Sorry!", text: "There is an error", type: "error"});
      },
      complete:function(){
          hideLoader();
      }
  });
});

// Delete section
$(document).on("click", ".delete-order-details", function(e) {              
  var obj = $(this);
  var order_detail_id = obj.data("id");
  swal({
      title: "Are you sure?",
      text: "You want to remove it.",
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
              url:base_url+"/delete-sales-order-details",  
              type: "POST",
              data:  {order_detail_id: order_detail_id},
              beforeSend:function(){  
              },  
              success:function(res){
                  if(res["status"] == 1) {
                      swal({
                          title: "Success!",
                          text: res["msg"],
                          type: "success"
                      }).then(function() {
                        $("#"+order_detail_id).remove();
                        checkSaleOrderItem();
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
        }
  })
});

$(document).on('click', '#saveApproveOrder', function(e){
      var order_id = $('#order_id').val();
      swal({
          title: "Are you sure?",
          text: "You want to save this order!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes',
          cancelButtonText: "No",
      }).then(function(isConfirm) {
        if (isConfirm && isConfirm.value) {
          var formData = new FormData();
          formData.append('order_id',order_id);
          var r=0;
          $("#approve_order tbody ").find('tr').each(function(i){
            if($(this).find('input[type="checkbox"]').prop('checked') == true){
              
              formData.append('product_id[]',$(this).find('input[type="checkbox"]:checked').val());
              formData.append('allocated_qty[]',$(this).find('.allocated-qty').val());
              if($(this).find('.allocated-qty').val()!="")
              {
                r=1;
              }else{
                r=0;
              }
            }
          });
          if(r==0)
          {
            swal("Warning!", "Please checked at least one row and set quantity", "error");
            return;
          }
          $.ajax({
            url : base_url+"/save-approve-order", 
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: formData,
            processData: false,
            contentType: false,
            dataType:'json',
            beforeSend:function(){  
              $("#loader").css("display","block");
            },
            success: function(res){
              if(res['status'] == 1)
              {
                 swal({
                    title: 'Success',
                    text: res['msg'],
                    icon: 'success',
                    type:'success',
                  }).then(function() {
                    window.location.href=base_url+"/sale-order-management";
                  });
              }
              else
              {
                swal("Warning!", res['msg'], "error");
              }
            },
            error:function(error){
              swal("Warning!", "Sorry! There is an error", "error");
            },
            complete:function(){
              $("#loader").css("display","none");
            }
          });
        }
      });
})
function checkSaleOrderItem(){
   console.log($('#approve_order').find('tr').length);
    if($('#approve_order').find('tr').length==1){
      $(document).find("#saveApproveOrder").hide();
    }
    else{
      $(document).find("#saveApproveOrder").show();
    }
  }


  // View sales Order Details
$(document).on('click', 'a.view-perchase-order', function() {
  var obj = $(this);
  var id = obj.data("id");
  $.ajax({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url:base_url+"/view-sales-order-details",
      type:'post',
      dataType:'JSON',
      data: {id:id},
      beforeSend:function(){
          showLoader();
      },
      success:function(res){
          if(res['status']) {
              hideLoader();
              $('.modal-title').text('').text("View Order Details");
              $("#CommonModal").modal({
                  backdrop: 'static',
                  keyboard: false
              });
              $("#formContent").html(res['message']);
              $(".modal-dialog").addClass('modal-xl');
          }else {
              hideLoader();
          }
      },
      error:function(){
          hideLoader();
          swal({title: "Sorry!", text: "There is an error", type: "error"});
      },
      complete:function(){
          hideLoader();
      }
  });
});

    // Edit
    $(document).on('click', '.sales-order-edit', function() {
        var sale_order_id = $(this).data("sale-order-id");
        $.ajax({
            headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url:base_url+"/sales-order/sales-order-edit",
            type:'get',
            data: {sale_order_id: sale_order_id},
            dataType:'html',
            beforeSend:function(){
                showLoader();
            },
            success:function(res){
                // console.log(res);
                hideLoader();
                // if(res['status']) {
                $('.modal-title').text('').text("Update Order");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(".modal-dialog").removeClass('modal-lg');
                $(".modal-dialog").addClass('modal-xl');
                $("#formContent").html(res);
                $('.selectpicker').selectpicker().change(function(){
                    $(this).valid()
                });
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
    
    $(document).on('click', '.edit-order-details', function() {
      var sale_order_id = $(this).data("sale-order-id");
      $.ajax({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url:base_url+"/edit-new-order",
        type:'get',
        data: {sale_order_id: sale_order_id},
        dataType:'html',
        beforeSend:function(){
            showLoader();
        },
        success:function(res){
            // console.log(res);
            hideLoader();
            // if(res['status']) {
            $('.modal-title').text('').text("Update Order");
            $("#CommonModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $(".modal-dialog").removeClass('modal-lg');
            $(".modal-dialog").addClass('modal-xl');
            $("#formContent").html(res);
            //$('.input-tags').tagsInput();
            // $("#engine_tag").attr("placeholder", "Engine No*");
            // $("#engine_tag").css("width", "100px");
            // $("#chassis_model_tag").attr("placeholder", "Chassis / Model");
            // $("#chassis_model_tag").css("width", "100px");
            // $("#manfg_no_tag").attr("placeholder", "Manufacturer No*");
            // $("#manfg_no_tag").css("width", "110px");
            // $("#altn_part_tag").attr("placeholder", "Alternate Part No*");
            // $("#altn_part_tag").css("width", "110px");
            // $("#preview").hide();
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
    });
    
    // function checkAlreadyExistsProduct(_this,product_id)
    // {
    //   var parentTr = $(_this).parents("tr");
    //   var last_tr=$('table#new_order tr').not(parentTr).find('.product_id');
    //   var r=0;
    //   $(last_tr).not(_this).each(function(){
    //     if($(this).val()==product_id)
    //     {
    //       r=1;
          
    //     }
    //   });
    //   return r;
    // }
    // $(document).on('keyup paste','.qty',function()
    // {

    //   var current_stock = parseFloat($(this).parents('tr').find('.stock').html());
    //   console.log("current_stock", current_stock);
    //   var mrp = $(this).parents('tr').find('.mrp').val();
    //   var qty = $(this).parents('tr').find('.qty').val();
    //   var part_no = $(this).parents('tr').find('.part_no').val();

    //   if(qty > current_stock || isNaN(current_stock)) {
    //     $('#displayMessage').html('').append('<span style="color:red">This part no "'+part_no+'" quantity greater than stock, it will be placed in non stock order.</span><br/>');
    //   }

    //   var gst = $(this).parents('tr').find('.gst').val();
    //   var tax_rate = $('#hidden_tax_rate').val();
    //   var cal_gst = 0;

    //   if(qty != "" && qty > 0 && mrp > 0) {
    //     var net_total = parseFloat(mrp) * parseFloat(qty);
    //     cal_gst = (net_total * tax_rate) / 100;
    //     cal_gst = cal_gst.toFixed(3);
    //     net_total = net_total.toFixed(3);
    //     $(this).parents('tr').find('.row_total').html(net_total);
    //     $(this).parents('tr').find('.gst').val(cal_gst);
    //     $(this).parents('tr').find('.qty').css('border-color','#ced4da');

    //     final_calculation();
    //   }
      
    // });
    
    

    // function final_calculation(){
    //   var sub_total=0;
    //   var total_tax=0;
    //   var grand_total=0;
    //   var cal_gst = 0;
    //   var tax_rate = $('#hidden_tax_rate').val();
    //   $('#order_row tr').each(function(){
    //     var mrp = parseFloat($(this).find('.mrp').val());
    //     var qty = $(this).find('.qty').val()==""?0:parseFloat($(this).find('.qty').val());
    //     var gst = parseFloat($(this).find('.gst').val());
    //     var csub_total =(mrp*qty);
    //     //total_tax +=((parseFloat(mrp)*parseFloat(qty))*parseFloat(gst))/100;
    //     cal_gst = (csub_total * tax_rate)/100;
    //     total_tax += cal_gst;
    //     cal_gst = cal_gst.toFixed(3);
    //     //sub_total += parseFloat(csub_total) + parseFloat(cal_gst);
    //     sub_total += parseFloat(csub_total);
    //     //console.log("sub_total", sub_total);
    //   });
    //   grand_total = sub_total+total_tax;
    //   $("#sub-total").val(sub_total.toFixed(3));
    //   $("#tax").val(total_tax.toFixed(3));
    //   $("#expertSubTotalWithTax").val(grand_total.toFixed(3));

    //   $("#sub-total1").html(sub_total.toFixed(3));
    //   $("#tax1").html(total_tax.toFixed(3));
    //   $("#expertSubTotalWithTax1").html(grand_total.toFixed(3));
    // }
    // List product by Part No
    // $(document).on('keyup input', '.part_no', function(element){
    //     // alert();
    //     var _this = $(this);
    //     var part_no = $(this).val();
    //     $.ajax({
    //       url : base_url+"/get-product-by-part-no-order", 
    //       type: 'POST',
    //       headers: {
    //       'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //       },
    //       data: {part_no: part_no},
    //       dataType:'json',
    //       beforeSend:function(){  
    //         //$("#loader").css("display","block");
    //       },
    //       success: function(res){
    //         // console.log(res.data);
    //         if(res['status']) {
    //           console.log(res);
    //           _this.parents('td').find('.list-group').remove();
    //           _this.parents('td').find('.part_no').after(res.data);
    //         }else {
    //           //swal("Warning!", res['msg'], "error");
    //         }
    //       },
    //       error:function(error){
    //         swal("Warning!", "Sorry! There is an error", "error");
    //       },
    //       complete:function(){
    //         //$("#loader").css("display","none");
    //       }
    //     });
    // });
    // Get Product Details
    $(document).on("click",'.product-details',function(){
      var product_id = $(this).data('product-id');
      var pmpno = $(this).data('pmpno');
      _this = $(this);
      if(!checkAlreadyExistsProduct(_this, product_id)) {
        $.ajax({
          url : base_url+"/product-details", 
          type: 'POST',
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {part_no:pmpno},
          dataType:'json',
          beforeSend:function(){  
            //$("#loader").css("display","block");
          },
          success: function(res){
            if(res.length > 0) {
              _this.parents('tr').find('.part_no').val(res[0].pmpno);
              _this.parents('tr').find('.product_id').val(res[0].product_id);
              _this.parents('tr').find('.product_id').val(res[0].product_id);
              _this.parents('tr').find('.name').val(res[0].part_name);
              _this.parents('tr').find('.category_name').val(res[0].c_name);
              _this.parents('tr').find('.category_id').val(res[0].ct);
              _this.parents('tr').find('.gst').val(0);
              _this.parents('tr').find('.mrp').val(res[0].pmrprc);
              if(res[0].min_price > 0 && res[0].max_price > 0 && res[0].order_status != '')
              _this.parents('tr').find('.low_high').html("<span>Low Value: "+(res[0].min_price).toFixed(2)+"</span><br><span>High Value: "+(res[0].max_price).toFixed(2));
              _this.parents('tr').find('.qty').val("");
              _this.parents('tr').find('.qty').focus();
              _this.parents('tr').find('.row_total').html("");
              _this.parents('tr').find('.stock').html(res[0].current_stock==0?"":res[0].current_stock);
              //_this.parents('tr').find('.current-stock').val(res[0].current_stock==0?"":res[0].current_stock);
              _this.parents('td').find('.list-group').remove();
            }else {
              _this.parents('tr').find('.part_no').val('');
              _this.parents('tr').find('.product_id').val("");
              _this.parents('tr').find('.name').val("");
              _this.parents('tr').find('.category_name').val("");
              _this.parents('tr').find('.category_id').val("");
              _this.parents('tr').find('.gst').val("");
              _this.parents('tr').find('.mrp').val("");
              _this.parents('tr').find('.stock').html("");
            }
            
          },
          error:function(error){
            swal("Warning!", "Sorry! There is an error", "error");
          },
          complete:function(){
            //$("#loader").css("display","none");
          }
        });
      }else {
        swal("Warning!", "Sorry! You have already added this product", "error");
      }
    });
    $(document).on('click', '.preview-multiple-order', function(){
        var file_data = $('#product_csv').prop('files')[0]; 
        if(file_data)
        {  
          var form_data = new FormData();                  
          form_data.append('file', file_data);                         
          $.ajax({
              url: base_url+"/order-preview", 
              headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
              },
              dataType: 'html',  
              cache: false,
              contentType: false,
              processData: false,
              data: form_data,                         
              type: 'post',
              beforeSend:function(){
                    $("#loader").css("display","block");
              },
              success:function(res){
                $("#OrderPreviewModal").modal({
                    backdrop: 'static',
                    keyboard: false
                  });
              	$('#OrderPreviewModal .modal-title').text('').text("Order Preview");
                $("#OrderPreviewModal #formContent").html(res);
              },
              error:function(){
                  $("#loader").css("display","none");
              },
              complete:function(){
                  $("#loader").css("display","none");
              }
           });
        }
        else
        {
          swal("Warning!", "Please select file", "error");
        }
    })
    $(document).on('click','.create_mutiple_order_csv', function(){
      if($("#client").val() == "") {
        swal("Warning!", "Please select client", "error");
      }else {
        var file_data = $('#product_csv').prop('files')[0];   
        if(file_data) {
          var form_data = new FormData();                  
          form_data.append('file', file_data);  
          form_data.append('client', $("#client").val());                        
          $.ajax({
            url: base_url+"/create-multiple-order", 
            headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',  
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,                         
            type: 'post',
            beforeSend:function(){
                  $("#loader").css("display","block");
            },
            success:function(res){
              if(res['status']) {
                 swal({
                    title: 'Success',
                    text: res['msg'],
                    icon: 'success',
                    type:'success',
                  }).then(function() {
                    window.location.reload();
                  });
              }else {
                swal({
                    title: 'Warning',
                    text: res['msg'],
                    icon: 'error',
                    type:'error',
                  }).then(function() {
                    window.location.reload();
                  });
              }
            },
            error:function(){
                $("#loader").css("display","none");
            },
            complete:function(){
                $("#loader").css("display","none");
            }
          });
        }
        else
        {
          swal("Warning!", "Please select file", "error");
        }
        
      }
    })
    $(document).on('click','.file-upload-browse', function() {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
    });
    $(document).on('change', '.file-upload-default', function() {
      $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });
    $(document).on('change','#client', function() {
    	$("#preview").show();
    });
    $(document).on('click', '#download_template', function(){
      window.open(base_url+"/public/backend/file/order_template.csv");
    })
    $(document).on('click', '#CreateOrder', function(e){
      var form = $('#CreateNewOrderForm');
      e.preventDefault();
      var last_tr=$('table#new_order tr').find('input');
      var x=0;
      $(last_tr).each(function(){
        if($(this).val()=="") {
          x=1;
        }
      })
      if(x==1) {
        swal("Warning!", "Enter data first", "error");
      }else {
        if($("#client").val() == "" || $("#client").val() == null) {
          swal("Warning!", "Please select client", "error");
        }else {
          swal({
              title: "Are you sure?",
              text: "You want to create this order!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes',
              cancelButtonText: "No",
          }).then(function(isConfirm) {
            if (isConfirm && isConfirm.value) {
              var formData = form.serializeArray();
              formData.push({ name: "order_status", value: "CreateOrder" });
              $.ajax({
                url : base_url+"/create-order", 
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: formData,
                dataType:'json',
                beforeSend:function(){  
                  $("#loader").css("display","block");
                },
                success: function(res){
                  if(res['status'])
                  {
                     swal({
                        title: 'Success',
                        text: res['msg'],
                        icon: 'success',
                        type:'success',
                      }).then(function() {
                        window.location.href=base_url+"/sale-order-management";
                      });
                  }
                  else
                  {
                    swal("Warning!", res['msg'], "error");
                  }
                },
                error:function(error){
                  swal("Warning!", "Sorry! There is an error", "error");
                },
                complete:function(){
                  $("#loader").css("display","none");
                }
              });
            }
          });
        }
      }
    });
    $(document).on('click', '#UpdateOrder', function(e){
      var form = $('#CreateNewOrderForm');
      e.preventDefault();
      var last_tr=$('table#new_order tr').find('input');
      var x=0;
      $(last_tr).each(function(){
        if($(this).val()=="") {
          x=1;
        }
      })
      if(x==1) {
        swal("Warning!", "Enter data first", "error");
      }else {
        if($("#client").val() == "" || $("#client").val() == null) {
          swal("Warning!", "Please select client", "error");
        }else {
          swal({
              title: "Are you sure?",
              text: "You want to update this order!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes',
              cancelButtonText: "No",
          }).then(function(isConfirm) {
            if (isConfirm && isConfirm.value) {
              var formData = form.serializeArray();
              formData.push({ name: "order_status", value: "CreateOrder" });
              $.ajax({
                url : base_url+"/create-order", 
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: formData,
                dataType:'json',
                beforeSend:function(){  
                  $("#loader").css("display","block");
                },
                success: function(res){
                  if(res['status'])
                  {
                     swal({
                        title: 'Success',
                        text: res['msg'],
                        icon: 'success',
                        type:'success',
                      }).then(function() {
                        window.location.href=base_url+"/sale-order-management";
                      });
                  }
                  else
                  {
                    swal("Warning!", res['msg'], "error");
                  }
                },
                error:function(error){
                  swal("Warning!", "Sorry! There is an error", "error");
                },
                complete:function(){
                  $("#loader").css("display","none");
                }
              });
            }
          });
        }
      }
    });
    $(document).on('click', '#SaveOrder', function(e){
      var form = $('#CreateNewOrderForm');
      e.preventDefault();
      var last_tr=$('table#new_order tr').find('input');
      var x=0;
      $(last_tr).each(function(){
        if($(this).val()=="") {
          x=1;
        }
      })
      if(x==1) {
        swal("Warning!", "Enter data first", "error");
      }else {
        if($("#client").val() == "" || $("#client").val() == null) {
          swal("Warning!", "Please select client", "error");
        }else {
          swal({
              title: "Are you sure?",
              text: "You want to save this order!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes',
              cancelButtonText: "No",
          }).then(function(isConfirm) {
            if (isConfirm && isConfirm.value) {
              var formData = form.serializeArray();
              formData.push({ name: "order_status", value: "SaveOrder" });
              $.ajax({
                url : base_url+"/create-order", 
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: formData,
                dataType:'json',
                beforeSend:function(){  
                  $("#loader").css("display","block");
                },
                success: function(res){
                  if(res['status'])
                  {
                     swal({
                        title: 'Success',
                        text: res['msg'],
                        icon: 'success',
                        type:'success',
                      }).then(function() {
                        window.location.href=base_url+"/sale-order-management";
                      });
                  }
                  else
                  {
                    swal("Warning!", res['msg'], "error");
                  }
                },
                error:function(error){
                  swal("Warning!", "Sorry! There is an error", "error");
                },
                complete:function(){
                  $("#loader").css("display","none");
                }
              });
            }
          });
        }
      }
    })

    $("#sale_order").on('click','.view-order-details',function(){
        var sale_order_id= $(this).data('sale-order-id');
        var ordersatatus= $(this).data('ordersatatus');
        $.ajax({
            url:base_url+"/get-sale-order-details",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type:'POST',
            data:{sale_order_id:sale_order_id, ordersatatus:ordersatatus},
            beforeSend:function(){
                showLoader();
            },
            success:function(res){
                $('.modal-title').text('').text("Order Details (#"+sale_order_id+")");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(".modal-dialog").addClass('modal-lg');
                $("#formContent").html(res);
            },
            error:function(){
                hideLoader();
            },
            complete:function(){
                hideLoader();
            }
        })
    })

    $("#sale_order").on('click',".approved-order",function(){
        var sale_order_id= $(this).data('sale-order-id');
        $.ajax({
            url:base_url+"/get-sale-order-details-for-approve",
            headers:{
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type:'POST',
            data:{sale_order_id:sale_order_id},
            beforeSend:function(){
                showLoader();
            },
            success:function(res){
                $('.modal-title').text('').html('Order Details (#'+sale_order_id+') <a href="javascript:void(0)" class="add-entry-product"><button type="button" class="btn btn-success btn-sm" title="Add Entry"><i class="fa fa-plus" aria-hidden="true"></i></button></a>');
                $("#CommonModal").modal('show');
                $(".modal-dialog").addClass('modal-lg');
                $("#formContent").html(res);
                $("#sale_order_id").val(sale_order_id);
            },
            error:function(){
                hideLoader();
            },
            complete:function(){
                hideLoader();
            }
        }) 
    })
    // Add product entry
    $('body').on('click', 'a.add-entry-product', function() {
        var product_entry_count = $('#product_entry_count').val();
        $('#ListProductEntry').append('<tr id="entryProductRow'+product_entry_count+'"><td><input type="text" class="form-control entry-part-no" name="entry_part_no[]" autocomplete="off"></td><td><input type="text" class="form-control entry-product-name" name="entry_product_name[]" readonly="readonly"><input type="hidden" class="form-control entry-product-id" name="entry_product[]"></td><td><input type="number" class="form-control price" name="price[]" readonly="readonly"></td><td><input type="text" class="form-control qty" name="qty[]" readonly="readonly"></td><td><input type="number" class="form-control entry-product-approve-quantity" name="entry_product_approve_quantity[]" placeholder="Enter qty"></td><td style="width: 12%;"><button type="button" class="btn btn-danger btn-sm" title="Remove" onclick="removeProductEntry('+product_entry_count+')"><i class="fa fa-trash" aria-hidden="true"></i></button></td></tr>');
        $('#product_entry_count').val(parseInt(product_entry_count)+1);
    });
    function removeProductEntry(line_no) {
        $('#entryProductRow'+line_no).remove();
    }
    $("body").on('keyup input', '#ListProductEntry .entry-part-no', function(element){
        var _this = $(this);
        var part_no = $(this).val();
        if(part_no != "") {
            $.ajax({
                url : base_url+"/sale-order/get-product-by-part-no", 
                type: 'POST',
                headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: {part_no: part_no},
                dataType:'json',
                beforeSend:function(){  
                    //showLoader();
                },
                success: function(res){
                    console.log(res);
                    if(res['status']) {
                        hideLoader();
                        _this.parents('td').find('.list-group').remove();
                        _this.parents('td').find('.entry-part-no').after(res.data);
                    }else {
                        _this.parents('td').find('.list-group').remove();
                        //hideLoader();
                    }
                },
                error:function(error){
                    //hideLoader();
                    swal("Warning!", "Sorry! There is an error", "error");
                },
                complete:function(){
                    //hideLoader();
                }
            });
        }else {
            _this.parents('td').find('.list-group').remove();
            _this.parents('tr').find('.entry-part-no').val('');
            _this.parents('tr').find('.entry-product-name').val('');
            _this.parents('tr').find('.entry-product-id').val('');
            _this.parents('tr').find('.entry-product-id').val('');
            _this.parents('tr').find('.price').val('');
        }
    });
    $("body").on("click",'#ListProductEntry .product-details',function(){
        var product_entry_count = $('#product_entry_count').val();
        var pmpno = $(this).data('pmpno');
        _this = $(this);
        //if(!checkAlreadyExistsProduct(_this, pmpno)) {
            $.ajax({
                url : base_url+"/purchase_order/get-product-details", 
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: {part_no:pmpno, product_entry_count:product_entry_count},
                dataType:'json',
                beforeSend:function(){  
                    //showLoader();
                },
                success: function(res){
                    console.log(res);
                    if(res.data.length > 0) {
                        hideLoader();
                        _this.parents('tr').find('.entry-part-no').val(res.data[0].pmpno);
                        _this.parents('tr').find('.entry-product-name').val(res.data[0].part_name);
                        _this.parents('tr').find('.entry-product-id').val(res.data[0].product_id);
                        _this.parents('tr').find('.entry-product-id').val(res.data[0].product_id);
                        _this.parents('tr').find('.price').val(res.data[0].pmrprc);
                        //$('#product_entry_count').val(res.product_entry_count);
                        _this.parents('td').find('.list-group').remove();
                    }else {
                        //hideLoader();
                        _this.parents('tr').find('.entry-part-no').val('');
                        _this.parents('tr').find('.entry-product-name').val("");
                        _this.parents('tr').find('.entry-product-id').val("");
                    }
                },
                error:function(error){
                    //hideLoader();
                    swal("Warning!", "Sorry! There is an error", "error");
                },
                complete:function(){
                    //hideLoader();
                }
            });
        // }else {
        //     swal("Warning!", "Sorry! You have already added this product", "error");
        // }
    });
    $("#CommonModal").on("submit",'#sale_order_approve',function(e){
        var form_data=$(this).serialize();
        e.preventDefault();
        var r=0;
        $("#approve_table tbody").find("tr").each(function(){
            var prev_qty=$(this).find(".prev_qty").val();
            var appr_qty=$(this).find(".appr_qty").val();
            console.log(prev_qty+" "+appr_qty);
            if(appr_qty == "")
            {
                r=1;
                $(this).find(".appr_qty").focus();
            }
            else if(parseInt(prev_qty) < parseInt(appr_qty))
            {
                r=1;
                $(this).find(".appr_qty").focus();
                swal({title: "Sorry!", text: "Approve quantity can not be more than order quantity", type: "error"});
            }
        });
        if(r==0) {
            var last_tr = $('body #ListProductEntry tr').find('input');
            var x=0;
            $(last_tr).each(function(){
                if($(this).val()=="" && !$(this).hasClass('entry-product-name') && !$(this).hasClass('price') && !$(this).hasClass('qty')) {
                    x=1;
                }
            })
            if(x==1) {
                swal("Warning!", "Enter data first", "error");
            }else {
                $.ajax({
                    url:base_url+"/approve-order",
                    headers:{
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type:'POST',
                    data:form_data,
                    dataType:'json',
                    beforeSend:function(){
                        showLoader();
                    },
                    success:function(res){
                        if(res.status)
                        {
                            swal({title: "Success", text: res.msg, type: "success"});
                        }
                        else
                        {
                            swal({title: "Sorry!", text: res.msg, type: "error"});
                        }
                        saleOrderTable.draw();
                        $("#CommonModal").modal('hide');
                    },
                    error:function(){
                        hideLoader();
                    },
                    complete:function(){
                        hideLoader();
                    }
                })
            }
        }
    })
    $("body").on("click", "a.view-order-reject", function(e) {                  
        var obj = $(this);
        var id = obj.data("sale-order-id");
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url:base_url+"/sale_order/view-order-reject-form",  
            type: "POST",
            data:  {order_id: id},
            beforeSend:function(){
                showLoader();
            },  
            success:function(res){
                $('.modal-title').text('').text("Order Reject Details");
                $("#CommonModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#formContent").html(res);
                order_reject_form();
                hideLoader();
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
    function order_reject_form() {
        $("#CommonModal").find("#OrderRejectForm").validate({
            rules: {
                reason: "required",
            },
            submitHandler: function() {
                var formData = new FormData($('#OrderRejectForm')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    url:base_url+"/reject-sale-order",  
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
                            $('#OrderRejectForm')[0].reset();
                            swal({
                                title: "Success!",
                                text: res["msg"],
                                type: "success"
                            }).then(function() {
                                $('#CommonModal').modal('hide');
                                saleOrderTable.draw();
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
    
    
    $("body").on("click", "a.delete-sale-order-details", function(e) {                  
        var obj = $(this);
        var id = obj.data("id");
        var line_no = obj.data("line-no");
        swal({
            title: "Are you sure?",
            text: "You want to remove it.",
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
                    url:base_url+"/delete-sales-order-details",  
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
                                $('#orderDetailsTr'+line_no).remove();
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
                swal("Cancelled", "Data is Not Reject :)", "error")
            }
        })
    });
    $('body').on('click', '.download-order-template', function() {
        var template_name = $(this).data('template_name');
        window.open("http://iproatwms.co.in/order/public/backend/file/upload_order_csv/"+template_name);
    });
    // Download Invoice
    $('body').on('click', 'a.download-invoice', function() {
        var obj = $(this);
        var id = obj.data("sale-order-id");
        window.open(base_url+"/sale-order/download-invoice?id="+id, '_blank');
    });

    // Order Quantity update
    $('body').on('click',"a.order-quantity-update-form",function(){
      var id = $(this).data('sale_order_details_id');
      var current_stock = $(this).data('current_stock');
      var sl = $(this).data('sl');
      $.ajax({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          url:base_url+"/sale-order/order-quantity-update-form",  
          type: "POST",
          data:  {id:id},
          dataType:"json", 
          beforeSend:function(){  
              showLoader();
          },  
          success:function(res){
              hideLoader();
              if(res["status"]) {
                  $('#OrderPreviewModal .modal-title').text('').text("Update Quantity");
                  $("#OrderPreviewModal").modal({
                      backdrop: 'static',
                      keyboard: false
                  });
                  $("#OrderPreviewModal .modal-dialog").removeClass('modal-lg');
                  $("#OrderPreviewModal #formContent").html(res["message"]);
                  $('#OrderPreviewModal #formContent #current_stock').val(current_stock);
                  $('#OrderPreviewModal #formContent #sl').val(sl);
                  order_quantity_update_form();
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
    function order_quantity_update_form() {
      $("#OrderPreviewModal").find("#orderQuantityUpdateForm").validate({
          rules: {
              qty: "required"
          },
          submitHandler: function() {
            var formData = new FormData($('#orderQuantityUpdateForm')[0]);
            var qty=$('#qty').val();
            var sl=$('#sl').val();
            var current_stock=$('#current_stock').val();

            if(parseInt(qty) > parseInt(current_stock)) {
              swal("Sorry!", "Enter quantity not available in stock!", "warning");
              return false;
            }else {
              $.ajax({
                  headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                  },
                  url:base_url+"/sale-order/update-order-quantity",  
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
                          $('#orderQuantityUpdateForm')[0].reset();
                          swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                            $('#showQty'+sl).html('').html(res["qty"]);
                            $('#OrderPreviewModal').modal('hide');
                              //currencyList.draw();
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
          }
      });
    }
    $('body').on('click',"a.order-price-update-form",function(){
      var id = $(this).data('sale_order_details_id');
      var sl = $(this).data('sl');
      $.ajax({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          url:base_url+"/sale-order/order-price-update-form",  
          type: "POST",
          data:  {id:id},
          dataType:"json", 
          beforeSend:function(){  
              showLoader();
          },  
          success:function(res){
              hideLoader();
              if(res["status"]) {
                  $('#OrderPreviewModal .modal-title').text('').text("Update Price");
                  $("#OrderPreviewModal").modal({
                      backdrop: 'static',
                      keyboard: false
                  });
                  $("#OrderPreviewModal .modal-dialog").removeClass('modal-lg');
                  $("#OrderPreviewModal #formContent").html(res["message"]);
                  $('#OrderPreviewModal #formContent #sl').val(sl);
                  order_price_update_form();
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
    function order_price_update_form() {
      $("#OrderPreviewModal").find("#orderPriceUpdateForm").validate({
          rules: {
              product_price: "required"
          },
          submitHandler: function() {
            var formData = new FormData($('#orderPriceUpdateForm')[0]);
            var sl=$('#sl').val();
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/sale-order/update-order-price",  
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
                        $('#orderPriceUpdateForm')[0].reset();
                        swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                          $('#showPrice'+sl).html('').html(res["product_price"]);
                          $('#OrderPreviewModal').modal('hide');
                            //currencyList.draw();
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

    $(document).on('submit', '#approved_order', function() {
      console.log("Hello");
      var obj = $(this);
      var id = obj.data("id");
      var formData = $(this).serializeArray();
      $.ajax({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          url:base_url+"/save-approve-order",
          type:'post',
          dataType:'JSON',
          data:formData,
          beforeSend:function(){
              showLoader();
          },
          success:function(res){
              if(res['status']) {
                  hideLoader();
                  $('.modal-title').text('').text("Approve Order Details");
                  $("#CommonModal").modal({
                      backdrop: 'static',
                      keyboard: false
                  });
                  $("#formContent").html(res['message']);
                  $(".modal-dialog").addClass('modal-xl');
              }else {
                  hideLoader();
              }
          },
          error:function(){
              hideLoader();
              swal({title: "Sorry!", text: "There is an error", type: "error"});
          },
          complete:function(){
              hideLoader();
          }
      });
    });
    