import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CameraFileInput from "../../../elements/CameraFileInput";

export default function Techpacks(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      num_of_row: 20,
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };
  //Camera input

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const handleCapturePhoto = (file) => {
    setCapturedPhoto(file);
  };

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("consumption.pdf");
    });
  };
  // get all techpacks
  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/techpacks", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      view: filterData.view,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // IMAGE MODAL SHOW
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

  // GET ALL BUYERS

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

  // CREATE TECHPACK ON MODAL
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelection = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleFileDelete = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  
  const [techForm, setTechForm] = useState({
    title: "",
    buyer_id: "",
    description: "",
    season: "",
    item_type: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (ev) => {
    setTechForm({
      ...techForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!techForm.title) {
      formErrors.title = "Techpack/Style is required";
    }

    if (!techForm.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!techForm.season) {
      formErrors.season = "Season is required";
    }

    if (!techForm.item_type) {
      formErrors.item_type = "Item Type is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [techModal, setTechModal] = useState(false);
  const openTechModal = () => {
    setTechModal(true);
    setTechForm({
      title: "",
      buyer_id: "",
      description: "",
      season: "",
      item_type: "",
    });
    setErrors({});
    setSelectedFiles([]);
  };

  const closeTechModal = () => {
    setTechModal(false);
    setTechForm({
      title: "",
      buyer_id: "",
      description: "",
      season: "",
      item_type: "",
    });
    setErrors({});
    setSelectedFiles([]);
  };

  const submitTechpack = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      swal({
        title:
          "No attachments found in your Techpack. Please attach PDF or Excel files here to proceed.",
        icon: "error",
      });
      return; // Abort form submission
    }

    if (validateForm()) {
      var data = new FormData();
      data.append("title", techForm.title);
      data.append("buyer_id", techForm.buyer_id);
      data.append("season", techForm.season);
      data.append("item_type", techForm.item_type);
      data.append("description", techForm.description);
      data.append("photo", imageFile ? imageFile : capturedPhoto);
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/techpacks-create", data);
      if (response.status === 200 && response.data) {
        setTechModal(false);
        setTechForm({
          title: "",
          buyer_id: "",
          description: "",
          season: "",
          item_type: "",
        });
        setErrors({});
        setSelectedFiles([]);
        getTechpacks();
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  // DETAILS AND UPDATE

  const [consumptionItems, setConsumptionItems] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const showDetails = async (id) => {
    setSpinner(true);
    var response = await api.post("/techpacks-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditForm(response.data.data);

      setConsumptionItems(response.data.consumption_items);
      setEditModal(true);
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };

  const toggleStatus = async (id) => {
    setSpinner(true);
    var response = await api.post("/techpacks-toggle-status", {
      id: id,
      status: "Placed",
    });

    if (response.status === 200 && response.data) {
      swal({
        title: "Placed Success!",
        icon: "success",
      });
      setEditModal(false);
      getTechpacks();
    }
    setSpinner(false);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  useEffect(async () => {
    getTechpacks();
    getBuyers();
  }, []);

  useEffect(async () => {
    getTechpacks();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
      ];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Techpacks </div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title !== "Deputy General Manager" ? (
            <Link
              to="#"
              onClick={openTechModal}
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
            <div className="col-lg-2">
              <div className="form-group">
                <label>View Mode</label>
                <select
                  onChange={filterChange}
                  value={filterData.view}
                  name="view"
                  className="form-select"
                >
                  <option value="self">Self</option>
                  <option value="team">Team</option>
                </select>
              </div>
            </div>
            <div className="col-lg-2">
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
            <div className="col-lg-2">
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
            <div className="col-lg-2">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  value={filterData.status}
                  name="status"
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Placed">Placed</option>
                  <option value="Consumption Done">Consumption Done</option>
                  <option value="Sample Done">Sample Done</option>
                  <option value="Costing Done">Costing Done</option>
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <select
                  onChange={filterChange}
                  value={filterData.num_of_row}
                  name="num_of_row"
                  className="form-select"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Refresh</label>
                <div>
                  <Link
                    to="#"
                    className="btn btn-warning"
                    onClick={clearFields}
                  >
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
                <th>Photo</th>
                <th>SL</th>
                <th>Title/Style</th>
                <th>Buyer</th>
                <th>Season</th>
                <th>Type</th>
                <th>Status</th>
                <th>Issue By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {techpacks
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.title.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            onClick={() => openImageModal(item.file_source)}
                            style={{
                              width: "50px",
                              height: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.file_source}
                          />
                        </td>
                        <td>{item.techpack_number}</td>
                        <td>{item.title}</td>
                        <td>{item.buyer}</td>
                        <td>{item.season}</td>
                        <td>{item.item_type}</td>
                        <td>{item.status}</td>
                        <td>{item.user}</td>
                        <td>
                          <Link to="#" onClick={() => showDetails(item.id)}>
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {techpacks.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          onClick={() => openImageModal(item.file_source)}
                          style={{
                            width: "50px",
                            height: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.file_source}
                        />
                      </td>
                      <td>{item.techpack_number}</td>
                      <td>{item.title}</td>
                      <td>{item.buyer}</td>
                      <td>{item.season}</td>
                      <td>{item.item_type}</td>
                      <td>{item.status}</td>
                      <td>{item.user}</td>
                      <td>
                        <Link to="#" onClick={() => showDetails(item.id)}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <Modal size="lg" show={techModal} onHide={closeTechModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Techpack</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Title/Style Name(with code)<sup>*</sup>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="title"
                  onChange={handleChange}
                  value={techForm.title}
                />

                {errors.title && <div className="errorMsg">{errors.title}</div>}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Buyer <sup>*</sup>
                </label>
                <select
                  name="buyer_id"
                  value={techForm.buyer_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Buyer</option>
                  {buyers.length > 0 ? (
                    buyers.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option value="0">No Buyeers found</option>
                  )}
                </select>
                {errors.buyer_id && (
                  <div className="errorMsg">{errors.buyer_id}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Season <sup>*</sup>
                </label>
                <select
                  name="season"
                  value={techForm.season}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Season</option>
                  <option value="FALL">FALL</option>
                  <option value="SUMMER">SUMMER</option>
                  <option value="SPRING">SPRING</option>
                  <option value="WINTER">WINTER</option>
                  <option value="HOLIDAY">HOLIDAY</option>
                </select>
                {errors.season && (
                  <div className="errorMsg">{errors.season}</div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Item Type <sup>*</sup>
                </label>
                <select
                  name="item_type"
                  value={techForm.item_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Top">Top</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Outwear">Outwear</option>
                  <option value="Kids">Kids</option>
                </select>
                {errors.item_type && (
                  <div className="errorMsg">{errors.item_type}</div>
                )}
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <label htmlFor="attachments">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="form-group">
                <label htmlFor="attachments">Attachments:</label>
                <small className="text-muted">
                  {" "}
                  (PDF,Word,Excel,JPEG,PNG file.)
                </small>
                <div className="d-flex mb-10">
                  <input
                    type="file"
                    className="form-control margin_bottom_0"
                    multiple
                    accept=".pdf, .xlsx, .xls, .csv"
                    onChange={handleFileSelection}
                    id="input_files"
                  />
                  <div className="d-flex margin_left_30">
                    <label
                      for="input_files"
                      className="btn btn-warning bg-falgun rounded-circle btn-xs"
                    >
                      <i className="fal fa-plus"></i>
                    </label>
                  </div>
                </div>

                {selectedFiles.map((file, index) => (
                  <div key={file.name} className="d-flex mb-10">
                    <input
                      className="form-control margin_bottom_0"
                      disabled
                      value={file.name}
                    />
                    <div className="d-flex">
                      <Link
                        to="#"
                        onClick={() => handleFileDelete(index)}
                        className="btn btn-danger rounded-circle margin_left_15 btn-xs"
                      >
                        <i className="fal fa-times"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <br />
          <div className="row align-items-center">
            <div className="col-lg-5">
              <br />
              <div className="form-group text-center">
                <label className="btn btn-success" for="fileInput">
                  Upload From Computer
                </label>
                <br />
                <input
                  id="fileInput"
                  onChange={handleImageChange}
                  hidden
                  type="file"
                  accept="image/*"
                />
                <div
                  className="file_preview"
                  style={{
                    margin: "10px auto 0",
                    border: "2px solid #3498db",
                    borderRadius: " 8px",
                    width: "320px",
                    height: "240px",
                    backgroundColor: "#f0f0f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", marginTop: "10px" }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <hr />
              <h1 className="text-center">OR</h1>
              {errors.photo && (
                <>
                  <div className="errorMsg">{errors.photo}</div>
                </>
              )}
              <hr />
            </div>
            <div className="col-lg-5">
              <br />
              <CameraFileInput onFileChange={handleCapturePhoto} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTechModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitTechpack}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
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

      <Modal size="lg" show={editModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Techpack Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="create_edit_page">
            {spinner && <Spinner />}

            <Link
              to="#"
              onClick={generatePdf}
              className="btn btn-warning btn-sm bg-falgun "
            >
              <i className="fas fa-download"></i>
            </Link>

            {editForm.status === "Pending" &&
            userInfo.userId === editForm.user_id ? (
              <Button
                onClick={() => toggleStatus(editForm.id)}
                style={{ marginLeft: "15px" }}
              >
                Place to Sample Dept for Consumption
              </Button>
            ) : null}

            <div className="preview_print page" id="pdf_container">
              <h6 className="text-center text-underline">
                <u>TECHPACK DETAILS</u>
              </h6>
              <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                <tbody>
                  <tr>
                    <td>
                      <strong>SL</strong>
                    </td>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>TECHPACK/STYLE</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{editForm.techpack_number}</td>
                    <td>{editForm.buyer}</td>
                    <td>{editForm.title}</td>
                    <td>{editForm.season}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>TECHPACK BY</strong>
                    </td>
                    <td>
                      <strong>TYPE</strong>
                    </td>
                    <td>
                      <strong>DATE</strong>
                    </td>
                    <td>STATUS</td>
                  </tr>
                  <tr>
                    <td>{editForm.techpack_by}</td>
                    <td>{editForm.item_type}</td>
                    <td> {moment(editForm.created_at).format("lll")} </td>
                    <td>{editForm.status}</td>
                  </tr>
                </tbody>
              </table>

              <div className="container border ">
                <br />
                <h6 className="text-center text-underline">
                  <u>CONSUMPTION FILE</u>
                </h6>

                <br />
                <div className="row">
                  <div className="col-lg-8">
                    <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                      <tbody>
                        <tr>
                          <td>
                            <strong>SL</strong>
                          </td>
                          <td>
                            <strong>CONSUMPTION BY</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>{editForm.consumption_number}</td>
                          <td>{editForm.consumption_by}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-lg-4">
                    <img
                      style={{
                        width: "100%",
                        border: "1px solid gray",
                        borderRadius: "3px",
                      }}
                      src={editForm.file_source}
                    />
                  </div>
                </div>
                <br />
                <h6 className="text-center text-underline">
                  <u>BOM'S</u>
                </h6>
                <div className="Import_booking_item_table">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>SL</th>
                        <th>Item</th>
                        <th>Item Details</th>
                        <th>Unit</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>QTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.item_name}</td>
                          <td>
                            <pre>{item.description}</pre>
                          </td>
                          <td>{item.unit}</td>
                          <td>{item.size}</td>
                          <td>{item.color}</td>
                          <td>{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
