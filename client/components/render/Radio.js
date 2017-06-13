import React from 'react';

export default (field) => {
  const { meta } = field;
  return(
    <div className="form-item clearfix">
      <div className="form-title">{field.label}</div>
      {field.options.map((item, i) => (
        <div key={i} className="form-radio clearfix">
          <input {...field.input} type="radio" value={item.value} className="form-radio-input"
                 checked={parseInt(field.input.value, 10) === item.value}/>
          <label className="form-radio-label">{item.label}</label>
        </div>
      ))}
      {meta.touched && meta.error && <div className="form-input-error">{meta.error}</div>}
    </div>
  );
};
