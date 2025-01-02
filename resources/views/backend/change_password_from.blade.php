{{ Form::open(array('id'=>'ChangePasswordForm')) }}
    <div class="form-row">
        
        <div class="col-md-12" style="">
            <div class="position-relative form-group">
                <label>Password *</label>
                <input name="password" id="password" placeholder="" type="password" class="form-control" value="">
            </div>
        </div>
        <div class="col-md-12" style="">
            <div class="position-relative form-group">
                <label>Confirm Password *</label>
                <input name="confirm_password" id="confirm_password" placeholder="" type="password" class="form-control" value="">
            </div>
        </div>
    </div>
    <p class="text-right">
        <button type="submit" name="submit" class="btn-shadow btn btn-info" value="Submit">Save </button> <button type="button" class="btn-shadow btn btn-cancel" data-dismiss="modal"> Close </button>
    </p>
{{ Form::close() }}
