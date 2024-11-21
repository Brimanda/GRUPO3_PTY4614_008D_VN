import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const { amount, sessionId, buyOrder, returnUrl } = await request.json()

  try {
    const response = await axios.post(
      'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions',
      {
        buy_order: buyOrder,
        session_id: sessionId,
        amount,
        return_url: returnUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': '597055555532',
          'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Transaction error' }, { status: 500 })
  }
}
