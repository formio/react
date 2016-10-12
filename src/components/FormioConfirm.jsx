import React from 'react';

export default function ({ message, buttons}) {
  const buttonElements = buttons.map((button, index) => {
    return (
      <span key={index} onClick={button.callback} className={button.class}>{ button.text }</span>
    )
  });
  return (
    <form role="form">
      <h3>{ message }</h3>
      <div className="btn-toolbar">
        {buttonElements}
      </div>
    </form>
  );
}