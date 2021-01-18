import React from 'react';

export default function ErrorNotice(props) {
    return <div className="error-notice">
        <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'space-between'}}>
            {props.message}
            <button onClick={props.clearError}>X</button>
        </div>
    </div>
}