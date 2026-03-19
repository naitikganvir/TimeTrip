import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  return (
    <>
      {type == "link" ? (
        <Link
          to={path}
          className={`flex justify-center items-center gap-2 py-3 font-semibold bg-black text-white w-full rounded-lg ${classes}`}
        >
          {" "}
          {title} {icon}
        </Link>
      ) : (
        <button
          type={type || null}
          className={`py-3 font-semibold bg-black text-white w-full flex justify-center items-center rounded-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${classes} ${loading && "cursor-not-allowed"}`}
          onClick={fun}
          disabled={loading || disabled}
        >
          {loading ? <span className="flex gap-1"><Spinner />{loadingMessage}</span> : title}
        </button>
      )}
    </>
  );
}

export default Button;
