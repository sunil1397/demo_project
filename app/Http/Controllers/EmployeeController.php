<?php

namespace App\Http\Controllers;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    // Employee
    public function employee(){
        $getEmployee = Employee::where('status',1)->get()->toArray();
        return view('frontend.employee')->with(['get_employee'=>$getEmployee]);
    }
}
