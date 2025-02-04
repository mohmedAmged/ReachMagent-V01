import React, { useEffect, useRef, useState } from "react";
import "./customeDropdownSelect.css";

const CustomDropdown = ({ countries, errors, setValue, inputName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const dropdownRef = useRef(null);

    const handleSelect = (country) => {
        setSelectedOption(country);
        setIsOpen(false);
        setValue(inputName, country?.phoneCode);
        setSearchTerm(""); 
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSearchCode = (searchValue) => {
        setSearchTerm(searchValue);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setFilteredCountries(
            searchTerm.trim() === ""
                ? countries // Reset to original countries if search term is empty
                : countries.filter((country) =>
                      country.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
        );
    }, [searchTerm, countries]);

    // useEffect(() => {
    //     if (isOpen) {
    //         setFilteredCountries(
    //             countries.filter((country) =>
    //                 country.name.toLowerCase().includes(searchTerm.toLowerCase())
    //             )
    //         );
    //     }
    // }, [isOpen, searchTerm, countries]);

    return (
        <div className="custom-dropdown position-relative" ref={dropdownRef}>
            {/* Selected Value */}
            <div
                className={`form-select d-flex align-items-center justify-content-between dropdown-toggle ${errors.phone_code ? "is-invalid" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div className="d-flex align-items-center">
                        <img src={selectedOption?.flag} alt="" className="dropdown-flag" />
                        {selectedOption?.name} ({selectedOption?.phoneCode})
                    </div>
                ) : (
                    "Select a country"
                )}
                {/* <i className="bi bi-chevron-down"></i> */}
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="dropdown-container">
                    {/* Search Box */}
                    <div className="dropdown-search">
                        <input
                            type="text"
                            placeholder="Search country"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => handleSearchCode(e.target.value)}
                            autoFocus // Ensures immediate focus for smooth experience
                        />
                    </div>
                    <ul className="dropdown-menu w-100 show">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <li
                                    key={country.phoneCode}
                                    className={`dropdown-item d-flex align-items-center ${selectedOption?.phoneCode === country.phoneCode ? "selected" : ""}`}
                                    onClick={() => handleSelect(country)}
                                >
                                    <img src={country.flag} alt="" className="dropdown-flag" />
                                    {country.name} ({country.phoneCode})
                                    {selectedOption?.phoneCode === country.phoneCode && (
                                        <i className="bi bi-check-circle checkmark"></i>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="dropdown-item text-muted">No results found</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Validation Error */}
            {errors.phone_code && <span className="text-danger">{errors?.phone_code.message}</span>}
        </div>
    );
};

export default CustomDropdown;

