import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function LeftOvers(props) {
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
    status: "",
    buyer_id: "",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };

  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
      status: "",
      buyer_id: "",
    });
  };

  // get all bookings

  const [overs, setOvers] = useState([]);

  const getOvers = async () => {
    setSpinner(true);
    var response = await api.post("/left-overs", {
      status: filterData.status,
      buyer_id: filterData.buyer_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      with_user: true,
    });
    if (response.status === 200 && response.data) {
      setOvers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBuyers();
  }, []);

  useEffect(async () => {
    getOvers();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("finishing");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Finishing") {
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
        <div className="page_name">Left Overs</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="/finishing/left-overs-create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
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
                  onChange={filterChange}
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
                  onChange={filterChange}
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <select
                  onChange={filterChange}
                  value={filterData.buyer_id}
                  name="buyer_id"
                  className="form-select"
                >
                  <option value="">Select Buyer</option>
                  {buyers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  name="status"
                  value={filterData.status}
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Checked">Checked</option>
                  <option value="Received">Received</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <div className="d-flex gap_10">
                  <select
                    onChange={filterChange}
                    value={filterData.num_of_row}
                    name="num_of_row"
                    className="form-select margin_bottom_0"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                  <Link className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Date</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Season</th>
                <th>Type</th>
                <th>Item</th>
                <th>Carton Qty</th>
                <th>QTY</th>
                <th>Reference</th>
                <th>Remarks</th>
                <th>Added By</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overs.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      onClick={() => openImageModal(item.image_source)}
                      style={{
                        width: "50px",
                        height: "50px",
                        border: "1px solid gray",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      src={item.image_source}
                    />
                  </td>
                  <td>{moment(item.created_at).format("ll")}</td>
                  <td>{item.buyer}</td>
                  <td>{item.techpack}</td>
                  <td>{item.season}</td>
                  <td>{item.item_type}</td>
                  <td>{item.title}</td>
                  <td>{item.carton}</td>
                  <td>{item.qty}</td>
                  <td>{item.reference}</td>
                  <td>{item.remarks}</td>
                  <td>{item.user}</td>
                  <td>{item.received_by_user}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="text-center">
                      {props.userData?.userId === item.user_id &&
                        item.status === "Pending" && (
                          <Link to={"/finishing/left-overs-edit/" + item.id}>
                            <i className="fa fa-pen text-danger"></i>
                          </Link>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
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
