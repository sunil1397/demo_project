<?php
use Illuminate\Support\Facades\Route; 

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great! 
|
*/
Auth::routes();




// ==================================== Frontend ================================
Route::get('/',[App\Http\Controllers\ProductController::class, 'product'])->name('admin.product');
Route::get('/employee',[App\Http\Controllers\EmployeeController::class, 'employee'])->name('admin.employee');




// ============================= Backend ====================================
Route::group(['prefix' => 'admin'], function() {
	Route::group(['middleware' => 'admin.guest'], function(){
		Route::view('/login','login')->name('admin.login');
		Route::post('/login-match',[App\Http\Controllers\LoginController::class, 'authenticate'])->name('admin.auth');
	});


    Route::group(['middleware' => ['admin.auth','admin.preventBackHistory']], function(){
        // ====================== Dashboard Controller ====================
        Route::get('/dashboard',[App\Http\Controllers\DashboardController::class, 'dashboard'])->name('admin.dashboard');

        // ====================== Employee Controller ==========================
        Route::get('/employee-management',[App\Http\Controllers\EmployeeManagementController::class, 'employee_management'])->name('admin.employee_management');
        Route::post('/add-employee',[App\Http\Controllers\EmployeeManagementController::class, 'add_employee'])->name('admin.add_employee');
        Route::post('/save-employee',[App\Http\Controllers\EmployeeManagementController::class, 'save_employee'])->name('admin.save_employee');
        Route::post('/get-employee-list',[App\Http\Controllers\EmployeeManagementController::class, 'get_employee_list'])->name('admin.get_employee_list');
        Route::post('/delete-employee',[App\Http\Controllers\EmployeeManagementController::class, 'delete_employee'])->name('admin.delete_employee');
        Route::post('/edit-employee',[App\Http\Controllers\EmployeeManagementController::class, 'edit_employee'])->name('admin.edit_employee');


        // ========================== Product Controller =============================
        Route::get('/product-management',[App\Http\Controllers\ProductManagementController::class, 'product_management'])->name('admin.product_management');
        Route::post('/add-product',[App\Http\Controllers\ProductManagementController::class, 'add_product'])->name('admin.add_product');
        Route::post('/get-product-list',[App\Http\Controllers\ProductManagementController::class, 'get_product_list'])->name('admin.get_product_list');
        Route::post('/save-product',[App\Http\Controllers\ProductManagementController::class, 'save_product'])->name('admin.save_product');
        Route::post('/delete-product',[App\Http\Controllers\ProductManagementController::class, 'delete_product'])->name('admin.delete_product');
        Route::post('/edit-product',[App\Http\Controllers\ProductManagementController::class, 'edit_product'])->name('admin.edit_product');
        Route::post('/product-image-delete',[App\Http\Controllers\ProductManagementController::class, 'product_image_delete'])->name('admin.product_image_delete');
        
    });

    Route::get('/logout',[App\Http\Controllers\LoginController::class, 'logout'])->name('admin.logout');
});

