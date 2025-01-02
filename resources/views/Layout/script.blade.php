<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="{{ URL::asset('public/backend/js/popper.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/bootstrap.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/moment.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/sizzle.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/Chart.min.js')}}"></script>
<!-- ====================
    Datatable JS
==================== -->
<script src="{{ URL::asset('public/backend/js/jquery.dataTables.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/dataTables.bootstrap4.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/dataTables.responsive.js')}}"></script>
<script src="//cdn.datatables.net/buttons/1.4.0/js/buttons.html5.min.js"></script>

<script type="text/javascript" language="javascript" src="//cdn.datatables.net/buttons/1.6.5/js/dataTables.buttons.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.2.2/js/buttons.print.min.js"></script>
<script type="text/javascript" language="javascript" src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script type="text/javascript" language="javascript" src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script type="text/javascript" language="javascript" src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script type="text/javascript" language="javascript" src="//cdn.datatables.net/buttons/1.6.5/js/buttons.html5.min.js"></script>

<script src="{{ URL::asset('public/backend/js/perfect-scrollbar.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/cropper.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/clipboard.min.js')}}"></script>

<script src="{{ URL::asset('public/backend/js/metisMenu.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/jquery.blockUI.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/circle-progress.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/fullcalendar.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/jquery-ui.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/jquery.fancytree.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/bootstrap-table.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/datepicker.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/daterangepicker.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/jquery.inputmask.bundle.min.js')}}"></script>
<!-- ====================
    Validation JS
==================== -->
<script src="{{ URL::asset('public/backend/js/jquery.validate.js')}}"></script>
<!-- ====================
    Sweetalert JS
==================== -->
<script src="{{ URL::asset('public/backend/sweetalert2/js/sweetalert2.all.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/bootstrap-datepicker.min.js')}}"></script>
<script src="{{ URL::asset('public/backend/js/custom.js')}}"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>
<script src="{{ URL::asset('public/backend/js/jquery.tagsinput.min.js')}}"></script>





<script>
    // Save Change Password From
    function save_change_password_form() {
        $("#CommonModal").find("#ChangePasswordForm").validate({
            rules: {
                password: "required",
                confirm_password: "required"
            },
            submitHandler: function() {
                var formData = new FormData($('#ChangePasswordForm')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    url:base_url+"/admin/save-change-password",
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
                            $('#ChangePasswordForm')[0].reset();
                            swal({title: "Success!", text: res["msg"], type: "success"}).then(function() {
                                $('#CommonModal').modal('hide');
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
    
    $('body').on('click',"a.change-password",function(){
            var id = "1";
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:base_url+"/admin/change-password",
                type: "POST",
                data:  {id:id},
                dataType:"html",
                beforeSend:function(){
                    showLoader();
                },
                success:function(res){
                        hideLoader();
                        $('.modal-title').text('').text("Change Password");
                        $("#CommonModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#formContent").html(res);
                        save_change_password_form();
                    
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
</script>



