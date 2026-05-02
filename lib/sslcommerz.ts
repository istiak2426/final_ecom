import axios from 'axios'

const store_id = process.env.SSL_STORE_ID!
const store_passwd = process.env.SSL_STORE_PASSWORD!
const isSandbox = process.env.SSL_IS_SANDBOX === 'true'
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

export async function initSSLCommerzPayment(orderData: {
  total_amount: number
  currency: string
  tran_id: string
  success_url: string
  fail_url: string
  cancel_url: string
  cus_name: string
  cus_email: string
  cus_phone: string
  cus_add1: string
}) {
  const data = {
    store_id,
    store_passwd,
    total_amount: orderData.total_amount,
    currency: orderData.currency || 'BDT',
    tran_id: orderData.tran_id,
    success_url: orderData.success_url,
    fail_url: orderData.fail_url,
    cancel_url: orderData.cancel_url,
    cus_name: orderData.cus_name,
    cus_email: orderData.cus_email,
    cus_phone: orderData.cus_phone,
    cus_add1: orderData.cus_add1,
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    product_name: 'E-commerce Order',
    product_category: 'General',
    product_profile: 'general',
  }

  const endpoint = isSandbox
    ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://secure.sslcommerz.com/gwprocess/v4/api.php'

  const response = await axios.post(endpoint, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  return response.data
}