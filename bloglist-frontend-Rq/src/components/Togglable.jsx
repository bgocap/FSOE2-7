import PropTypes from "prop-types";
import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });
  const newBlogFormStyle = {
    marginTop: 10,
    marginBottom: 10,
  };
  return (
    <div style={newBlogFormStyle}>
      <div style={hideWhenVisible}>
        <button
          onClick={toggleVisibility}
          className="mt-5 font-semiBold text-gray-500 text-2xl stroke-gray-500 stroke-[2.3px] hover:text-gray-800 hover:font-bold hover:stroke-[3px] hover:stroke-gray-800"
        >
          <span className=" flex items-center pointer-events-none">
            <svg
              className="w-7 h-7 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {props.buttonLabelOpen}
          </span>
        </button>
      </div>
      <div style={showWhenVisible}>
        <button
          onClick={toggleVisibility}
          className="p-3 font-semiBold text-gray-500 text-2xl stroke-gray-500 stroke-[2.3px] hover:text-gray-800 hover:font-bold hover:stroke-[3px] hover:stroke-gray-800"
        >
          <span className=" flex items-center pointer-events-none">
            <svg
              className="w-7 h-7 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {props.buttonLabelClose}
          </span>
        </button>
        {props.children}
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabelOpen: PropTypes.string.isRequired,
  buttonLabelClose: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
