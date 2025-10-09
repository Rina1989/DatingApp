using System;

namespace API.Helpers;

public class PagingParam
{
    private const int MaxPageSize = 50;
    public int pageNumber { get; set; }
    private int pageSize = 10;
    public int PageSize
    {
        get => pageSize;
        set => pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}
