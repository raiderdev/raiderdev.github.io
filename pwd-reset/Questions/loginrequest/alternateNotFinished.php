<html>
<head>
<meta charset="utf-8">
<title>Online Center Login Request</title>
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="../assets/css/grcc_theme.css">
<script type='text/javascript' src='https://code.jquery.com/jquery-1.11.0.js'></script>
<script type='text/javascript' src="https://code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
<script type='text/javascript' src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
<script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/jquery-form-validator/2.3.23/jquery.form-validator.min.js"></script>
<script src='https://www.google.com/recaptcha/api.js'></script>

<script type='text/javascript'>
//<![CDATA[ 
$(window).load(function(){

	var config = {
		validate :{
			'password_confirmation' : {
				'validation' : 'length differentInput required custom',
				'length' : 'min10',
				'regexp' : '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
				'error-msg-custom' : 'Your password must include at least one uppercase letter, lowercase letter and number', 
				'error-msg-length' : 'Your password must be a minmum of 10 characters',
				'help' : 'Your pasword must be a minimum of 10 characters and include at least one uppercase letter, lowercase letter and number'
			}
		}
	};

	$.validate({
		
		
		modules: 'jsconf, date, security, sanitize',
		validateOnBlur : false, // disable validation when input loses focus
		errorMessagePosition : 'top', // Instead of 'inline' which is default
		scrollToTopOnError : false, // Set this property to true on longer forms
		
		onModulesLoaded : function () {
			$.setupValidation(config);
		}

	});
	$("#birthdate").datepicker({
		dateFormat: "mm/dd/yy",
		yearRange: "-100:+0",
		changeMonth: true,
		changeYear: true
	});
	
	
});


//]]>
</script>
</head>

<body id="grcc">
<header>
  <div class="container-fluid">
      <h1><a href="http://www.grcc.edu">Grand Rapids Community College</a></h1>
  </div>
</header><div class="container">
    <div class="row">
    <div class="col-xs-9 col-xs-offset-2 col-md-7 col-md-offset-3 col-lg-6 col-lg-offset-3">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Password Reset System</h3>
        </div>
		
        <div class="panel-body">
		<div id="email-error-dialog"></div>
          <form method="post" action="success.php" class="form-horizontal" id="my-form">
            <fieldset>
              <div class="form-group">
                <label for="emplid" class="col-sm-4 control-label">ID</label>
                <div class="col-sm-8">
                  <input name="emplid" id="emplid" class="form-control" maxlength="7" aria-describedby="emplidHelp" data-validation="number length" data-validation-length="min7" data-validation-help="7 digit Student or Staff ID Number" data-validation-error-msg="ID number must contain 7 digits" type="text">
                </div>
              </div>
              <div class="form-group hidden">
                <label for="firstname" class="col-sm-4 control-label">First Name</label>
                <div class="col-sm-8">
                  <input name="firstname" id="firstname" class="form-control" data-validation="" type="text">
                </div>
              </div>
              <div class="form-group hidden">
                <label for="lastname" class="col-sm-4 control-label">Last Name</label>
                <div class="col-sm-8">
                  <input name="lastname" id="lastname" class="form-control" data-validation="" type="text">
                </div>
              </div>
              <div class="form-group has-feedback hidden">
                <label for="birthdate" class="col-sm-4 control-label">Birth Date</label>
                <div class="col-sm-8">
                  <input name="birthdate" id="birthdate" class="form-control" type="text" data-validation="" data-validation-format="mm/dd/yyyy" value="MM/DD/YYYY">
                  <i class="glyphicon glyphicon-calendar form-control-feedback"></i> 
				</div>
              </div>
              <div class="form-group hidden">
                <label for="ssn" class="col-sm-4 control-label">Last 4 of SSN</label>
                <div class="col-sm-8">
                  <input name="ssn" id="ssn" class="form-control" maxlength="4" aria-describedby="ssnHelp" data-validation=""  data-validation-regexp="^([0-9]+)|([xX]+)$"  data-validation-length="min4" data-validation-help="Last Four Digits of Social Security Number" data-validation-error-msg="Invalid Last Four of SSN">
                </div>
              </div>
			  <div class="form-group" id="current">
                <label for="current_password" class="col-sm-4 control-label">Current Password</label>
                <div class="col-sm-8">
                  <input name="current_password" id="current_password" class="form-control" type="password"  data-validation="required length custom" data-validation-length="min10" data-validation-regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$" data-validation-help="Your current pasword has a minimum of 10 characters and includes at least one uppercase letter, lowercase letter and number" data-validation-error-msg-custom="Your current password includes at least one uppercase letter, lowercase letter and number" data-validation-error-msg-required="Please enter your current password" data-validation-error-msg-length="Your current password is at least 10 character long">
				  <div id="forgot">Forgot Password</div>
                </div>
              </div>
			  
              <div class="form-group">
                <label for="password_confirmation" class="col-sm-4 control-label">New Password</label>
                <div class="col-sm-8">
                  <input name="password_confirmation" id="password_confirmation" class="form-control" type="password" data-validation-help="Your pasword must be a minimum of 10 characters and include at least one uppercase letter, lowercase letter and number">
                </div>
              </div>
              <div class="form-group">
                <label for="password" class="col-sm-4 control-label">Confirm Password</label>
                <div class="col-sm-8">
                  <input name="password" id="password" class="form-control" data-validation="confirmation required" data-validation-error-msg="Password confirmation doesn't match the new password" data-validation-help="Confirm your password" type="password">
                </div>
              </div>
			  <div class="form-group">
				<label for="password" class="col-sm-4 control-label"></label>
				<div class="col-sm-8"> 
				  <div class="g-recaptcha" data-sitekey="6LcsMSMTAAAAALXHC7LWQWHcrlGvQZmx-1qLO9Ea" ><!-- Enter Correct Data Site Key -->
				  </div>
				</div>
              </div>
            </fieldset>
            <div class="form-group">
              <div class="col-sm-offset-4 col-sm-6">
                <label>
                  <input type="submit" id="submit" class="btn btn-default" value="Submit" />
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</body>
<script type='text/javascript' src="../assets/js/scripts.js"></script>
</html>
