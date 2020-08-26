import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./notification.css";

export const DEFAULT_AUTOCLOSE = 3000;

export const notify = (type, message) => {
	if(type==="SUCCESS")
		toast.success(message, {position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, className: "toastSuccess"});
	else if(type==="INFO")
		toast.info(message, {position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, className: "toastInfo"});
	else if(type==="WARN")
		toast.warn(message, {position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, className: "toastWarn"});
	else if(type==="ERROR")
		toast.error(message, {position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, className: "toastError"});
	else
		toast.info(message, {position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, className: "toastInfo"});
};

export const processError = (error) => {
	if (error.response) {
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
		error.response.data.message ? notify("ERROR", error.response.data.message) : notify("ERROR", error.response.data);
	} else if (error.request) {
		console.log(error.request);
		notify("ERROR", error.request);
	} else {
		console.log(error.message);
		notify("ERROR", error.message);
	}
};
