export const getVisiblePageNumbers = (
  pageNumbers = [],
  currentPage,
  maxVisible = 5
) => {
  const totalPages = pageNumbers.length;

  if (totalPages === 0) return [];

  if (totalPages <= maxVisible) {
    return pageNumbers;
  }

  if (currentPage <= 3) {
    return [...pageNumbers.slice(0, 3), "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", ...pageNumbers.slice(totalPages - 3)];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const getPageNumbers = (totalItems, itemsPerPage) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};

export const getPaginatedData = (data, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return data.slice(indexOfFirstItem, indexOfLastItem);
};
