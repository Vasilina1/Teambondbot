const getStatistics = (client, period, type) => {
  let text = '';
  if (period === 'today') {
    if (type === 'messages') {
      text = 'SELECT COUNT(*) FROM public.messages WHERE sent_at >= CURRENT_DATE';
    } else if (type === 'categories') {
      text = 'SELECT category, COUNT(*) FROM public.messages WHERE sent_at >= CURRENT_DATE GROUP BY category';
    } else if (type === 'orders') {
      text = 'SELECT user_id, COUNT(*) FROM public.messages WHERE sent_at >= CURRENT_DATE GROUP BY user_id';
    }
  } else if (period === 'allTime') {
    if (type === 'messages') {
      text = 'SELECT COUNT(*) FROM public.messages';
    } else if (type === 'categories') {
      text = 'SELECT category, COUNT(*) FROM public.messages GROUP BY category';
    } else if (type === 'orders') {
      text = 'SELECT user_id, COUNT(*) FROM public.messages GROUP BY user_id';
    }
  }
  const query = {
      text,
  };
  return client.query(query);
}

module.exports = getStatistics;
