import React from 'react';

export default (field) => {
  const { meta } = field;

  return(
    <div className="form-item clearfix">
      <label className="form-input-label">{field.label}</label>
      <input type="file" className="form-input" multiple={false} onChange={(e) => field.fileSave(e, field.input.name)}/>
      {meta.touched && meta.error && <div className="form-input-error">{meta.error}</div>}
    </div>
  );
};
