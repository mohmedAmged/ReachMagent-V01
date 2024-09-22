import React from 'react'

export default function MySearchSec({filteration,setFilteration,placeholder}) {
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleChangeInput = e => setFilteration({...filteration,code: e.target.value});
    return (
        <div className="myFooter__search">
            <form onSubmit={handleSubmit}>
                <input value={filteration?.code} name='code' type="text"
                    placeholder={placeholder ? placeholder : 'Search'} onChange={handleChangeInput} />
                <button type='submit'>
                    <i className="bi bi-search"></i>
                </button>
            </form>
        </div>
    )
}
