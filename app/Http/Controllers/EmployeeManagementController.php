<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use DataTables;
use DB;

class EmployeeManagementController extends Controller
{
    

    // View Employee management
    public function employee_management(){
        return view('backend.employee.employee_management');
    }

    // Add Employee
    public function add_employee(){
        return view('backend.employee.employee_from');
    }

    // Save Employee
    public function save_employee(Request $request){
        if(!empty($request->hidden_id)){
            $selectData= Employee::where([['id', '!=', $request->hidden_id],['email', '=', $request->email]])->get()->toArray();
            if(count($selectData) > 0) {
                $returnData = ["status" => 0, "msg" => "Enter User name already exist. Please try with another user name."];
            }else {
                $data = Employee::where('id',$request->hidden_id)->first();
                $item = $request->image;
                $var = date_create();
                $time = date_format($var, 'YmdHis');
                if(!empty($item)){
                    $imageName = $time . '-' . $item->getClientOriginalName();
                    $item->move(public_path() . '/assets/backend/images/userImages/', $imageName);

                    if (file_exists(public_path($item->getClientOriginalName())))
                    {
                        unlink(public_path($request->hidden_image));
                    };
                }
                $data->first_name = $request->first_name;
                $data->last_name = $request->last_name;
                $data->department = $request->department;
                $data->email = $request->email;
                $data->phone_no = $request->phone_number;
                $data->address = $request->address;
                $data->status = "1";
                if(!empty($item)){
                    $data->images = $imageName;
                }
                $saveData= $data->save();
                if($saveData) {
                    $returnData = ["status" => 1, "msg" => "Employee Update successful."];
                }else {
                    $returnData = ["status" => 0, "msg" => "Employee Update failed! Something is wrong."];
                }
            }
        }else{
            $selectData= Employee::where([['email', '=', $request->email], ['status', '=', '1']])->get()->toArray();
            if(count($selectData) > 0) {
                $returnData = ["status" => 0, "msg" => "Enter Employee name already exist. Please try with another user name."];
            }else {
                $data = new Employee;
                $item = $request->image;
                $var = date_create();
                $time = date_format($var, 'YmdHis');
                $imageName = $time . '-' . $item->getClientOriginalName();
                $item->move(public_path() . '/assets/backend/images/userImages/', $imageName);

                $data->first_name = $request->first_name;
                $data->last_name = $request->last_name;
                $data->department = $request->department;
                $data->email = $request->email;
                $data->phone_no = $request->phone_number;
                $data->address = $request->address;
                $data->status = "1";
                $data->images = $imageName;
                $saveData= $data->save();
                if($saveData) {
                    $returnData = ["status" => 1, "msg" => "Employee Save successful."];
                }else {
                    $returnData = ["status" => 0, "msg" => "Employee Save failed! Something is wrong."];
                }
            }
        }
        return response()->json($returnData);
    }

    // Employee List
    public function get_employee_list(Request $request){
        if ($request->ajax()) {
            $order = $request->input('order.0.dir');
            $keyword = $request->input('search.value');
            $query = DB::table('employee');
            $query->select('*');
            if($keyword) {
                $query->whereRaw("(id like '%$keyword%') or (first_name like '%$keyword%')");
            }
            if($order) {
                if($order == "asc")
                    $query->orderBy('first_name', 'asc');
                else
                    $query->orderBy('id', 'desc');
            }else {
                $query->orderBy('id', 'DESC');
            }

            $query->where([['status', '=', '1']]);



            $datatable_array=Datatables::of($query)
            ->addColumn('action', function ($query) {
                $action = ' <a href="javascript:void(0)" class="edit-employee" data-id="'.$query->id.'"><button type="button" class="btn btn-primary btn-sm" title="Edit Employee"><i class="fa fa-pencil"></i></button></a> <a href="javascript:void(0)" class="delete-employee" data-id="'.$query->id.'"><button type="button" class="btn btn-danger btn-sm" title="Delete Employee"><i class="fa fa-trash"></i></button></a>';
                return $action;
            })
            ->addColumn('userImage', function ($query){
                $url=asset("/public/assets/backend/images/userImages/$query->images");
                $userImage = '<img src="'.$url.'" title="" style="width:50%; height:52px" />';
                return  $userImage;
           })
           
            ->rawColumns(['action','userImage'])
            ->make();
            $data=(array)$datatable_array->getData();
            $data['page']=($_POST['start']/$_POST['length'])+1;
            $data['totalPage']=ceil($data['recordsFiltered']/$_POST['length']);
            return $data;
        }
    }

    // Delete Employee
    public function delete_employee(Request $request){
        if($request->ajax()){
            $saveData = Employee::where('id', $request->id)->update(['status' => "0",]);
            if($saveData) {
                $returnData = ["status" => 1, "msg" => "Delete successful."];
            }else {
                $returnData = ["status" => 0, "msg" => "Delete failed! Something is wrong."];
            }
        }
        return response()->json($returnData);
    }

    // Edit Employee
    public function edit_employee(Request $request){
        if($request->ajax()){
            $employeeData = Employee::where('id',$request->id)->get()->toArray();
            $html = view('backend.employee.employee_from')->with([
                'employee_data' => $employeeData,
            ])->render();
            return response()->json(["status" => 1, "message" => $html]);
        }
    }

}
