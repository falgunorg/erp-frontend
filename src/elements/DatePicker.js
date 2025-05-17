import React from "react";
import DatePicker from "react-datepicker";

const DatePickerNew = (props) => {
  var newProps = {
    ...props,
    selected: props.value ? new Date(props.value) : null,
    placeholderText: props.placeholder ? props.placeholder : "",
  };

  return <DatePicker {...newProps} />;
};

export default DatePickerNew;
