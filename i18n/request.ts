import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = (store.get('NEXT_LOCALE')?.value ?? 'el') as 'en' | 'el';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});