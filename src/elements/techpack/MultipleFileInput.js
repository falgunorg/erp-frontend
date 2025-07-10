import { useState, useRef, useEffect } from "react";
import { ArrowDownIcon, AttatchmentIcon } from "elements/SvgIcons";

const MultipleFileInput = ({
  label,
  inputId,
  selectedFiles,
  setSelectedFiles,
}) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const handleFileSelection = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => {
      const fileWithLabel = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      fileWithLabel.file_type = inputId;
      return fileWithLabel;
    });

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleFileDelete = (fileIndex) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== fileIndex);
    setSelectedFiles(updatedFiles);
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // Close menu on outside click
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

  return (
    <div className="row align-items-center create_tp_body">
      <div className="col-lg-3">
        <label className="form-label fill">{label}</label>
      </div>
      <div className="col-lg-9" style={{ paddingLeft: 0 }}>
        <div className="show_attatchment_area">
          <div className="add_button">
            <label htmlFor={inputId}>
              <AttatchmentIcon />
            </label>
            <input
              multiple
              onChange={handleFileSelection}
              id={inputId}
              hidden
              type="file"
            />
          </div>

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
                  <div className="item_title">{file.name}</div>
                  <div className="item_toggle">
                    <ArrowDownIcon />
                  </div>
                </div>
                {openMenuIndex === index && (
                  <div className="item_menu">
                    <ul>
                      <li
                        onClick={() => handleFileDelete(index)}
                        className="text-danger"
                      >
                        Remove
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

export default MultipleFileInput;
