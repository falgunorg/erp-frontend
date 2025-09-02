import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";

export default function ReturnRequest(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModal(true);
  };
  const closeImageModal = () => {
    setImageUrl(null);
    setImageModal(false);
  };

  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
    });
  };
  // get all returns
  const [returns, setReturns] = useState([]);
  const getReturns = async () => {
    setSpinner(true);
    var response = await api.post("/store/stores/return-request", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
    });

    if (response.status === 200 && response.data) {
      setReturns(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const receiveItem = async (item_id) => {
    const result = await swal({
      title: "Are you want to Received ?",
      icon: "success",
      buttons: ["No", "Yes"],
      dangerMode: false,
    });
    if (result) {
      setSpinner(true);
      try {
        var response = await api.post("/store/stores/receive-return-request", {
          id: item_id,
        });
        if (response.status === 200 && response.data) {
          swal({
            icon: "success",
            title: "Returned Success!",
          });
          getReturns();
        } else {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getReturns();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("stores");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Store") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Return Request To Store </div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={(event) =>
                    filterChange("from_date", event.target.value)
                  }
                  name="from_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>To Date</label>
                <input
                  onChange={(event) =>
                    filterChange("to_date", event.target.value)
                  }
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <div className="d-flex gap_10">
                  <select
                    onChange={(event) =>
                      filterChange("num_of_row", event.target.value)
                    }
                    value={filterData.num_of_row}
                    name="num_of_row"
                    className="form-select"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>DCN No.</th>
                <th>Date</th>
                <th>Photo</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Issued Qty</th>
                <th>Return Qty</th>
                <th>Return From</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {returns
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.techpack
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.status.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.delivery_challan}</td>
                        <td>{moment(item.created_at).format("ll")}</td>
                        <td>
                          <img
                            onClick={() => openImageModal(item.image_source)}
                            style={{
                              height: "50px",
                              width: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.image_source}
                          />
                        </td>
                        <td>{item.buyer}</td>
                        <td>{item.techpack}</td>
                        <td>
                          {item.issued_qty} {item.unit}
                        </td>
                        <td>
                          {item.qty} {item.unit}
                        </td>
                        <td>{item.return_by_user}</td>
                        <td>{item.remarks}</td>
                        <td>
                          <div className="">
                            {item.status === "Pending" ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => receiveItem(item.id)}
                              >
                                Receive
                              </button>
                            ) : (
                              "Received"
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {returns.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.delivery_challan}</td>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>
                        <img
                          onClick={() => openImageModal(item.image_source)}
                          style={{
                            height: "50px",
                            width: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.image_source}
                        />
                      </td>
                      <td>{item.buyer}</td>
                      <td>{item.techpack}</td>
                      <td>
                        {item.issued_qty} {item.unit}
                      </td>
                      <td>
                        {item.qty} {item.unit}
                      </td>
                      <td>{item.return_by_user}</td>
                      <td>{item.remarks}</td>

                      <td>
                        <div className="">
                          {item.status === "Pending" ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => receiveItem(item.id)}
                            >
                              Receive
                            </button>
                          ) : (
                            "Received"
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={imageURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br />
      <br />
    </div>
  );
}
