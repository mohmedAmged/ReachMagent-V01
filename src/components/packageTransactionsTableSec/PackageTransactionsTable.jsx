import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { usePackageTransactions } from '../../store/PackageCompanyTransactions';
import { useTranslation } from 'react-i18next';

export default function PackageTransactionsTable({loginType, token}) {
      const { t } = useTranslation();
        const {
            transactions,
            fetchCompanyTransactions,
        } = usePackageTransactions();
    useEffect(() => {
        fetchCompanyTransactions(loginType);
        }, [loginType, fetchCompanyTransactions]);
        console.log(transactions);
        
  return (
    <>
      <h3 className=' text-capitalize my-3 fs-5 fw-bold'>
                                {t('DashboardPackagesPage.transactionsTitle')}:
                            </h3>
                            <Table responsive>
                                <thead>
                                    <tr className='table__default__header'>
                                    <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadName')}</th>
                                    <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadPackageCode')}</th>

                                        <th className='text-center'>{t('DashboardPackagesPage.packageDetailstableHeadStartDate')}</th>
                                        
                                        <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadPaid')}</th>
                                        <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadPaymentMethod')}</th>
                                        <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadPaymentStatus')}</th>
                                        <th className='text-center'>{t('DashboardPackagesPage.transactionstableHeadAddedBy')}</th>
                                    </tr>
                                </thead>
                                            <tbody>
                                               {
                                                transactions?.map((el, idx)=>(
                                                     <tr key={idx}>
                                                        <td className='text-center py-3'>{el?.package}</td>
                                                        <td className='text-center py-3'>{el?.code}</td>

                                                        <td className='text-center py-3'>{el?.date}</td>
                                                        <td className='text-center py-3'>{el?.paid_amount}</td>
                                                        <td className='text-center py-3'>{el?.payment_method}</td>
                                                        <td className='text-center py-3'>{el?.payment_status}</td>
                                                        <td className='text-center py-3'>{el?.added_by}</td>
                                                     </tr>
                                                ))
                                               }

                                            </tbody>
                            </Table>
    </>
  )
}
