const API_BASE_URL = process.env.NEXT_PUBLIC_SB_BACK_OFFICE_BASE_URL || 'http://localhost:3000/api';

export const config = {

  sb_backOfficeBaseUrl: API_BASE_URL,
  sb_backOfficeApiUrl: `${API_BASE_URL}/v1`,

}