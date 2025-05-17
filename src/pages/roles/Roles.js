import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../elements/Spinner";
import api from "../../services/api";

export default function Roles(props) {
  const [spinner, setSpinner] = useState(false);
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    setSpinner(true);
    var response = await api.get("/roles");
    console.log(response.data);
    if (response.status === 200 && response.data) {
      setRoles(response.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  useEffect(async () => {
    getRoles();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Manage Role Permission</div>
        <div className="actions">
          {props.rolePermission?.Rolepermission?.add_edit ? (
            <Link to="/roles-create" className="btn btn-warning bg-falgun rounded-circle">
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <table className="table tablesorter">
            <thead className=" text-primary">
              <th scope="col">No</th>
              <th scope="col">Role Name</th>
              <th scope="col">Access Level</th>
              <th scope="col"></th>
            </thead>
            <tbody>
              {roles.length > 0
                ? roles.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.level}</td>
                      <td className="td-actions text-right">
                        {props.rolePermission?.Rolepermission?.add_edit ? (
                          <Link to={"/roles-edit/" + item.id}>
                            <i className="fal fa-pen"></i>
                          </Link>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))
                : "No roles found"}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
