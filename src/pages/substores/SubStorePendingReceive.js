import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Spinner from "../../elements/Spinner";
import Select from "react-select";
import api from "services/api";
import SubstoreReceiveCanvas from "../../elements/modals/SubstoreReceiveCanvas";

export default function SubStorePendingReceive(props) {
  const history = useHistory();
  const userInfo = props.userData;

  const [searchValue, setSearchValue] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [requisitions, setRequisitions] = useState([]);

  const [requisitionItems, setRequisitionItems] = useState([]);

  const getRequisitionItems = async () => {
    setSpinner(true);
    try {
      const response = await api.post("/substores-pending-receive");
      if (response.status === 200 && response.data) {
        setRequisitionItems(response.data.data);
      } else {
        setRequisitionItems([]);
      }
    } catch (error) {
      console.error("Error fetching requisition:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getRequisitionItems();
  }, []);

  useEffect(() => {
    getRequisitionItems();
  }, [props.callRequisition]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Waiting For Receive</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          <Link to="/sub-stores" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <h6>Requisitions Item's</h6>
        <div className="Import_requisition_item_table">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>Requisition Number</th>
                <th>Item</th>
                <th>Unit</th>
                <th>Final Qty</th>
                <th>Received QTY</th>
                <th>Left Receive QTY</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {requisitionItems
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.requisition_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.part_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.requisition_number}</td>
                        <td>{item.part_name}</td>
                        <td>{item.unit}</td>
                        <td>{item.final_qty}</td>
                        <td>{item.received_qty}</td>
                        <td>{item.left_received_qty}</td>
                        <td>
                          {item.left_received_qty > 0 && (
                            <button
                              onClick={() => {
                                props.setSubstoreReceiveCanvas(true);
                                props.setRequisitionItemId(item.id);
                              }}
                              className="btn btn-sm btn-success"
                            >
                              Receive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {requisitionItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.requisition_number}</td>
                      <td>{item.part_name}</td>
                      <td>{item.unit}</td>
                      <td>{item.final_qty}</td>
                      <td>{item.received_qty}</td>
                      <td>{item.left_received_qty}</td>
                      <td>
                        {item.left_received_qty > 0 && (
                          <button
                            onClick={() => {
                              props.setSubstoreReceiveCanvas(true);
                              props.setRequisitionItemId(item.id);
                            }}
                            className="btn btn-sm btn-success"
                          >
                            Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          <SubstoreReceiveCanvas {...props} />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
