{{ Form::open(array('id'=>'employeeForm')) }}
    <div class="form-row">
        <div class="col-md-12">
            @php
                $firstName = "";
                if(!empty($employee_data[0]['first_name']))  {
                    $firstName = $employee_data[0]['first_name'];
                }
                $lastName = "";
                if(!empty($employee_data[0]['last_name']))  {
                    $lastName = $employee_data[0]['last_name'];
                }
                $email = "";
                if(!empty($employee_data[0]['email']))  {
                    $email = $employee_data[0]['email'];
                }

                $department = "";
                if(!empty($employee_data[0]['department']))  {
                    $department = $employee_data[0]['department'];
                }

                $phone_number = "";
                if(!empty($employee_data[0]['phone_no']))  {
                    $phone_number = $employee_data[0]['phone_no'];
                }
                $address = "";
                if(!empty($employee_data[0]['address']))  {
                    $address = $employee_data[0]['address'];
                }
                $images = "";
                if(!empty($employee_data[0]['images']))  {
                    $images = $employee_data[0]['images'];
                }
                $hidden_id = "";
                if(!empty($employee_data[0]['id']))  {
                    $hidden_id = $employee_data[0]['id'];
                }
            @endphp
            <div class="position-relative form-group">
                <label>First Name *</label>
                <input name="first_name" id="first_name"  placeholder="" type="text" class="form-control" value="{{$firstName}}">
                <input name="hidden_id" type="hidden" value="{{$hidden_id}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Last Name *</label>
                <input name="last_name" id="last_name" placeholder="" type="text" class="form-control" value="{{$lastName}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Department Name *</label>
                <input name="department" id="department" placeholder="" type="text" class="form-control" value="{{$department}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Email *</label>
                <input name="email" id="emal" placeholder="" type="text" class="form-control" value="{{$email}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Phone number *</label>
                <input name="phone_number" id="phone_number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="10" placeholder="" type="text" class="form-control" value="{{$phone_number}}">
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Address *</label>
                <textarea class="form-control" id="address" name="address" rows="3">{{$address}}</textarea>
            </div>
        </div>
        <div class="col-md-12">
            <div class="position-relative form-group">
                <label>Image *</label>
                <input name="image" id="image" placeholder="" type="file" class="form-control" value="">
                @php
                    if(!empty($images)){
                @endphp
                <img  src="{{ url('public/assets/backend/images/userImages').'/'.$images}}" class="card-img-absolute" style="width: 100px; height: 50px; border-radius: 0px;">
                @php
                    }
                @endphp
                <input name="hidden_image" type="hidden" value="{{$images}}">

            </div>
        </div>
    </div>
    <p class="text-right">
        <button type="submit" name="submit" class="btn-shadow btn btn-info" value="Submit">Save </button> <button type="button" class="btn-shadow btn btn-cancel" data-dismiss="modal"> Close </button>
    </p>
{{ Form::close() }}
