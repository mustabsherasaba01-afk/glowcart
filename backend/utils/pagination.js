const paginate = (items, page = 1, limit = 10) => {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    totalItems,
  };
};

module.exports = paginate;
