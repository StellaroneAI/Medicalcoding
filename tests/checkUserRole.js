(async () => {
  const { checkUserRole } = await import('../context/roleUtils.js');
  const assert = (desc, cond) => {
    console.log(`${cond ? '✓' : '✗'} ${desc}`);
  };

  assert('returns false when user is null', checkUserRole(null, ['admin']) === false);
  assert('returns false when user has no roles', checkUserRole({ claims: {} }, ['admin']) === false);
  assert('returns true when required role present', checkUserRole({ claims: { roles: ['admin'] } }, ['admin']) === true);
})();
