
<div class="app-sidebar sidebar-shadow">
    <div class="app-header__logo">
        <div class="logo-src"></div>
        <div class="header__pane ml-auto">
            <div>
                <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
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

    <div class="scrollbar-sidebar">
        <div class="app-sidebar__inner">
            <ul class="vertical-nav-menu">
                <li class="app-sidebar__heading" style="margin: 0px;">&nbsp;</li>
                <li>
                    <a href="<?php echo url('/admin/dashboard'); ?>" class="{{ (request()->segment(1) == 'dashboard') ? 'mm-active' : '' }}">
                        <i class="fa fa-home metismenu-icon" aria-hidden="true"></i> Dashboard
                    </a>
                </li>

                <li>
                    <a href="<?php echo url('/admin/employee-management'); ?>" class="{{ (request()->segment(1) == 'employee-management') ? 'active' : '' }}">
                        <i class="fa fa-users metismenu-icon" aria-hidden="true"></i> Employee
                    </a>
                </li>

                <li>
                    <a href="<?php echo url('/admin/product-management'); ?>" class="{{ (request()->segment(1) == 'product-management') ? 'active' : '' }}">
                        <i class="fa fa-tasks metismenu-icon" aria-hidden="true"></i> Product
                    </a>
                </li>
                
            </ul>
        </div>
    </div>
</div>
