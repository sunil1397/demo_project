@extends('app_login')

@section('title', 'Demo Project')

@section('content')
<style>
    body{
        background-color:#f4f5f7 !important;
    }
    .card-body{
        padding: 30px 40px 28px 40px !important;
    }
    .card-header {
        padding: 20px 40px !important;
        align-items:center;
        display:block;
    }
    .admin-topbar {
    background-color: #EFF0F3;
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-top: 30px;
    border-radius: 0 0 6px 6px;
}
</style>
<!-- style="background-image: url('{{URL::asset('public/backend/images/demo_logo.jpg')}}');" -->
    <div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar bg-white" style="background-image: url('{{URL::asset('public/backend/images/admin-bg-light.png')}}');background-repeat: no-repeat;">
        <div class="app-main" style="padding-top: 0px">
            <div class="app-main__inner" style="padding-bottom: 30px">
                <div class="row">
                    <div class="col-md-6 offset-md-3 height-93vh display-table">
                        <div class="row display-table-cell" >
                            <h6 class="alert text-center">
                                @if(Session::get('error'))
                                    {{ Session::get('error') }}
                                @endif
                            </h6>
                            <div class="col-md-6 offset-md-3" >
                            <form class="pt-1" action="{{ route('admin.auth') }}" method="POST">
                            <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                                <div class="card">
                                    <div class="card-header">
                                        <img src="{{URL::asset('/public/backend/images/demo_logo.png')}}" alt="logo" style="width: 100%;height: 165px;">
                                        
                                    </div>
                                    <div class="card-body">
                                        <div class="position-relative form-group">
                                            
                                            <h5 class="text-center">Login</h5>
                                            <label for="exampleEmail" class="">Email Address</label>
                                            <input name="email" id="exampleEmail" placeholder="Enter a Email" type="email" class="form-control">
                                        </div>
                                        <div class="position-relative form-group">
                                            <label for="examplePassword" class="">Password</label>
                                            <input name="password" id="password" placeholder="Enter password" type="password" class="form-control">
                                        </div>
                                        <button type="submit" class="mt-1 btn btn-primary submit-btn" style="background-color: #eb832b; color: #fff; border-color: #eb832b;">Login</button>
                                    

                                    </div>
                                </div>
                            </form>


                        </div>
                        </div>
                        <div class="row display-table-footer-group">
                            <div class="col-md-12">
                                <p class="copy-right text-center mb-0">Copyright {{date('Y')}} Demo Project - All Rights Reserved</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
@endsection
