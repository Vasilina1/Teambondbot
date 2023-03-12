const getBlacklistedUsers = (client) => {
  const query = {
      text: 'SELECT * FROM public.users WHERE is_blacklisted = true'
  };
  return client.query(query);
}

module.exports = getBlacklistedUsers;
