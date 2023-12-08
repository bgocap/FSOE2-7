import { useSelector } from "react-redux";

const notificationStyle = {
  fontSize: 18,
  borderRadius: 10,
  height: 40,
  display: "flex",
  alignItems: "center",
  textAlign: "left",
  padding: 5,
  backgroundColor: "rgb(204, 255, 204)",
  color: "rgb(0, 153, 51)",
};
const errorStyle = {
  ...notificationStyle,
  backgroundColor: "rgb(255, 159, 128)",
  color: "rgb(204, 51, 0)",
};

const Notification = () => {
  const notification = useSelector((state) => state.notificationMessage);
  if (notification.message !== null) {
    return notification.isError ? (
      <div className="notification" style={errorStyle}>
        {notification.message}
      </div>
    ) : (
      <div className="notification" style={notificationStyle}>
        {notification.message}
      </div>
    );
  }
};

export default Notification;
