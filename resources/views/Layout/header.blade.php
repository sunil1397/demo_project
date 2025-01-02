<div class="app-header header-shadow">
    <div class="app-header__logo">
        <img src="{{URL::asset('/public/backend/images/demo_logo.png')}}" alt="logo" style="width: 48%;height: 70px;">
        <div class="logo-src">
            
        </div>

    </div>
    <div class="app-header__mobile-menu">
        <div>
            <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>
        </div>
    </div>
    <div class="app-header__menu">
        <span>
            <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                <span class="btn-icon-wrapper">
                    <i class="fa fa-ellipsis-v fa-w-6"></i>
                </span>
            </button>
        </span>
    </div>
    <div class="app-header__content">
        <div>
            <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>&nbsp; <span class="hamburger-text">Collapse sidebar</span>
            </button>



        </div>
        <div class="app-header-right">
            <div class="header-dots">
                <div class="dropdown">

                    <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-xl rm-pointers dropdown-menu dropdown-menu-right notification-mobile">
                        <div class="dropdown-menu-header">
                            <div class="dropdown-menu-header-inner bg-plum-plate">
                                <div class="menu-header-image"></div>
                                <div class="menu-header-content text-white">
                                    <h5 class="menu-header-title">List</h5>
                                </div>
                            </div>
                        </div>
                        <div class="grid-menu grid-menu-xl grid-menu-3col">
                            <div class="no-gutters row">
                                <div class="col-sm-12 col-xl-12">
                                    <button class="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                        <i class="pe-7s-world icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"></i> Automation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dropdown">

                </div>
            </div>
            <div class="header-btn-lg pr-0">
                <div class="widget-content p-0">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                            <div class="btn-group">
                                <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="p-0 btn">
                                    <img width="30" class="rounded-circle" src="{{URL::asset('public/backend/images/default-user.png')}}" alt="">
                                    <i class="fa fa-angle-down ml-2 opacity-8"></i>
                                </a>
                                <div tabindex="-1" role="menu" aria-hidden="true" class="rm-pointers dropdown-menu-lg dropdown-menu dropdown-menu-right logout-panel">
                                    <div class="dropdown-menu-header">
                                        <div class="dropdown-menu-header-inner bg-info">
                                            <div class="menu-header-image opacity-2" style="background-image: url('assets/images/dropdown-header/city3.jpg');"></div>
                                            <div class="menu-header-content text-left">
                                                <div class="widget-content p-0">
                                                    <div class="widget-content-wrapper">
                                                        <div class="widget-content-left mr-3">
                                                            <img width="42" class="rounded-circle" src="{{URL::asset('public/backend/images/default-user.png')}}" alt="">
                                                        </div>
                                                        <div class="widget-content-left">
                                                            <div class="widget-heading"></div>

                                                        </div>
                                                        <div class="widget-content-right mr-2">
                                                            <a href="{{ route('admin.logout') }}" class="btn-pill btn-shadow btn-shine btn btn-focus">Logout</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a class="dropdown-item" href="<?php echo url('profile'); ?>" role="menuitem"><i class="fa fa-user" aria-hidden="true" style="margin-right: 5px;"></i>  Profile</a>
                                    <a href="javascript:void(0)" class="change-password dropdown-item"><i class="fa fa-key" aria-hidden="true" style="margin-right: 5px;"></i> Change Password</a>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="widget-content-left  ml-3 header-user-info">
                            <div class="widget-heading"> Admin </div>
                        </div>
                        <div class="widget-content-right header-user-info ml-3">
                            <button type="button" class="btn-shadow p-1 btn btn-primary btn-sm show-toastr-example">
                                <i class="fa text-white fa-calendar pr-1 pl-1"></i>
                            </button>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
