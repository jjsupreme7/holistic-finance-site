type SupabaseResult<T> = {
  data: T;
  error: {
    code?: string;
    message: string;
  } | null;
};

export function assertNoSupabaseError<T>(result: SupabaseResult<T>): T {
  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export function assertSupabaseRecord<T>(
  result: SupabaseResult<T>,
  message = "Expected a database record but none was returned."
): NonNullable<T> {
  if (result.error) {
    throw result.error;
  }

  if (result.data == null) {
    throw new Error(message);
  }

  return result.data as NonNullable<T>;
}
