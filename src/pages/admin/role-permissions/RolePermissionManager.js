import React, { useEffect, useState } from "react";
import api from "services/api";

export default function RolePermissionManager() {
  const [menus, setMenus] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchMap, setSearchMap] = useState({});

  const [form, setForm] = useState({
    label: "",
    path: "",
    icon: "",
    description: "",
  });

  /* ---------------- LOAD DATA ---------------- */

  const loadMenus = async () => {
    const res = await api.get("/admin/menus");
    setMenus(res.data);
  };

  const loadMeta = async () => {
    const res = await api.get("/admin/permission-meta");
    setDepartments(res.data.departments);
    setDesignations(res.data.designations);
  };

  useEffect(() => {
    loadMenus();
    loadMeta();
  }, []);

  const selectMenu = async (menu) => {
    setSelectedMenu(menu);

    const res = await api.get(`/admin/menus/${menu.id}/permissions`);
    setSelectedPermissions(
      res.data.map((p) => `${p.department_id}-${p.designation_id}`)
    );
  };

  /* ---------------- MENU CRUD ---------------- */

  const createMenu = async () => {
    await api.post("/admin/menus", form);
    setForm({ label: "", path: "", icon: "", description: "" });
    loadMenus();
  };

  const deleteMenu = async (id) => {
    if (!window.confirm("Delete menu?")) return;
    await api.delete(`/admin/menus/${id}`);
    loadMenus();
    setSelectedMenu(null);
  };

  /* ---------------- PERMISSIONS ---------------- */

  const togglePermission = (depId, desId) => {
    const key = `${depId}-${desId}`;
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const savePermissions = async () => {
    await api.post(`/admin/menus/${selectedMenu.id}/permissions`, {
      permissions: selectedPermissions.map((key) => {
        const [department_id, designation_id] = key.split("-");
        return { department_id, designation_id };
      }),
    });

    alert("Permissions saved successfully");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">
        {/* LEFT PANEL */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Menu Management</h5>
            </div>

            <div className="card-body">
              <div className="mb-2">
                <input
                  className="form-control"
                  placeholder="Menu Label"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <input
                  className="form-control"
                  placeholder="Path"
                  value={form.path}
                  onChange={(e) => setForm({ ...form, path: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Icon class (optional)"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Short Desc(optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>

              <button
                className="btn btn-success w-100 mb-3"
                onClick={createMenu}
              >
                ➕ Add Menu
              </button>

              <ul className="list-group">
                {menus.map((menu) => (
                  <li
                    key={menu.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      selectedMenu?.id === menu.id ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <span onClick={() => selectMenu(menu)}>
                      {menu.label}
                      <br />
                      <small className="text-muted">{menu.path}</small>
                    </span>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteMenu(menu.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        {/* RIGHT PANEL */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {selectedMenu
                  ? `Permissions – ${selectedMenu.label}`
                  : "Menu Permissions"}
              </h5>

              {selectedMenu && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={savePermissions}
                >
                  💾 Save
                </button>
              )}
            </div>
            <div className="card-body">
              {selectedMenu ? (
                <div className="accordion" id="departmentAccordion">
                  {departments.map((dep) => {
                    const depDesignations = dep.designations || [];

                    const total = depDesignations.length;

                    const allowed = depDesignations.filter((des) =>
                      selectedPermissions.includes(`${dep.id}-${des.id}`)
                    ).length;

                    const isAllChecked = total > 0 && allowed === total;

                    const toggleDepartment = () => {
                      const depKeys = depDesignations.map(
                        (des) => `${dep.id}-${des.id}`
                      );

                      setSelectedPermissions((prev) =>
                        isAllChecked
                          ? prev.filter((k) => !depKeys.includes(k))
                          : [...new Set([...prev, ...depKeys])]
                      );
                    };

                    return (
                      <div className="accordion-item mb-2" key={dep.id}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed d-flex justify-content-between"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#dep-${dep.id}`}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isAllChecked}
                                onChange={toggleDepartment}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <strong>{dep.title}</strong>
                            </div>

                            <span className="badge bg-primary ms-3">
                              {allowed} / {total}
                            </span>
                          </button>
                        </h2>

                        <div
                          id={`dep-${dep.id}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#departmentAccordion"
                        >
                          <div className="accordion-body">
                            {/* Search */}
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2"
                              placeholder="🔍 Search designation..."
                              value={searchMap[dep.id] || ""}
                              onChange={(e) =>
                                setSearchMap({
                                  ...searchMap,
                                  [dep.id]: e.target.value,
                                })
                              }
                            />

                            {/* Select buttons */}
                            <div className="d-flex gap-2 mb-3">
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() =>
                                  setSelectedPermissions((prev) => [
                                    ...new Set([
                                      ...prev,
                                      ...depDesignations.map(
                                        (des) => `${dep.id}-${des.id}`
                                      ),
                                    ]),
                                  ])
                                }
                              >
                                Select All
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  setSelectedPermissions((prev) =>
                                    prev.filter(
                                      (k) => !k.startsWith(`${dep.id}-`)
                                    )
                                  )
                                }
                              >
                                Unselect All
                              </button>
                            </div>

                            {/* Designations */}
                            <div className="row">
                              {depDesignations
                                .filter((des) =>
                                  des.title
                                    .toLowerCase()
                                    .includes(
                                      (searchMap[dep.id] || "").toLowerCase()
                                    )
                                )
                                .map((des) => {
                                  const key = `${dep.id}-${des.id}`;
                                  return (
                                    <div key={key} className="col-md-6 mb-2">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={selectedPermissions.includes(
                                            key
                                          )}
                                          onChange={() =>
                                            togglePermission(dep.id, des.id)
                                          }
                                          id={`chk-${key}`}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`chk-${key}`}
                                        >
                                          {des.title}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <h6>Select a menu to manage permissions</h6>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
