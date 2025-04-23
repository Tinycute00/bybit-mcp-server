export function validateParams(params: any) {
  if (!params) throw new Error('Parameters are required');
  if (!params.category) throw new Error('Category is required');
  if (!params.symbol) throw new Error('Symbol is required');
  return true;
}

export function formatResponse(data: any) {
  return {
    success: true,
    data: data
  };
}

export function handleError(error: any) {
  return {
    success: false,
    error: error.message || 'Unknown error occurred'
  };
}
