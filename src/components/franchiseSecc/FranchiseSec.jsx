import React from 'react';
import './franchiseSec.css';

export default function FranchiseSec({pageName,headText,paraText,btnOneText,btnTwoText}) {
    return (
        <div className={`franchiseSec__handler`}>
            <div className="container">
                <div className={`${pageName === 'home' ? 'franchiseSec__content' : 'franchiseSec__content franchiseSec__content-two overlay20' } text-center`}>
                    <h3>
                        {headText ? headText : ''}
                    </h3>
                    <p>
                        {paraText ? paraText : ''}
                    </p>
                    <div className="franchise__actions">
                        {
                            btnOneText ?
                            <button>
                                {btnOneText}
                            </button>
                            :
                            ''
                        }
                        {
                            btnTwoText ?
                            <button>
                                {btnTwoText}
                            </button>
                            :
                            ''
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
