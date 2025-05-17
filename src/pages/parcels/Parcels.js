import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import Pagination from "../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import { Link } from "react-router-dom";
import moment from "moment";

export default function Parcels(props) {
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

  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

  // get all store items
  const [parcels, setParcels] = useState([]);
  const getParcels = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/parcels", {
      search: props.headerData.innerSearchValue,
      page: currentPage,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setParcels(response.data.parcels.data);
      setLinks(response.data.parcels.links);
      setFrom(response.data.parcels.from);
      setTo(response.data.parcels.to);
      setTotal(response.data.parcels.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getParcels();
  }, [currentPage, props.headerData.innerSearchValue]);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getParcels();
      if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      const dataTable = $(dataTableRef.current).DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copy",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "excel",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "print",
            exportOptions: {
              columns: function (idx, data, node) {
                return true;
              },
            },
            customize: function (win) {
              // Add title on top of DataTable when printing
              var newTitle = $("<h6>")
                .css("text-align", "left")
                .html("Parcels");
              newTitle.insertAfter($(win.document.body).find("h1"));
            },
          },
        ],
        paging: false, // Disable pagination
        info: false,
        searching: false,
        // order: [[0, "desc"]],
        // DataTable options go here
      });

      setSpinner(false); // Move this line inside the function
      // Destroy DataTable when the component unmounts
      return () => {
        dataTable.destroy();
      };
    };

    fetchDataAndInitializeDataTable();
  }, []);

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Create an async function inside the then block to handle the async operation
        (async () => {
          try {
            var response = await api.post("/parcels-delete", {
              id: id,
            });

            if (response.status === 200 && response.data) {
              swal({
                title: "Deleted Success",
                text: "Item deleted successfully",
                icon: "success",
              });
              getParcels();
            } else {
              swal({
                title: "Deletion Failed",
                text: "Failed to delete item",
                icon: "error",
              });
            }
          } catch (error) {
            swal({
              title: "Deletion Failed",
              text: "An error occurred while deleting the item",
              icon: "error",
            });
          }
        })();
      } else {
        swal("Item is safe!");
      }
    });
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Parcels",
      isModalButton: false,
      modalButtonRef: "",
      isNewButton: true,
      newButtonLink: "parcels-issue",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="employee_lists">
        <div className="table-responsive">
          <table ref={dataTableRef} className="table">
            <thead className="bg-dark text-white align-items-center">
              <tr>
                <th>THUMB</th>
                <th>T. NO.</th>
                <th>ITEM</th>
                <th>FROM</th>
                <th>NOW</th>
                <th>TO</th>
                <th>MEDIA</th>
                <th>CHALLAN & REF</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <>
                {parcels.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        onClick={() => openImageModal(item.image_source)}
                        style={{
                          height: "35px",
                          width: "35px",
                          border: "1px solid gray",
                          borderRadius: "3px",
                          cursor: "pointer",
                          float: "left",
                        }}
                        src={item.image_source}
                      />
                    </td>
                    <td>
                      <strong>{item.tracking_number}</strong>
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                      <br />
                      Type: {item.item_type}
                    </td>
                    <td>
                      <strong>{item.from_company_name}</strong>
                      <br />
                      {item.user_name}
                      <br />
                      {moment(item.created_at).format("LLL")}
                    </td>
                    <td>
                      <strong>{item.current_company_name}</strong>
                      <br />
                      {item.receiver_name}
                      <br />
                      {moment(item.received_date).format("LLL")}
                    </td>
                    <td>
                      <strong>{item.destination_company_name}</strong>
                      <br />
                      {item.destination_person_name}
                    </td>
                    <td>
                      <strong>{item.method}</strong>
                    </td>
                    <td>
                      <strong>Challan: {item.challan_no}</strong>
                      <br />
                      Ref: {item.reference}
                    </td>

                    <td>
                      <strong>{item.status}</strong>
                    </td>
                    <td>
                      <Link to={"/parcels-details/" + item.tracking_number}>
                        <i className="fa fa-qrcode me-2"></i>
                      </Link>
                      {item.status === "Issued" &&
                      item.user_id === props.userData.userId ? (
                        <>
                          <Link to={"/parcels-edit/" + item.tracking_number}>
                            <i className="fa fa-pen me-2 text-falgun"></i>
                          </Link>

                          <Link to="#" onClick={() => handleDelete(item.id)}>
                            <i className="fa fa-trash text-danger"></i>
                          </Link>
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        </div>
        <br />
        <h6 className="text-center">
          Showing {from} To {to} From {total}
        </h6>

        <Pagination
          links={links}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

      <br />
      <br />

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
    </div>
  );
}
