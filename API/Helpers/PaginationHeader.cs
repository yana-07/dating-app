namespace API.Helpers
{
    public class PaginationHeader(int currPage,
        int itemsPerPage, int totalItems, int totalPages)
    {
        public int CurrentPage { get; set; } = currPage;

        public int ItemsPerPage { get; set; } = itemsPerPage;

        public int TotalItems { get; set; } = totalItems;
        
        public int TotalPages { get; set; } = totalPages;
    }
}
