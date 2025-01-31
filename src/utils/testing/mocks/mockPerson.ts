import { mockObject } from 'utils/testing/mocks';
import { ZetkinPerson } from 'types/zetkin';

const person: ZetkinPerson = {
  alt_phone: '',
  city: 'Berlin',
  co_address: '',
  country: 'Germany',
  email: 'clara@kpd.org',
  ext_id: '12',
  first_name: 'Clara',
  gender: 'f',
  id: 1,
  is_user: false,
  last_name: 'Zetkin',
  phone: '00497988281721',
  street_address: 'Kleine Alexanderstraße 28',
  zip_code: '10178',
};

const mockPerson = (overrides?: Partial<ZetkinPerson>): ZetkinPerson => {
  return mockObject(person, overrides);
};

export default mockPerson;

export { person };
