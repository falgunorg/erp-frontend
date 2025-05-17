export default function passwordValidate(password) {
  // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return re.test(String(email).toLowerCase());

  var strength = 0;
  var that = $("." + className);
  var password = that.val();
  that.closest(".single_input").addClass("check_strength");
  var errorMsg = "";
  //If password contains both lower and uppercase characters, increase strength value.
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
    strength += 1;
  } else {
    strength -= 1;
    errorMsg =
      "{{__('Password must contain at least 1 lowercase & 1 uppercase')}}";
  }

  //If it has numbers and characters, increase strength value.
  if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
    strength += 1;
  } else {
    strength -= 1;
    errorMsg = "{{__('Password must contain at least 1 number (0-9)')}}";
  }

  //If it has one special character, increase strength value.
  if (password.match(/([!,%,&,@,#,$,^,*,?,_,~,+,\-])/)) {
    strength += 1;
  } else {
    strength -= 1;
    errorMsg =
      "{{__('Password must contain at least 1 special character. eg. !#$%&*+-=?@^_')}}";
  }

  if (password.length > 7) {
    strength += 1;
  } else {
    strength -= 1;
    errorMsg =
      "{{__('Please use a minimum password length of 8 characters or more.')}}";
  }

  if (errorMsg != "") {
    that
      .closest(".single_input")
      .removeClass("accept_input")
      .addClass("error_input");
    that.closest(".single_input").find(".error_text").html(errorMsg);
    showNextStep = false;
  } else {
    that
      .closest(".single_input")
      .removeClass("error_input")
      .addClass("accept_input");
    showNextStep = true;
  }

  // If value is less than 2

  if (strength < 2) {
    that.closest(".single_input").removeClass("medium strong").addClass("weak");
    that
      .closest(".single_input")
      .find(".strength_result")
      .html("{{__('Weak')}}");
  } else if (strength == 2) {
    that.closest(".single_input").removeClass("weak strong").addClass("medium");
    that
      .closest(".single_input")
      .find(".strength_result")
      .html("{{__('Medium')}}");
  } else if (strength == 4) {
    that.closest(".single_input").removeClass("weak medium").addClass("strong");
    that
      .closest(".single_input")
      .find(".strength_result")
      .html("{{__('Strong')}}");
  }
}
