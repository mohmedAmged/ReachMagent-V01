import React from "react";
import Select from "react-select";

const CustomDropdown = ({ countries, errors, setValue, inputName }) => {
    console.log(countries);
    
    // Format data for react-select
    const options = countries.map((country) => ({
        value: country.phoneCode,
        label: `${country.name} (${country.phoneCode})`,
        flag: country.flag, // Store flag for custom display
    }));

    const handleChange = (selectedOption) => {
        setValue(inputName, selectedOption.value);
    };

    // Custom option rendering (adds country flag)
    const customSingleValue = ({ data }) => (
        <div className="">
            <img src={data.flag} alt={data.label} className="dropdown-flag" style={{ width: 20, marginRight: 10 }} />
            {data.label}
        </div>
    );

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
                <img src={data.flag} alt={data.label} className="dropdown-flag" style={{ width: 20, marginRight: 10 }} />
                {data.label}
            </div>
        );
    };

    return (
        <div>
            <Select
            
                options={options}
                onChange={handleChange}
                placeholder="Select a country"
                className={errors.phone_code ? "is-invalid" : ""}
                getOptionLabel={(e) => (
                    <div className="d-flex align-items-center">
                        <img src={e.flag} alt={e.label} className="dropdown-flag" style={{ width: 20, marginRight: 10 }} />
                        {e.label}
                    </div>
                )}
                components={{ SingleValue: customSingleValue, Option: customOption,  }} // Custom rendering
                filterOption={(option, inputValue) =>
                    option.data.label.toLowerCase().includes(inputValue.toLowerCase()) // 🔥 Filters by country name
                }
            />
            {errors.phone_code && <span className="text-danger">{errors?.phone_code.message}</span>}
        </div>
    );
};

export default CustomDropdown;
