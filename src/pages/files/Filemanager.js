import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Filemanager(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Files",
      isModalButton: false,
      modalButtonRef: "",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);
  return (
    <>
      <div className="create_edit_page">
        <div className="row">
          <div className="col-12 col-lg-3">
            <div className="card">
              <div className="card-body">
                <div className="d-grid">
                  {" "}
                  <Link to="#" className="btn btn-primary">
                    + Add File
                  </Link>
                </div>
                <h5 className="my-3">My Files</h5>
                <div className="fm-menu">
                  <div className="list-group list-group-flush">
                    {" "}
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-folder me-2"></i>
                      <span>All Files</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-analyse me-2"></i>
                      <span>Recents</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-plug me-2"></i>
                      <span>Important</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-trash-alt me-2"></i>
                      <span>Deleted Files</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-file me-2"></i>
                      <span>Documents</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-image me-2"></i>
                      <span>Images</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-video me-2"></i>
                      <span>Videos</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-music me-2"></i>
                      <span>Audio</span>
                    </Link>
                    <Link to="#" className="list-group-item py-1">
                      <i className="bx bx-beer me-2"></i>
                      <span>Zip Files</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="mb-0 text-primary font-weight-bold">
                  45.5 GB{" "}
                  <span className="float-end text-secondary">50 GB</span>
                </h5>
                <p className="mb-0 mt-2">
                  <span className="text-secondary">Used</span>
                </p>
                <div className="progress mt-3" style={{ height: "7px" }}>
                  <div
                    className="progress-bar"
                    style={{ width: "15%" }}
                    role="progressbar"
                    aria-valuenow="15"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: "30%" }}
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: "20%" }}
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="mt-3"></div>
                <div className="d-flex align-items-center">
                  <div className="fm-file-box bg-light-primary text-primary">
                    <i className="bx bx-image"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Images</h6>
                    <p className="mb-0 text-secondary">1,756 files</p>
                  </div>
                  <h6 className="text-primary mb-0">15.3 GB</h6>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <div className="fm-file-box bg-light-success text-success">
                    <i className="bx bxs-file-doc"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Documents</h6>
                    <p className="mb-0 text-secondary">123 files</p>
                  </div>
                  <h6 className="text-primary mb-0">256 MB</h6>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <div className="fm-file-box bg-light-danger text-danger">
                    <i className="bx bx-video"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Media Files</h6>
                    <p className="mb-0 text-secondary">24 files</p>
                  </div>
                  <h6 className="text-primary mb-0">3.4 GB</h6>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <div className="fm-file-box bg-light-warning text-warning">
                    <i className="bx bx-image"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Other Files</h6>
                    <p className="mb-0 text-secondary">458 files</p>
                  </div>
                  <h6 className="text-primary mb-0">3 GB</h6>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <div className="fm-file-box bg-light-info text-info">
                    <i className="bx bx-image"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Unknown Files</h6>
                    <p className="mb-0 text-secondary">57 files</p>
                  </div>
                  <h6 className="text-primary mb-0">178 GB</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-9">
            <div className="card">
              <div className="card-body">
                <h5>Folders</h5>
                <div className="row">
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Techpacks</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">SOR</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Fabrics</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Threads</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Styles</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Costings</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Budgets</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">Bookings</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="card shadow-none border radius-15 margin_10">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="font-30 text-primary">
                            <i className="bx bxs-folder"></i>
                          </div>
                        </div>
                        <h6 className="mb-0 text-primary">PI</h6>
                        <small>15 files</small>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="d-flex align-items-center">
                    <div>
                      <h5 className="mb-0">Recent Files</h5>
                    </div>
                    <div className="ms-auto">
                      <Link to="#" className="btn btn-sm btn-outline-secondary">
                        View all
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive mt-3">
                    <table className="table table-striped table-hover table-sm mb-0">
                      <thead>
                        <tr>
                          <th>
                            Name <i className="bx bx-up-arrow-alt ms-2"></i>
                          </th>
                          <th>Folders</th>
                          <th>Upload At </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file-pdf me-2 font-24 text-danger"></i>
                              </div>
                              <div className="font-weight-bold text-danger">
                                Competitor Analysis Template
                              </div>
                            </div>
                          </td>
                          <td>Only you</td>
                          <td>Sep 3, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file me-2 font-24 text-primary"></i>
                              </div>
                              <div className="font-weight-bold text-primary">
                                How to Create a Case Study
                              </div>
                            </div>
                          </td>
                          <td>3 members</td>
                          <td>Jun 12, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file me-2 font-24 text-primary"></i>
                              </div>
                              <div className="font-weight-bold text-primary">
                                Landing Page Structure
                              </div>
                            </div>
                          </td>
                          <td>10 members</td>
                          <td>Jul 17, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file-pdf me-2 font-24 text-danger"></i>
                              </div>
                              <div className="font-weight-bold text-danger">
                                Meeting Report
                              </div>
                            </div>
                          </td>
                          <td>5 members</td>
                          <td>Aug 28, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file me-2 font-24 text-primary"></i>
                              </div>
                              <div className="font-weight-bold text-primary">
                                Project Documents
                              </div>
                            </div>
                          </td>
                          <td>Only you</td>
                          <td>Aug 17, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file-doc me-2 font-24 text-success"></i>
                              </div>
                              <div className="font-weight-bold text-success">
                                Review Checklist Template
                              </div>
                            </div>
                          </td>
                          <td>7 members</td>
                          <td>Sep 8, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file me-2 font-24 text-primary"></i>
                              </div>
                              <div className="font-weight-bold text-primary">
                                How to Create a Case Study
                              </div>
                            </div>
                          </td>
                          <td>3 members</td>
                          <td>Jun 12, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file me-2 font-24 text-primary"></i>
                              </div>
                              <div className="font-weight-bold text-primary">
                                Landing Page Structure
                              </div>
                            </div>
                          </td>
                          <td>10 members</td>
                          <td>Jul 17, 2019</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <i className="bx bxs-file-doc me-2 font-24 text-success"></i>
                              </div>
                              <div className="font-weight-bold text-success">
                                Review Checklist Template
                              </div>
                            </div>
                          </td>
                          <td>7 members</td>
                          <td>Sep 8, 2019</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
