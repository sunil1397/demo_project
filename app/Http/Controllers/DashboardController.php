<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Session;
use Validator, Auth;
use App\Models\Employee;
use App\Models\Products;

class DashboardController extends Controller
{
    //View Dashboard

    public function dashboard(){
        
        $getEmployee = Employee::where('status',1)->get()->toArray();
        $getProducts = Products::where('status',1)->get()->toArray();
        return view('backend.dashboard')->with(['employee_data'=>$getEmployee,'product_data'=>$getProducts]);
    }
    
    
}
