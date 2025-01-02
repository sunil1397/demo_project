@extends('backend.admin_after_login')

@section('title', 'Dashboard')

@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-home metismenu-icon" aria-hidden="true"></i>
                    </div>
                    <div>Dashboard
                    </div>
                </div>
            </div>
        </div>

        <div class="row bottom-widget">
            <div class="col-lg-9">
                <div class="row">
                        <div class="col-md-6 col-lg-4">
                            <a href="<?php echo url('/admin/employee-management'); ?>">
                            <div class="widget-chart widget-chart2 text-left mb-3 card-shadow-primary card sky-blue-liner-gradient">
                                <div class="widget-chat-wrapper-outer">
                                    <div class="widget-chart-content ">
                                        <div class="row">
                                            <div class="col-lg-7 col-sm-7 col-7 con">
                                                <p class="number mb-0">
                                               {{ sizeof($employee_data); }}
                                                </p>
                                                <p class="title mb-0">Employee</p>
                                            </div>
                                            <div class="col-lg-4 col-sm-4 col-4 con-ico">
                                                <p class="icon mb-0"><i class="fa fa-users" aria-hidden="true"></i></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </a>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <a href="<?php echo url('/admin/product-management'); ?>">
                            <div class="widget-chart widget-chart2 text-left mb-3 card-shadow-primary card dip-blue-liner-gradient">
                                <div class="widget-chat-wrapper-outer">
                                    <div class="widget-chart-content ">
                                        <div class="row">
                                            <div class="col-lg-7 col-sm-7 col-7 con">
                                                <p class="number mb-0">
                                                    {{sizeof($product_data)}}
                                                </p>
                                                <p class="title mb-0">Products</p>
                                            </div>
                                            <div class="col-lg-4 col-sm-4 col-4 con-ico">
                                                <p class="icon mb-0"><i class="fa fa-hdd-o" aria-hidden="true"></i></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        

                    </div>
            </div>
        </div>
    </div>
@endsection
