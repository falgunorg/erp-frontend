import { useState, useRef, useEffect } from "react";
import { ArrowDownIcon, AttatchmentIcon } from "elements/SvgIcons";
import api from "services/api";

const MultipleFileView = ({ label, selectedFiles, filled }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)
      ) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuIndex]);

  const deleteFile = async (id) => {
    var response = await api.post("/pos-file-delete", { id: id });
    if (response.status === 200 && response.data) {
      alert("Successfully Deleted");
    }
  };

  return (
    <div className="row create_tp_body">
      <div className="col-lg-3">
        <label
          className={filled ? "form-label fill bg-falgun" : "form-label fill "}
        >
          {label}
        </label>
      </div>
      <div className="col-lg-9" style={{ paddingLeft: 0 }}>
        <div className="show_attatchment_area">
          <div className="attatchments_displaying_area">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="item"
                ref={(el) => (menuRefs.current[index] = el)}
              >
                <div
                  onClick={() => toggleMenu(index)}
                  className={
                    openMenuIndex === index ? "item_label active" : "item_label"
                  }
                >
                  <div className="item_title">{file.filename}</div>
                  <div className="item_toggle">
                    <ArrowDownIcon />
                  </div>
                </div>
                {openMenuIndex === index && (
                  <div className="item_menu">
                    <ul>
                      <li
                        onClick={() => deleteFile(file.id)}
                        className="text-danger"
                      >
                        Delete
                      </li>
                      <li>
                        <a target="_blank" download href={file.file_url}>
                          Preview
                        </a>
                      </li>
                      <li onClick={() => toggleMenu(index)}>Cancel</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleFileView;
