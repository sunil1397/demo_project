<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\ProductImages;

class ProductController extends Controller
{
    // Product 

    public function product(){

        $getProduct = Products::with(['productImages'])->get()->toArray();
        return view('frontend.product')->with(['get_product'=>$getProduct]);
    }
}
