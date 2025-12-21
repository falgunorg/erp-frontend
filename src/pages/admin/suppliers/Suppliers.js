import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";

import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function Suppliers(props) {
  const dataTableRef = useRef(null);

  const [spinner, setSpinner] = useState(false);

  // get all suppliers

  const [suppliers, setSuppliers] = useState([]);

  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/admin/suppliers");

    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSuppliers();
  }, []);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getSuppliers();
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
                // Exclude the second (index 1) and last columns
                return idx !== dataTable.columns().indexes().length - 1;
              },
            },
          },
        ],
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

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Suppliers</div>
        <div className="actions">
          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="/admin/suppliers/create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="supplier_table">
        <table ref={dataTableRef} className="display">
          <thead>
            <tr>
              <th>#</th>
              <th>Company name</th>
              <th>Attention Person</th>
              <th>Contact</th>
              <th>Email</th>

              <th>Country</th>
              <th>Product Supply</th>
              <th>Added By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.company_name}</td>
                <td>{item.attention_person}</td>
                <td>{item.mobile_number}</td>
                <td>{item.email}</td>

                <td>{item.country}</td>
                <td>{item.product_supply}</td>
                <td>{item.added_by_name}</td>
                <td>{item.status}</td>
                <td>
                  {props.userData.userId === item.added_by && (
                    <>
                      <Link to={"/admin/suppliers/edit/" + item.id}>
                        <i className="fas fa-pen"></i>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
