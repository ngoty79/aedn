$(document).ready(function () {

    $('#btn-shop-list-search').click(function(e){
        e.preventDefault();
        var str = $("#searchProductKeywords").val();
        if (!str || 0 === str.length) {
            siteApp.alertMessage("검색어를 입력하세요");
            return false;
        }

        $('#form-shop-list-search').submit();
    });

    var pageSize = 40;
    var currentCategory;
    $(function () {
        $.ajax({
            url: '/site/module/shop/getRootProductCategory.json',
            type: 'POST',
            success: function (data) {
                var html = [];
                html.push('<option value="0" selected>전체보기</option>');
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<option value="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                }
                $('#mainCategory').html(html.join(''));
                var defaultHtml = [];
                defaultHtml.push('<option value="0" selected>전체보기</option>');
                $('#divisionCategory').html(defaultHtml.join(''));
                $('#subCategory').html(defaultHtml.join(''));
                loadProducts(1, "0");
                html = [];
                html.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<li><a href="javascript:void(0)" rel="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                }
                $('#mainCategorySelectList').html(html.join(''));
                defaultHtml = [];
                defaultHtml.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                $('#divisionCategorySelectList').html(defaultHtml.join(''));
                $('#subCategorySelectList').html(defaultHtml.join(''));
            },
            dataType: 'json'
        });


        $('#mainCategory').change(function () {

            var categoryNo = this.value;
            $('#mainCategorySelectList').find('li a').each(function () {
                if ($(this).attr('rel') == categoryNo) {
                    $(this).parent().parent().find('li a').removeClass('active');
                    $(this).addClass('active');
                }
            });


            if (this.value == "0") {
                var defaultHtml = [];
                defaultHtml.push('<option value="0" selected>전체보기</option>');
                $('#divisionCategory').html(defaultHtml.join(''));
                $('#subCategory').html(defaultHtml.join(''));
                defaultHtml = [];
                defaultHtml.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                $('#divisionCategorySelectList').html(defaultHtml.join(''));
                $('#subCategorySelectList').html(defaultHtml.join(''));
                loadProducts(1, "0");
                return;
            }

            $.ajax({
                url: '/site/module/shop/getProductCategoryByParent.json',
                type: 'POST',
                data: {parentNo: this.value },
                success: function (data) {
                    var html = [];
                    html.push('<option value="0" selected>전체보기</option>');
                    for (var i = 0; i < data.data.length; i++) {
                        html.push('<option value="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                    }
                    $('#divisionCategory').html(html.join(''));


                    html = [];
                    html.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                    for (var i = 0; i < data.data.length; i++) {
                        html.push('<li><a href="javascript:void(0)" rel="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                    }
                    $('#divisionCategorySelectList').html(html.join(''));
                    var defaultHtml = [];
                    defaultHtml.push('<option value="0" selected>전체보기</option>');
                    $('#subCategory').html(defaultHtml.join(''));
                    defaultHtml = [];
                    defaultHtml.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                    $('#subCategorySelectList').html(defaultHtml.join(''));
                },
                dataType: 'json'
            });

            loadProducts(1, this.value);
        });
        $('#divisionCategory').change(function () {
            var categoryNo = this.value;
            $('#divisionCategorySelectList').find('li a').each(function () {
                if ($(this).attr('rel') == categoryNo) {
                    $(this).parent().parent().find('li a').removeClass('active');
                    $(this).addClass('active');
                }
            });

            if (this.value == "0") {
                var defaultHtml = [];
                defaultHtml.push('<option value="0" selected>전체보기</option>');
                $('#subCategory').html(defaultHtml.join(''));
                defaultHtml = [];
                defaultHtml.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                $('#subCategorySelectList').html(defaultHtml.join(''));
                loadProducts(1, $('#mainCategory').val());
                return;
            }

            $.ajax({
                url: '/site/module/shop/getProductCategoryByParent.json',
                type: 'POST',
                data: {parentNo: this.value },
                success: function (data) {
                    var html = [];
                    html.push('<option value="0" selected>전체보기</option>');
                    for (var i = 0; i < data.data.length; i++) {
                        html.push('<option value="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                    }
                    $('#subCategory').html(html.join(''));

                    html = [];
                    html.push('<li><a href="javascript:void(0)" class="active" rel="0">전체보기</a></li>');
                    for (var i = 0; i < data.data.length; i++) {
                        html.push('<li><a href="javascript:void(0)" rel="' + data.data[i].categoryNo + '">' + data.data[i].categoryName + '</option>');
                    }
                    $('#subCategorySelectList').html(html.join(''));
                },
                dataType: 'json'
            });

            loadProducts(1, this.value);
        });

        $('#subCategory').change(function () {
            var categoryNo = this.value;
            $('#subCategorySelectList').find('li a').each(function () {
                if ($(this).attr('rel') == categoryNo) {
                    $(this).parent().parent().find('li a').removeClass('active');
                    $(this).addClass('active');
                }
            });

            if (this.value == "0") {
                if ($('#divisionCategory').val() != "0") {
                    loadProducts(1, $('#divisionCategory').val());
                }
                else {
                    loadProducts(1, $('#mainCategory').val());
                }
                return;
            }

            loadProducts(1, this.value);
        });

        $(document).on('click', '#category ul li a', function () {
            $(this).parent().parent().find('li a').removeClass('active');
            $(this).addClass('active');

            var categorySelector = $(this).parent().parent().attr('rel');
            $(categorySelector).val($(this).attr('rel'));
            $(categorySelector).change();
        });

        $(document).on('click', '#pageNavi a', function () {
            if ($(this).attr('rel') == "") return;

            loadProducts($(this).attr('rel'), currentCategory);
        });

        function loadProducts(pageIndex, categoryNo) {
            //clear search keyword
            $('#searchProductKeywords').val("");
            currentCategory = categoryNo;

            $.ajax({
                url: '/site/module/shop/searchProducts.json',
                type: 'POST',
                dataType: 'json',
                data: { categoryNo: currentCategory, page: pageIndex, size: pageSize },
                success: function (data) {
                    var html = [];
                    for (var i = 0; i < data.data.length; i++) {
                        html.push('<li>');
                        html.push('<div class="prPhoto"><a href="?scene=detail&productNo=' + data.data[i].productNo + '"><img src="' + (data.data[i].mainImage ? '/common/loadFile?relativePath=' + data.data[i].mainImage : _skinPath + '/images/common/item_list_ready.gif') + '" alt="' + data.data[i].productName + '" /></a></div>');
                        html.push('<p style="text-align:center;"><a href="?scene=detail&productNo=' + data.data[i].productNo + '">' + data.data[i].productName + '</a></p>');

                        if (data.data[i].soldoutShowYn == '1') {
                            html.push('<div style="text-align : center"><img src="' + _skinPath + '/images/common/icon_soldout_list.gif" alt="별첨" /></div>');
                            //html.push('<br/>');
                        }
                        else {
                            html.push('<br/>');
                        }
                        html.push('<div class="prPrice">');

                        if (data.data[i].marketPriceYn == 1) {
                            var marketPrice = 0;
                            if(data.data[i].marketPrice != null){
                                marketPrice = data.data[i].marketPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                            html.push('<span class="pastPrice">' + marketPrice + '원</span>');
                        }
                        var salePrice = 0;
                        if(data.data[i].salePrice != null){
                            salePrice = data.data[i].salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        html.push('<span class="currentPrice"><a href="#">' + salePrice + '원</a></span></div>');
                        html.push('</li>');
                    }


                    $('#itemList ul').html(html.join(''));

                    paginateProducts(pageIndex, pageSize, data.totalCount);
                    // Automatically adjust the module's height to avoid scrollbar
                    if(data.totalCount == 0){
                        $("#pageNavi").html("등록된 상품이 없습니다.");
                    }
                }
            });
        }

        function paginateProducts(page, limit, totalItems) {
            var html = [];
            page = parseInt(page, 10);
            if (totalItems > limit) {
                var totalPages = Math.floor(totalItems / limit) + (totalItems % limit > 0 ? 1 : 0);
                var startIndex = 0;
                var endIndex = totalPages;
                if (totalPages > 10) {
                    startIndex = page - 5;
                    endIndex = page + 5;
                    if (startIndex < 0) {
                        startIndex = 0;
                        endIndex = startIndex + 10;
                    }
                    if (endIndex > totalPages) {
                        endIndex = totalPages;
                        startIndex = totalPages - 10;
                    }
                }
                html.push('<a href="javascript:void()" class="btn" rel="1"><img src="' + _skinPath + '/images/common/pagenavi_arrow_prev2.gif" alt="1" /></a>');
                if (page == 1) {
                    html.push('<a href="javascript:void()" class="btn"><img src="' + _skinPath + '/images/common/pagenavi_arrow_prev1.gif" alt="" /></a>');
                } else {
                    html.push('<a href="javascript:void()" class="btn" rel="' + (page - 1) + '"><img src="' + _skinPath + '/images/common/pagenavi_arrow_prev1.gif" alt="' + (page + 1) + '" /></a>');
                }

                for (var j = startIndex; j < endIndex; j++) {
                    var k = j + 1;
                    if (page == k) {
                        html.push('<strong>' + k + '</strong>');
                    } else {
                        html.push('<a href="javascript:void()" rel="' + k + '">' + k + '</a>');
                    }
                }

                if (page == totalPages) {
                    html.push('<a href="javascript:void()" class="btn"><img src="' + _skinPath + '/images/common/pagenavi_arrow_next1.gif" alt="" /></a>');
                } else {
                    html.push('<a href="javascript:void()" class="btn" rel="' + (page + 1) + '"><img src="' + _skinPath + '/images/common/pagenavi_arrow_next1.gif" alt="' + (page + 1) + '" /></a>');
                }
                html.push('<a href="javascript:void()" class="btn" rel="' + totalPages + '"><img src="' + _skinPath + '/images/common/pagenavi_arrow_next2.gif" alt="' + totalPages + '" /></a>');
            }
            $('#pageNavi').html(html.join(''));
        }
    });
});