import React from 'react';

export default (field) => {
  const { meta } = field;
  return(
    <div className="form-item clearfix">
      <label className="form-label">{field.label || field.input.name}</label>
      <input {...field.input} type={field.type} className="form-input"/>
      {meta.touched && meta.error && <div className="form-input-error">{meta.error}</div>}
    </div>
  );
};
