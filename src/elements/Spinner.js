import React from "react";
import Spinner from "react-bootstrap/Spinner";

class SpinnerComponent extends React.Component {
  state = {
    loading: true,
  };
  render() {
    return (
      <div className="spinner_overlay">
        <div className="spinner_body">
          <Spinner className="spin" animation="grow" />
        </div>
      </div>
    );
  }
}

export default SpinnerComponent;
