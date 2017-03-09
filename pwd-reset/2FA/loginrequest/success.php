<!doctype html>
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


<script type='text/javascript'>
//<![CDATA[ 



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
    <div class="col-xs-9 col-xs-offset-2 col-md-6 col-md-offset-3">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Password Reset System</h3>
        </div>
		
        <div class="panel-body">
		<div class="form-error alert alert-success">
			<strong>Password Change Success!</strong><br><br>
			<strong>Username: </strong>brianmoore<br>
			<strong>Email: </strong>brianmoore@email.grcc.edu<br><br>
			<p><strong>Your password has been changed for the following logins:</strong></p>
			<ul>
				<li>Campus Computers</li>
				<li>Student Email</li>
				<li>Blackboard</li>
				<li>Online Center</li>
				<li>GRCC Wireless</li>
				<li>GroupWise Email</li>
				<li>CSProd</li>
			</ul>
			<br>

		</div>
        <div class="alert alert-info">
				<strong>Note:</strong> This did not change the password for FSProd
		</div>	
		<button type="button" class="btn btn-secondary" id="home">GRCC Home</button>
      </div>
    </div>
  </div>
  </div>
</body>
<script type='text/javascript' src="../assets/js/scripts.js"></script>
<script>
$('#home').click(function(){$(location).attr('href', 'https://grcc.edu');});
</script>
</html>
