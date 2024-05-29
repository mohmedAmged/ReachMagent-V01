import React from 'react'
import QuotationStateSec from '../../components/quotationsStateSec/QuotationStateSec'
import QuotationTableSec from '../../components/quotationTableSec/QuotationTableSec'

export default function MyQutations() {
  return (
    <div className='myQuotations__handler '>
      <QuotationStateSec />
      <QuotationTableSec />
    </div>
  )
}
