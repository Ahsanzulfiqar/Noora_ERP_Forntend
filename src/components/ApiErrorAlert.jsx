export const extractApiErrorMessage = (error) => {
  if (!error) return '';

  if (Array.isArray(error?.data?.errors) && error.data.errors.length) {
    return error.data.errors.map((e) => e?.message).filter(Boolean).join('\n') || 'Something went wrong';
  }

  if (Array.isArray(error?.data?.data?.errors) && error.data.data.errors.length) {
    return error.data.data.errors.map((e) => e?.message).filter(Boolean).join('\n') || 'Something went wrong';
  }

  if (Array.isArray(error?.errors) && error.errors.length) {
    return error.errors.map((e) => e?.message).filter(Boolean).join('\n') || 'Something went wrong';
  }

  if (typeof error?.data === 'string' && error.data.trim()) return error.data;
  if (typeof error?.data?.message === 'string') return error.data.message;
  if (typeof error?.error === 'string') return error.error;
  if (typeof error?.message === 'string') return error.message;

  if (error?.status) {
    return `Request failed (${error.status})`;
  }

  return 'Something went wrong';
};
