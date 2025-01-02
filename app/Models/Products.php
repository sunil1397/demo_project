<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImages;

class Products extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
	protected $table = 'products';
	protected $dateFormat = 'Y-m-d h:i:s';
	const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    protected $fillable = [
       'product_name', 'price', 'description','status','created_at','updated_at'
    ];

    public function productImages(){
        return $this->hasMany(productImages::class,'fk_product_id','id');
    }
    
}
