import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function PowerTeams(props) {
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
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
    });
  };
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };

  // get teams
  const [teams, setTeams] = useState([]);
  const getTeams = async () => {
    setSpinner(true);
    var response = await api.post("/teams", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
    });
    if (response.status === 200 && response.data) {
      setTeams(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // Details on Modal
  const [teamModal, setTeamModal] = useState(false);
  const closeTeamModal = () => {
    setTeamModal(false);
  };
  const [teamDetails, setTeamDetails] = useState({});
  const getTeamDetails = async (id) => {
    setSpinner(true);
    var response = await api.post("/teams-show", { id: id });
    if (response.status === 200 && response.data) {
      setTeamDetails(response.data.data);
      setTeamModal(true);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  useEffect(async () => {
    getTeams();
  }, []);
  useEffect(async () => {
    getTeams();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("settings");
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
        <div className="page_name">Teams</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="/power/teams-create"
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
                  <option value="200">200</option>
                  <option value="500">500</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Refresh</label>
                <div>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
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
                <th>Team Number</th>
                <th>Title</th>
                <th>Department</th>
                <th>Work Space</th>
                <th>Team leader</th>
                <th>Team Members</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {teams
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.team_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.department_title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.company_title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.team_number}</td>
                        <td>{item.title}</td>
                        <td>{item.department_title}</td>
                        <td>{item.company_title}</td>
                        <td>
                          <img
                            alt={item.team_leader_username}
                            style={{
                              height: "40px",
                              width: "40px",
                              borderRadius: "50%",
                              margin: 5,
                              border: "1px solid green",
                            }}
                            src={item.team_leader_photo}
                          />
                        </td>
                        <td className="d-flex">
                          {item.employee_list &&
                            item.employee_list.map((item2) => (
                              <img
                                alt={item2.employee_name}
                                onClick={() =>
                                  openImageModal(item2.employee_photo)
                                }
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  borderRadius: "50%",
                                  margin: 5,
                                  cursor: "pointer",
                                  border: "1px solid green",
                                }}
                                src={item2.employee_photo}
                              />
                            ))}
                        </td>
                        <td>{moment(item.created_at).format("ll")}</td>

                        <td>
                          <Link to="#" onClick={() => getTeamDetails(item.id)}>
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                          <Link to={"/power/teams-edit/" + item.id}>
                            <i className="fa fa-pen mr-10 text-info"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {teams.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.team_number}</td>
                      <td>{item.title}</td>
                      <td>{item.department_title}</td>
                      <td>{item.company_title}</td>
                      <td>
                        <img
                          alt={item.team_leader_username}
                          style={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "50%",
                            margin: 5,
                            border: "1px solid green",
                          }}
                          src={item.team_leader_photo}
                        />
                      </td>
                      <td className="d-flex">
                        {item.employee_list &&
                          item.employee_list.map((item2) => (
                            <img
                              alt={item2.employee_name}
                              onClick={() =>
                                openImageModal(item2.employee_photo)
                              }
                              style={{
                                height: "40px",
                                width: "40px",
                                borderRadius: "50%",
                                margin: 5,
                                cursor: "pointer",
                                border: "1px solid green",
                              }}
                              src={item2.employee_photo}
                            />
                          ))}
                      </td>
                      <td>{moment(item.created_at).format("ll")}</td>

                      <td>
                        <Link onClick={() => getTeamDetails(item.id)}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                        <Link to={"/power/teams-edit/" + item.id}>
                          <i className="fa fa-pen mr-10 text-info"></i>
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
      <Modal size="lg" show={teamModal} onHide={closeTeamModal}>
        <Modal.Header closeButton>
          <Modal.Title>Team Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="bg-light py-3  py-xl-8">
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-12 col-md-10">
                  <h2 className="mb-4 display-5 text-center">
                    {teamDetails.title}
                  </h2>
                  <p className="text-secondary mb-5 text-center lead fs-4">
                    {teamDetails.description}
                  </p>
                  <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
                </div>
              </div>
            </div>

            <div className="container overflow-hidden">
              <div className="row gy-4 gy-lg-0 gx-xxl-5">
                <div className="col-lg-6 mb-3 offset-lg-3">
                  <Link style={{ textDecoration: "none" }} to="#">
                    <div className="bg-modiste-purple rounded shadow-sm py-5 px-4 text-center">
                      <img
                        src={teamDetails.team_leader_photo}
                        alt=""
                        style={{ height: "120px", width: "120px" }}
                        className="img-fluid rounded-circle mb-3 img-thumbnail shadow-lg"
                      />
                      <h5 className="mb-0 text-dark">
                        {teamDetails.team_leader_username}
                      </h5>
                      <span className="small text-uppercase text-muted">
                        {teamDetails.team_leader_designation}
                      </span>
                      <br />
                      <small className="text-white">
                        {teamDetails.department_title}
                      </small>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="row gy-4 gy-lg-0 gx-xxl-5">
                {teamDetails.employee_list &&
                  teamDetails.employee_list.map((employee) => (
                    <div className="col-xl-4 col-sm-6 mb-4">
                      <Link style={{ textDecoration: "none" }} to="#">
                        <div className="bg-falgun rounded shadow-sm py-4 px-2 text-center">
                          <img
                            src={employee.employee_photo}
                            alt=""
                            style={{ height: "100px", width: "100px" }}
                            className="img-fluid rounded-circle mb-3 img-thumbnail shadow-lg"
                          />
                          <h5 className="mb-0 text-dark">
                            {employee.full_name}
                          </h5>
                          <span className="small text-uppercase text-muted">
                            {employee.employee_designation}
                          </span>
                          <br />
                          <small className="text-white">
                            {employee.employee_department}
                          </small>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeTeamModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Image</Modal.Title>
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
    </div>
  );
}
