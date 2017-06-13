import React from 'react';

export default (field) => {
  const { meta } = field;

  return(
    <div className="form-item clearfix">
      <input type="file" className="form-input" multiple={false} onChange={field.fileSave} accept=".doc, .txt"/>
      {meta.touched && meta.error && <div className="form-input-error">{meta.error}</div>}
    </div>
  );
};
