import { useNotificationValue } from "./NotificationContext";

const Notification = (/* { message, isError } */) => {
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

  const messageQ = useNotificationValue();
  console.log(messageQ);
  if (messageQ === null) {
    return messageQ.isError ? (
      <div class="notification" style={errorStyle}>
        {messageQ.text}
      </div>
    ) : (
      <div class="notification" style={notificationStyle}>
        {messageQ.text}
      </div>
    );
  }

  /*   if (message !== null) {
    return isError ? (
      <div class ='notification' style={errorStyle}>{message}</div>
    ) : (
      <div  class ='notification' style={notificationStyle}>{message}</div>
    )
  } */
};

export default Notification;
