jest.unmock('../src/logout');
import logout from '../src/logout';

describe('logout', () => {
  it('exists', () => {
    expect(logout)
      .not.toEqual({});
  });
});
