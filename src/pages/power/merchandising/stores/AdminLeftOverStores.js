import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";

export default function AdminLeftOverStores(props) {
  const [spinner, setSpinner] = useState(false);

  const history = useHistory();

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
    buyer_id: "",
    company_id: "",
    techpack_id: "",
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };

  // get all bookings
  const [overs, setOvers] = useState([]);
  const getOvers = async () => {
    setSpinner(true);
    var response = await api.post("/store/admin/left-overs-balance", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      buyer_id: filterData.buyer_id,
      company_id: filterData.company_id,
      techpack_id: filterData.techpack_id,
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
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // techpacks
  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  //   Companies

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies");
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBuyers();
    getCompanies();
    getTechpacks();
  }, []);

  useEffect(async () => {
    getOvers();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("stores");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.role !== "Admin") {
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
        <div className="page_name">Left Overs (Ready Made)</div>
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
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("buyer_id", selectedOption.value)
                  }
                  value={
                    buyers.find((item) => item.id === filterData.buyer_id)
                      ? {
                          value: filterData.buyer_id,
                          label:
                            buyers.find(
                              (item) => item.id === filterData.buyer_id
                            ).name || "",
                        }
                      : null
                  }
                  name="buyer_id"
                  options={buyers.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Style</label>
                <Select
                  placeholder="Select"
                  value={
                    techpacks.find((item) => item.id === filterData.techpack_id)
                      ? {
                          value: filterData.techpack_id,
                          label:
                            techpacks.find(
                              (item) => item.id === filterData.techpack_id
                            ).title || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    filterChange("techpack_id", selectedOption.value)
                  }
                  name="techpack_id"
                  options={techpacks.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Company</label>
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("company_id", selectedOption.value)
                  }
                  value={
                    companies.find((item) => item.id === filterData.company_id)
                      ? {
                          value: filterData.company_id,
                          label:
                            companies.find(
                              (item) => item.id === filterData.company_id
                            ).title || "",
                        }
                      : null
                  }
                  name="company_id"
                  options={companies.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
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
                <th>LO</th>
                <th>Last Update</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Season</th>
                <th>Type</th>
                <th>Item</th>
                <th>Company</th>
                <th>Carton Qty</th>
                <th>Balance</th>
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
                  <td>{item.lo_number}</td>
                  <td>{moment(item.updated_at).format("ll")}</td>
                  <td>{item.buyer}</td>
                  <td>{item.techpack}</td>
                  <td>{item.season}</td>
                  <td>{item.item_type}</td>
                  <td>{item.title}</td>
                  <td>{item.company_name}</td>
                  <td>{item.carton}</td>
                  <td>{item.qty}</td>
                  <td>
                    <div className="text-center">
                      <Link
                        className="btn btn-primary mr-10"
                        to={"/admin/store/left-overs-details/" + item.id}
                      >
                        Details
                      </Link>
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
