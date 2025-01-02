    var purchaseOrderTable = $('#purchaseReturnReport').DataTable({
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
            "url": base_url+"/purchase-return-report-list",
            "type": "POST",
            'data': function(data){
                data.filter_supplier_name=$("#filter_supplier_name").val();
                data.filter_purchase_order_Id=$("#filter_purchase_order_Id").val();
                data.month=$("#month-dropdown").val();
                data.year=$("#dropdownYear").val();
            },
            
        },
        'columns': [
            // {data: 'invoice_number', name: 'invoice_number', orderable: false, searchable: false},
            {data: 'purchase_order_id', name: 'purchase_order_id', orderable: false, searchable: false},
            {data: 'supplier_name', name: 'supplier_name', orderable: false, searchable: false},
            {data: 'datetime', name: 'datetime', orderable: false, searchable: false},
            {data: 'checkIn_date', name: 'checkIn_date', orderable: false, searchable: false},
            // {data: 'action', name: 'action', orderable: false, searchable: false},
            {data: 'total_quantity', name: 'total_quantity', orderable: false, searchable: false},
            {data: 'good_quantity', name: 'good_quantity', orderable: false, searchable: false},
            {data: 'bad_quantity', name: 'bad_quantity', orderable: false, searchable: false},
            
        ]
       
    }).on('xhr.dt', function(e, settings, json, xhr) {

    });
    $("#filter_supplier_name").on('keyup input',function(){
        purchaseOrderTable.draw();
    });
    $("#filter_purchase_order_Id").on('keyup input',function(){
        purchaseOrderTable.draw();
    });
    $("#month-dropdown").on('change select',function(){
        purchaseOrderTable.draw();
    });
    $("#dropdownYear").on('change select',function(){
        purchaseOrderTable.draw();
    });
    $('body').on('click', '.reset-filter', function() {
        $('#filter_purchase_order_Id').val('');
        $('#supplier_name').val('');
        $('#month-dropdown').val('');
        $('#dropdownYear').val('');
        purchaseOrderTable.draw();
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


    $('div.toolbar').html('<button type="button" aria-haspopup="true" id="add_catagory" aria-expanded="false" class="btn-shadow btn btn-info" onclick="ExportPurchaseReportTable()"><span class="btn-icon-wrapper pr-2 opacity-7" ><i class="fa fa-download fa-w-20"></i></span>Export</button>');

function ExportPurchaseReportTable() {
    var info = purchaseOrderTable.page.info();
    window.location.href = base_url+"/purchase-return-export?start="+info.start+"&end="+info.end;
}



    
