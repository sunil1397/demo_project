<?php

namespace App\Http\Controllers;
use App\Models\Products;
use App\Models\ProductImages;
use Illuminate\Http\Request;
use DataTables;
use DB;
use File;

class ProductManagementController extends Controller
{
    // view Product management
    public function product_management(){
        return view('backend.product.product_management');
    }

    // List Product 

    public function get_product_list(Request $request){
        if ($request->ajax()) {
            $order = $request->input('order.0.dir');
            $keyword = $request->input('search.value');
            $query = DB::table('products');
            $query->select('*');
            if($keyword) {
                $query->whereRaw("(id like '%$keyword%') or (product_name like '%$keyword%')");
            }
            if($order) {
                if($order == "asc")
                    $query->orderBy('product_name', 'asc');
                else
                    $query->orderBy('id', 'desc');
            }else {
                $query->orderBy('id', 'DESC');
            }

            $query->where([['status', '=', '1']]);



            $datatable_array=Datatables::of($query)
            ->addColumn('action', function ($query) {
                $action = ' <a href="javascript:void(0)" class="edit-product" data-id="'.$query->id.'"><button type="button" class="btn btn-primary btn-sm" title="Edit Product"><i class="fa fa-pencil"></i></button></a> <a href="javascript:void(0)" class="delete-product" data-id="'.$query->id.'"><button type="button" class="btn btn-danger btn-sm" title="Delete Product"><i class="fa fa-trash"></i></button></a>';
                return $action;
            })
            ->addColumn('productImage', function ($query){
                $product_images = "";
                if(!empty($query->id)){
                    $images = ProductImages::where('fk_product_id',$query->id)->get()->toArray();
                    $image = $images[0]['product_image'];
                    $url=asset("/public/assets/backend/images/productImages/".$image);
                    $product_images = '<img src="'.$url.'" title="" style="width:77%; height:52px" />';

                }
                return $product_images;
           })
           
            ->rawColumns(['action','productImage'])
            ->make();
            $data=(array)$datatable_array->getData();
            $data['page']=($_POST['start']/$_POST['length'])+1;
            $data['totalPage']=ceil($data['recordsFiltered']/$_POST['length']);
            return $data;
        }
    }

    // Add Product

    public function add_product(){
        return view('backend.product.product_management_from');
    }

    // Save product

    public function save_product(Request $request){
        if(!empty($request->hidden_id)){
            $data = Products::where('id',$request->hidden_id)->first();
            $data->product_name = $request->product_name;
            $data->price = $request->price;
            $data->description = $request->description;
            $data->status = "1";
            $saveData= $data->save();

            $images = $request->file('image');
                if($request->hasFile('image')){
                    foreach ($images as $item){
                        $var = date_create();
                        $time = date_format($var, 'YmdHis');
                        $imageName = $time . '-' . $item->getClientOriginalName();
                        $item->move(public_path() . '/assets/backend/images/productImages/', $imageName);
                        $arr[] = $imageName;

                        $data2 = new ProductImages;
                        $data2->product_image = $imageName;
                        $data2->fk_product_id = $data->id;
                        $data2->save();
                        // print_r($imageName); exit();
                    }
                    
                }else{
                    $imageName = '';
                }

            if($saveData) {
                $returnData = ["status" => 1, "msg" => "Product Update successful."];
            }else {
                $returnData = ["status" => 0, "msg" => "Product Update failed! Something is wrong."];
            }
        }else{
            $data = new Products;
            $data->product_name = $request->product_name;
            $data->price = $request->price;
            $data->description = $request->description;
            $data->status = "1";
            $saveData= $data->save();

            $images = $request->file('image');
                if($request->hasFile('image')){
                    foreach ($images as $item){
                        $var = date_create();
                        $time = date_format($var, 'YmdHis');
                        $imageName = $time . '-' . $item->getClientOriginalName();
                        $item->move(public_path() . '/assets/backend/images/productImages/', $imageName);
                        $arr[] = $imageName;

                        $data2 = new ProductImages;
                        $data2->product_image = $imageName;
                        $data2->fk_product_id = $data->id;
                        $data2->save();
                        // print_r($imageName); exit();
                    }
                    
                }else{
                    $imageName = '';
                }

            if($saveData) {
                $returnData = ["status" => 1, "msg" => "Product Save successful."];
            }else {
                $returnData = ["status" => 0, "msg" => "Product Save failed! Something is wrong."];
            }
        }
        return response()->json($returnData);
    }

    // Edit Product
    public function edit_product(Request $request){
        if($request->ajax()){
            $productData = Products::where('id',$request->id)->with(['productImages'])->get()->toArray();
            // print_r($productData); exit();
            $html = view('backend.product.product_management_from')->with([
                'product_data' => $productData,
            ])->render();
            return response()->json(["status" => 1, "message" => $html]);
        }
    }

    // Delete Product
    public function delete_product(Request $request){
        if($request->ajax()){
            $saveData = Products::where('id', $request->id)->update(['status' => "0",]);
            if($saveData) {
                $returnData = ["status" => 1, "msg" => "Delete successful."];
            }else {
                $returnData = ["status" => 0, "msg" => "Delete failed! Something is wrong."];
            }
        }
        return response()->json($returnData);
    }
    
    // Delete Product Image
    public function product_image_delete(Request $request){
        if($request->ajax()){
            $image_path = public_path('/assets/backend/images/productImages/'.$request->image);
            if(File::exists($image_path)) {
                File::delete($image_path);
            }
            $data2 = ProductImages::where('id',$request->id)->delete();
            if($data2) {
                $returnData = ["status" => 1, "msg" => "Product Image Deleted Successfully"];
            }else {
                $returnData = ["status" => 0, "msg" => "Something Is Wrong"];
            }
        }
        return response()->json($returnData);
    }

}
