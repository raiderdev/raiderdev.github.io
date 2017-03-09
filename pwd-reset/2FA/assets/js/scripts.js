// Add custom validation rule
$.formUtils.addValidator({
  name : 'differentInput',
  validatorFunction : function(value, $el, config, language, $form) {
    return value != $("#current_password").val();
  },
  errorMessage : 'Your new password must be different from your current password.',
  errorMessageKey: 'badEvenNumber',
  errorMessagePosition : 'top'
});

$.validate({
  inlineErrorMessageCallback:  function($input, errorMessage, config) {
     if (errorMessage) {
      customDisplayInlineErrorMessage($input, errorMessage);
     } else {
      customRemoveInlineError($input);
     }
     return false; // prevent default behaviour
  },
  submitErrorMessageCallback: function($form, errorMessages, config) {
     if (errorMessages) {
      customDisplayErrorMessagesInTopOfForm($form, errorMessages);
     } else {
      customRemoveErrorMessagesInTopOfForm($form);
     }
     return false; // prevent default behaviour
  }
});
 
// Setup form validation
$.validate();

// Click for Forgot Password
$('#forgot').click(function(){
	$('#firstname').attr("data-validation","required");
	$('#lastname').attr("data-validation","required");
	$('#birthdate').attr("data-validation","required date");
	$('#ssn').attr("data-validation","required alphanumeric custom length");
	$('.hidden').removeClass('hidden');
	$('#current').addClass('hidden');
	$('#current_password').removeAttr("data-validation");
});

