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
		<div class="form-error alert alert-danger">
			<strong>Password Change Error:</strong><br><br>
			<p>The information you provided did not match what we have on file.</p>
		</div>
		<button type="button" class="btn btn-primary" id="home">GRCC Home</button>
		<button type="button" class="btn btn-secondary" id="retry">Restart</button>
      </div>
    </div>
  </div>
  </div>
</body>
<script>
$('#home').click(function(){$(location).attr('href', 'https://grcc.edu');});
$('#retry').click(function(){$(location).attr('href', 'index.html');});
</script>
</html>
