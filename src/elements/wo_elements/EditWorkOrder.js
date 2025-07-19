import React, { useState, useEffect, useImperativeHandle } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import CustomSelect from "elements/CustomSelect";
import api from "services/api";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";

export default function EditWorkOrder({ renderArea, setRenderArea }) {
  const { id } = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    technical_package_id: "",
    create_date: "",
    delivery_date: "",
    wo_ref: "",
    sewing_sam: "",
    po_list: [],
  });

  const fetchWorkOrder = async () => {
    try {
      const response = await api.post("/workorders-show", { id });
      if (response.status === 200 && response.data.workorder) {
        const data = response.data.workorder;
        setFormData({
          ...data,
          technical_package_id: String(data.technical_package_id),
          po_list: data.pos.map((po) => String(po.id)),
          buyer: data.techpack?.buyer?.name || "",
          brand: data.techpack?.brand || "",
          season: data.techpack?.season || "",
          description: data.techpack?.description || "",
          buyer_style_name: data.techpack?.buyer_style_name || "",
          item_name: data.techpack?.item_name || "",
          item_type: data.techpack?.item_type || "",
          department: data.techpack?.department || "",
          wash_details: data.techpack?.wash_details || "",
          special_operations:
            data.techpack?.special_operation?.split(",").filter(Boolean) || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch work order:", error);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const handleChange = async (name, value) => {
    if (name === "technical_package_id") {
      try {
        const response = await api.post("/technical-package-show", {
          id: value,
        });
        if (response.status === 200 && response.data) {
          const data = response.data;
          setFormData((prev) => ({
            ...prev,
            technical_package_id: value,
            company_id: data.company_id || "",
            buyer: data.buyer?.name || "",
            brand: data.brand || "",
            season: data.season || "",
            description: data.description || "",
            buyer_style_name: data.buyer_style_name || "",
            item_name: data.item_name || "",
            item_type: data.item_type || "",
            department: data.department || "",
            wash_details: data.wash_details || "",
            special_operations:
              data.special_operation?.split(",").filter(Boolean) || [],
            po_list: [],
          }));
        }
      } catch (error) {
        console.error("Error fetching techpack:", error);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = {
      technical_package_id: "Please select a Tech Pack.",
      create_date: "Issued Date is required.",
      delivery_date: "Delivery Date is required.",
      sewing_sam: "Sewing SAM is required.",
      po_list: "Please select at least one PO.",
    };

    const formErrors = {};
    for (const field in requiredFields) {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        formErrors[field] = requiredFields[field];
      }
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "po_list" && Array.isArray(value)) {
          value.forEach((poId) => data.append("po_list[]", poId));
        } else {
          data.append(key, value);
        }
      });

      const response = await api.post("/workorders-update", data);
      if (response.status === 200 && response.data) {
        history.push("/work-orders/" + response.data.workorder.id);
        setRenderArea("details");
        window.location.reload();
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error("Update failed:", error);
      swal({
        title: "Update Failed",
        text: "Something went wrong while updating the form.",
        icon: "error",
      });
    } finally {
      setSpinner(false);
    }
  };

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    const response = await api.post("/technical-packages-all-desc", {
      mode: "self",
    });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    }
  };

  const [pos, setPos] = useState([]);
  const getPos = async () => {
    const response = await api.post("/public-pos", {
      technical_package_id: formData.technical_package_id,
    });
    if (response.status === 200 && response.data) {
      setPos(response.data.data);
    }
  };

  useEffect(() => {
    if (formData.technical_package_id) {
      getPos();
    }
  }, [formData.technical_package_id]);

  useEffect(() => {
    getTechpacks();
  }, []);

  return (
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">WO</span>
            </div>
            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleSubmit}
            className="btn btn-default submit_button"
          >
            Update
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-3">
              <CustomSelect
                className={
                  errors.technical_package_id
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="Techpack"
                options={techpacks.map(({ id, techpack_number }) => ({
                  value: id,
                  label: techpack_number,
                }))}
                value={
                  techpacks.find(
                    (t) => t.id === parseInt(formData.technical_package_id)
                  ) && {
                    value: parseInt(formData.technical_package_id),
                    label: techpacks.find(
                      (t) => t.id === parseInt(formData.technical_package_id)
                    )?.techpack_number,
                  }
                }
                onChange={(selectedOption) =>
                  handleChange("technical_package_id", selectedOption?.value)
                }
              />

              {errors.technical_package_id && (
                <small className="text-danger">
                  {errors.technical_package_id}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.buyer} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.brand} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.buyer_style_name} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.season} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.item_name} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.department} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.item_type} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Issued Date</label>
            </div>
            <div className="col-lg-3">
              <input
                className={errors.create_date ? "red-border" : ""}
                onChange={(e) => handleChange("create_date", e.target.value)}
                type="date"
                value={formData.create_date}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.description} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Delivery Date</label>
            </div>
            <div className="col-lg-3">
              <input
                className={errors.delivery_date ? "red-border" : ""}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
                type="date"
                value={formData.delivery_date}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.wash_details} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Sewing SAM</label>
            </div>
            <div className="col-lg-3">
              <input
                className={errors.sewing_sam ? "red-border" : ""}
                onChange={(e) => handleChange("sewing_sam", e.target.value)}
                type="number"
                min={0}
                step={0.1}
                value={formData.sewing_sam}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.special_operations} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO'S</label>
            </div>
            <div className="col-lg-10">
              <CustomSelect
                isMulti
                className={
                  errors.po_list ? "select_wo red-border" : "select_wo"
                }
                placeholder="Select PO(s)"
                options={pos.map(({ id, po_number }) => ({
                  value: id,
                  label: po_number,
                }))}
                value={pos
                  .filter((po) => formData.po_list.includes(String(po.id)))
                  .map(({ id, po_number }) => ({
                    value: id,
                    label: po_number,
                  }))}
                onChange={(selectedOptions) =>
                  handleChange(
                    "po_list",
                    selectedOptions
                      ? selectedOptions.map((option) => String(option.value))
                      : []
                  )
                }
              />

              {errors.po_list && (
                <small className="form-label text-danger">
                  {errors.po_list}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
