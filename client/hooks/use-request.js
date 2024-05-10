import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props={}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, 
        {
          ...body,
          ...props
        }
      );
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <div>Ooops...</div>
          <ul className="my-0">
            {err.response.data.errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
