{{ Form::open(array('id'=>'productForm')) }}
    <div class="form-row">
        <div class="col-md-12">
            @php
                $product_name = "";
                if(!empty($product_data[0]['product_name']))  {
                    $product_name = $product_data[0]['product_name'];
                }
                $price = "";
                if(!empty($product_data[0]['price']))  {
                    $price = $product_data[0]['price'];
                }
                $description = "";
                if(!empty($product_data[0]['description']))  {
                    $description = $product_data[0]['description'];
                }

                
                $hidden_id = "";
                if(!empty($product_data[0]['id']))  {
                    $hidden_id = $product_data[0]['id'];
                }
            @endphp
            <div class="position-relative form-group">
                <label>Product Name *</label>
                <input name="product_name" id="product_name" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="30" placeholder="" type="text" class="form-control" value="{{$product_name}}">
                <input name="hidden_id" type="hidden" value="{{$hidden_id}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Price *</label>
                <input name="price" id="price" placeholder="" type="number" class="form-control" value="{{$price}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Description *</label>
                <textarea class="form-control" id="description" name="description" rows="3">{{$description}}</textarea>
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Image *</label>
                <input name="image[]" id="image" placeholder="" type="file" class="form-control" value="" multiple>

            </div>
        </div>
        <div class="form-group">
            @php
            if(!empty($product_data)){
            if(sizeof($product_data[0]['product_images']) > 0){
            foreach($product_data[0]['product_images'] as $value){

            @endphp
            <div id="img-{{$value['id']}}" style="position:relative;display:inline-block;width:100px;margin-right:15px">
                <span style="color: red; position: absolute;right:-15px" class="delete-product-images" data-image="{{$value['product_image']}}" data-id="{{$value['id']}}">X</span>
                <img  src="{{ url('public/assets/backend/images/productImages').'/'.$value['product_image']}}" class="card-img-absolute" style="width: 100%; height: 120px; border-radius: 0px;">
            </div>

            @php
                    } }
                }
            @endphp
        </div>
    </div>
    <p class="text-right">
        <button type="submit" name="submit" class="btn-shadow btn btn-info" value="Submit">Save </button> <button type="button" class="btn-shadow btn btn-cancel" data-dismiss="modal"> Close </button>
    </p>
{{ Form::close() }}
