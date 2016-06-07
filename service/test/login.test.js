jest.unmock('../src/login');
import login from '../src/login';

describe('login', () => {
  it('exists', () => {
    expect(login)
      .not.toEqual({});
  });

  it('performs login an existing user', () => {

  });
});
