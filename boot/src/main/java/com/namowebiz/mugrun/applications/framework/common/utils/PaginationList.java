package com.namowebiz.mugrun.applications.framework.common.utils;

import java.util.ArrayList;
import java.util.List;

public class PaginationList<E>{
    public static final int MAX_PAGE_SIZE = 1000;
    public static final int PAGE_SIZE = 10;
    private int pageSize = PAGE_SIZE;
    private int totalPages = 1;
    private long total = 0L;
    private int page = 1;
    private int beginPage = this.page;
    private int endPage = this.totalPages;
    private String search;
    private List<String> searchFields;
    private List<E> rows = new ArrayList();
    private List<E> data = new ArrayList();

    public PaginationList() {}

    public PaginationList(int page, int pageSize)
    {
        if (page > 0) {
            this.page = page;
        }
        if (pageSize > 0) {
            this.pageSize = pageSize;
        }
    }

    public int getPage()
    {
        return this.page;
    }

    public int getPrevPage()
    {
        return this.page > 1 ? this.page - 1 : 1;
    }

    public int getNextPage()
    {
        return this.page < this.totalPages ? this.page + 1 : this.totalPages;
    }

    public int getTotalPages()
    {
        return this.totalPages;
    }

    public long getTotal()
    {
        return this.total;
    }

    public void setTotal(long total)
    {
        if (total < 1L) {
            return;
        }
        this.total = total;
        this.totalPages = ((int)((total - 1L) / this.pageSize + 1L));
        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
        this.beginPage = this.page - 2;
        this.endPage = this.page + 2;
        if (this.beginPage < 1) {
            while (this.beginPage < 1 && this.endPage < this.totalPages)
            {
                this.beginPage += 1;
                this.endPage += 1;
            }
        }
        if (this.endPage > this.totalPages) {
            while (this.endPage > this.totalPages && this.beginPage > 1)
            {
                this.beginPage -= 1;
                this.endPage -= 1;
            }
        }
        if (this.beginPage < 1) {
            this.beginPage = 1;
        }
        if (this.endPage > this.totalPages) {
            this.endPage = this.totalPages;
        }
    }

    public int getPageSize()
    {
        return this.pageSize;
    }

    public long getStart()
    {
        return (this.page - 1) * this.pageSize;
    }

    public int getFirstPage()
    {
        return 1;
    }

    public int getLastPage()
    {
        return this.totalPages;
    }

    public int getBeginPage()
    {
        return this.beginPage;
    }

    public int getEndPage()
    {
        return this.endPage;
    }

    public long getFromRecord()
    {
        if (this.total < 1L) {
            return 0L;
        }
        return (this.page - 1) * this.pageSize + 1;
    }

    public long getToRecord()
    {
        long toRecord = this.page * this.pageSize;
        if (this.total < toRecord) {
            toRecord = this.total;
        }
        return toRecord;
    }

    public List<E> getRows(){
        return this.rows;
    }



    public void setRows(List<E> data)
    {
        this.rows = data;
    }

    public List<E> getData(){
        return this.data;
    }

    public void setData(List<E> data){
        this.data = data;
    }

    public String getSearch()
    {
        return this.search;
    }

    public void setSearch(String search)
    {
        this.search = search;
    }

    public List<String> getSearchFields()
    {
        return this.searchFields;
    }

    public void setSearchFields(List<String> searchFields)
    {
        this.searchFields = searchFields;
    }

    public void setPageSize(int pageSize)
    {
        this.pageSize = pageSize;
    }

    public void setPage(int page)
    {
        this.page = page;
    }

    public long getLogicalIndexAsc(long position) {
        return getFromRecord() + position;
    }

    public long getLogicalIndexDesc(long position) {
        return this.total - (this.page - 1) * this.pageSize - position;
    }
}
