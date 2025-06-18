import i18next from 'i18next';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import egIcon from '../../assets/icons/egypt.svg'
import americaIcon from '../../assets/icons/america.svg'

export default function LanguageSelector() {
    const [isOpenLang, setIsOpenLang] = useState(false);
    const handleChange = () => setIsOpenLang(!isOpenLang);
    const changeLanguage = (lang, dir) => {
        i18next.changeLanguage(lang);
        document.documentElement.dir = dir;
        window.location.reload();
    };
  const { t } = useTranslation();
  return (
    <div className="position-relative">
        <button
            type="button"
            onClick={handleChange}
            className="d-inline-flex align-items-center fw-medium px-3 py-2 text-dark rounded btn btn-light"
        >
            <img
            src={t("lang")=== 'En' ? americaIcon : egIcon}
            alt="Language"
            className="object-fit-cover me-2"
            />
            {t("lang")}
        </button>

        {isOpenLang && (
            <div className="position-absolute start-0 top-100 bg-white shadow rounded z-3 mt-2">
            <ul className="py-2 small text-dark mb-0 list-unstyled">
                <li
                onClick={() => {
                    changeLanguage("en", "ltr");
                    setIsOpenLang(false);
                }}
                className="px-3 py-2 hover-bg-light cursor-pointer"
                style={{ cursor: "pointer" }}
                >
                <img
                style={{width:'15px', height:'15px'}}
                    src={americaIcon}
                    alt="English"
                    className="inline-block me-2"

                />
                English
                </li>
                <li
                onClick={() => {
                    changeLanguage("ar", "rtl");
                    setIsOpenLang(false);
                }}
                className="px-3 py-2 hover-bg-light cursor-pointer"
                style={{ cursor: "pointer" }}
                >
                <img
                style={{width:'15px', height:'15px'}}
                    src={egIcon}
                    alt="Arabic"
                    className="inline-block me-2"
                />
                العربية
                </li>
            </ul>
            </div>
        )}
    </div>

  )
}
