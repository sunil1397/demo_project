    var saleOrderTable = $('#saleReturnReport').DataTable({
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
            "url": base_url+"/sales-return-report-list",
            "type": "POST",
            'data': function(data){
                data.filter_customer_name=$("#filter_customer_name").val();
                data.filter_sale_order_id=$("#filter_sale_order_Id").val();
                data.month=$("#month-dropdown").val();
                data.year=$("#dropdownYear").val();
            },
            
        },
        'columns': [
            // {data: 'invoice_number', name: 'invoice_number', orderable: false, searchable: false},
            {data: 'sale_order_id', name: 'sale_order_id', orderable: false, searchable: false},
            {data: 'username', name: 'username', orderable: false, searchable: false},
            {data: 'datetime', name: 'datetime', orderable: false, searchable: false},
            {data: 'returnDatetime', name: 'returnDatetime', orderable: false, searchable: false},
            {data: 'total_quantity', name: 'total_quantity', orderable: false, searchable: false},
            {data: 'good_quantity', name: 'good_quantity', orderable: false, searchable: false},
            {data: 'bad_quantity', name: 'bad_quantity', orderable: false, searchable: false},
            {data: 'action', name: 'action', orderable: false, searchable: false},
        ]
       
    }).on('xhr.dt', function(e, settings, json, xhr) {

    });
    $("#filter_customer_name").on('keyup input',function(){
        saleOrderTable.draw();
    });
    $("#filter_sale_order_Id").on('keyup input',function(){
        saleOrderTable.draw();
    });
    $("#month-dropdown").on('change select',function(){
        saleOrderTable.draw();
    });
    $("#dropdownYear").on('change select',function(){
        saleOrderTable.draw();
    });
    $('body').on('click', '.reset-filter', function() {
        $('#filter_sale_order_Id').val('');
        $('#filter_name').val('');
        saleOrderTable.draw();
    });

    $('#dropdownYear').each(function() {

      var year = (new Date()).getFullYear();
      var current = year;
      year -= 3;
      for (var i = 0; i < 6; i++) {
        if ((year+i) == current)
          $(this).append('<option selected value="' + (year + i) + '">' + (year + i) + '</option>');
        else
          $(this).append('<option value="' + (year + i) + '">' + (year + i) + '</option>');
      }

})

function viewSalesReturnReport(id){
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


   $('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportSaleReportTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportSaleReportTable() {
    var info = saleOrderTable.page.info();
    window.location.href = base_url+"/sales-return-export?start="+info.start+"&end="+info.end;
}




    
