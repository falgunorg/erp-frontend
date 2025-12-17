import React, { useEffect, useState } from "react";
import api from "services/api";

export default function RolePermissionManager() {
  const [menus, setMenus] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [form, setForm] = useState({
    label: "",
    path: "",
    icon: "",
    description: "",
    module: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  const loadMenus = async () => {
    const res = await api.get("/admin/menus");
    setMenus(res.data);
  };

  const loadMeta = async () => {
    const res = await api.get("/admin/permission-meta");
    setDepartments(res.data.departments);
  };

  useEffect(() => {
    loadMenus();
    loadMeta();
  }, []);

  /* ---------------- MENU CRUD ---------------- */
  const selectMenu = async (menu) => {
    setSelectedMenu(menu);
    setForm({
      label: menu.label,
      path: menu.path,
      icon: menu.icon || "",
      description: menu.description || "",
      module: menu.module || "",
    });

    const res = await api.get(`/admin/menus/${menu.id}/permissions`);
    setSelectedPermissions(
      res.data.map((p) => `${p.department_id}-${p.designation_id}`)
    );
  };

  const createOrUpdateMenu = async () => {
    if (!form.label || !form.path || !form.module) {
      alert("Label, Path, and Module are required");
      return;
    }

    if (selectedMenu) {
      await api.put(`/admin/menus/${selectedMenu.id}`, form);
      alert("Menu updated successfully");
    } else {
      await api.post("/admin/menus", form);
      alert("Menu created successfully");
    }

    setForm({ label: "", path: "", icon: "", description: "", module: "" });
    setSelectedMenu(null);
    loadMenus();
  };

  const deleteMenu = async (id) => {
    if (!window.confirm("Delete menu?")) return;
    await api.delete(`/admin/menus/${id}`);
    setSelectedMenu(null);
    loadMenus();
  };

  /* ---------------- PERMISSIONS ---------------- */
  const updatePermissions = async (updated) => {
    setSelectedPermissions(updated);
    if (!selectedMenu) return;
    await api.post(`/admin/menus/${selectedMenu.id}/permissions`, {
      permissions: updated.map((key) => {
        const [department_id, designation_id] = key.split("-");
        return { department_id, designation_id };
      }),
    });
  };

  const togglePermission = async (depId, desId) => {
    const key = `${depId}-${desId}`;
    const updated = selectedPermissions.includes(key)
      ? selectedPermissions.filter((i) => i !== key)
      : [...selectedPermissions, key];
    updatePermissions(updated);
  };

  const toggleDepartment = async (depId, depDesignations) => {
    const depKeys = depDesignations.map((des) => `${depId}-${des.id}`);
    const isAllChecked = depKeys.every((key) =>
      selectedPermissions.includes(key)
    );
    const updated = isAllChecked
      ? selectedPermissions.filter((k) => !depKeys.includes(k))
      : [...new Set([...selectedPermissions, ...depKeys])];
    updatePermissions(updated);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">
        {/* LEFT PANEL */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {selectedMenu ? "Edit Menu" : "Add New Menu"}
              </h5>
            </div>
            <div className="card-body">
              <input
                className="form-control mb-2"
                placeholder="Menu Label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Path"
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Module"
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Icon class (optional)"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Short Desc (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <button
                className="btn btn-success w-100 mb-3"
                onClick={createOrUpdateMenu}
              >
                {selectedMenu ? "💾 Update Menu" : "➕ Add Menu"}
              </button>

              <div
                className="menu_list"
                style={{ height: "400px", overflowY: "scroll" }}
              >
                {Object.entries(menus).map(([module, moduleMenus]) => (
                  <div key={module} className="mb-3">
                    <div className="fw-bold text-uppercase text-primary mb-1">
                      {module}
                    </div>
                    <ul className="list-group">
                      {moduleMenus.map((menu) => (
                        <li
                          key={menu.id}
                          className={`list-group-item d-flex justify-content-between align-items-center ${
                            selectedMenu?.id === menu.id ? "active" : ""
                          }`}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => selectMenu(menu)}
                          >
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                {selectedMenu
                  ? `Permissions – ${selectedMenu.label}`
                  : "Menu Permissions"}
              </h5>
            </div>
            <div className="card-body">
              {selectedMenu ? (
                <div className="accordion row" id="departmentAccordion">
                  {departments.map((dep) => {
                    const depDesignations = dep.designations || [];
                    const total = depDesignations.length;
                    const allowed = depDesignations.filter((des) =>
                      selectedPermissions.includes(`${dep.id}-${des.id}`)
                    ).length;
                    const isAllChecked = total > 0 && allowed === total;

                    return (
                      <div className="col-4" key={dep.id}>
                        <div className="accordion-item mb-2">
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
                                  onChange={() =>
                                    toggleDepartment(dep.id, depDesignations)
                                  }
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
                              <div className="d-flex gap-2 mb-3">
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    toggleDepartment(dep.id, depDesignations)
                                  }
                                >
                                  Select All
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => toggleDepartment(dep.id, [])}
                                >
                                  Unselect All
                                </button>
                              </div>

                              {/* Designations */}
                              {depDesignations.map((des) => {
                                const key = `${dep.id}-${des.id}`;
                                return (
                                  <div key={key} className="form-check mb-1">
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
