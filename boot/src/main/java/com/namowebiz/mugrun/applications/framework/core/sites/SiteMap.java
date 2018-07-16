package com.namowebiz.mugrun.applications.framework.core.sites;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * POJO class containing sitemap.json information.
 * Created by NgocSon on 6/24/2016.
 */
public class SiteMap {
    @Getter @Setter
    private String type;

    @Getter @Setter
    private String pageId;

    @Getter @Setter
    private String pageName;

    @Getter @Setter
    private String url;

    @Getter @Setter
    private String pageTemplate;

    @Getter @Setter
    private boolean showPageMenu = true;

    @Getter @Setter
    private List<SiteMap> childMenus;
}
