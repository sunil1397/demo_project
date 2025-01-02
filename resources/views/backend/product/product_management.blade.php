@extends('backend.admin_after_login')

@section('title', 'Product Management')

@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-certificate metismenu-icon" aria-hidden="true"></i>
                    </div>
                    <div>Product Management
                    </div>
                </div>
                <div class="page-title-actions">
                    <div class="d-inline-block">

                    </div>
                </div>
            </div>
        </div>
        <table style="width: 100%;" id="ProductManagement" class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th class="right-border-radius">Action</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
@endsection
@section('page-script')
<script src="{{ URL::asset('public/backend/js/page_js/productManagement.js')}}" type="text/javascript"></script>
@stop
