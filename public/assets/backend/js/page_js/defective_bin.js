// dataTable
var directbinTable = $('#direct_bin_List').DataTable({
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
        "url": base_url+"/direct-return-bin-list",
        "type": "POST",
        'data': function(data){
   
        },
        
    },
    'columns': [
        {data: 'order_id', name: 'order_id', orderable: true, searchable: false},
        {data: 'part_name', name: 'part_name', orderable: false, searchable: false},
        {data: 'part_number', name: 'part_number', orderable: false, searchable: false},
        {data: 'supplierName', name: 'supplierName', orderable: false, searchable: false},
        {data: 'quantity', name: 'quantity', orderable: false, searchable: false},
        {data: 'good_quantity', name: 'good_quantity', orderable: false, searchable: false},
        {data: 'bad_quantity', name: 'bad_quantity', orderable: false, searchable: false},
        {data: 'date', name: 'date', orderable: false, searchable: false},
    ],
    }).on('xhr.dt', function(e, settings, json, xhr) {});

$('#ResetFilter').on('click', function(){
   
    directbinTable.draw();
})


var CustomerReturnBin = $('#CustomerReturnBinList').DataTable({
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
        "url": base_url+"/customer-return-bin-list",
        "type": "POST",
        'data': function(data){
          // console.log(data);
        },
        
    },
    'columns': [
        // {data: 'id', name: 'id', orderable: true, searchable: false},
        {data: 'sale_order_id', name: 'sale_order_id', orderable: false, searchable: false},
        {data: 'customer_name', name: 'customer_name', orderable: true, searchable: false},
        {data: 'part_name', name: 'part_name', orderable: false, searchable: false},
        {data: 'category_name', name: 'category_name', orderable: false, searchable: false},
        {data: 'make_brand_name', name: 'make_brand_name', orderable: false, searchable: false},
        {data: 'uom_name', name: 'uom_name', orderable: false, searchable: false},
        {data: 'sale_order_qty', name: 'sale_order_qty', orderable: false, searchable: false},
        {data: 'received_qty', name: 'received_qty', orderable: false, searchable: false},
        {data: 'good_qty', name: 'good_qty', orderable: false, searchable: false},
        {data: 'bad_qty', name: 'bad_qty', orderable: false, searchable: false},
        {data: 'reason', name: 'reason', orderable: false, searchable: false},
        {data: 'remarks', name: 'remarks', orderable: false, searchable: false},
    ],
   
}).on('xhr.dt', function(e, settings, json, xhr) {
   
});

function ExportProductManagementTable() {
    var info = productTable.page.info();
    window.location.href = base_url+"/product-management-export?start="+info.start+"&end="+info.end;
}

