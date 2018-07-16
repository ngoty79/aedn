package com.namowebiz.mugrun.applications.framework.core.sites;

import com.namowebiz.mugrun.applications.framework.configuration.ApplicationConfiguration;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

/**
 * Service to handle process related to sitemap.json
 * Created by NgocSon on 6/24/2016.
 */
@CommonsLog
@Service
public class SiteMapService {
    private static final String SITEMAP_JSON_PATH = "config/sitemap.json";
    @Autowired
    private ApplicationConfiguration applicationConfiguration;

    @Getter
    private List<SiteMap> siteMapList;

    @Getter @Setter
    private List<SiteMap> siteMapMenu;

    @Getter @Setter
    private List<SiteMap> siteMapDropdownMenu;

    @PostConstruct
    public void init() {
        initSiteMapList();
        log.info("SiteMapService is initialized!");
        log.info("Found " + siteMapList.size() + " site maps defined in "
                + applicationConfiguration.getSiteBasePath() + SITEMAP_JSON_PATH);
    }

    /**
     * Get the external template path of a url symbolic name.
     * The "/site/" value will be removed from the external template path.
     *
     * @param symbolicName the value of url path symbolic name
     * @return the SiteMap model associated with symbolic name. If none is found, return null
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    public String getTemplatePathBySymbolicName(String symbolicName)
            throws InvocationTargetException, IllegalAccessException {
        if (StringUtils.isNotEmpty(symbolicName)) {
            String sName = "/" + symbolicName;
            for (SiteMap siteMap : siteMapList)
                if (isExistOnMultipleUrlMenu(sName, siteMap.getUrl())) {
                    return siteMap.getPageTemplate();
                }
        }
        return null;
    }

    /**
     * Initialize the SiteMap list.
     * This method puts all the site maps defined in {siteBasePath}/config/sitemap.json for
     * further usage.
     */
    private void initSiteMapList() {
        siteMapList = new ArrayList<>();
        siteMapMenu = new ArrayList<>();
        siteMapDropdownMenu  = new ArrayList<>();

        JSONParser jsonParser = new JSONParser();
        InputStreamReader isr = null;
        FileInputStream fis = null;

        try {
            fis = new FileInputStream(applicationConfiguration.getSiteBasePath() + SITEMAP_JSON_PATH);
            isr = new InputStreamReader(fis, "UTF-8");
            Object obj = jsonParser.parse(isr);
            JSONObject jsonObject = (JSONObject) obj;

            JSONArray childMap = (JSONArray) jsonObject.get("map");
            if (childMap != null && childMap.size() > 0) {
                siteMapList.addAll(getAllChildSiteMaps(childMap));
                siteMapMenu.addAll(getAllMenu(childMap, false));
                siteMapDropdownMenu.addAll(getAllMenu(childMap, true));
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }
            if (isr != null) {
                try {
                    isr.close();
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }

        }
    }

    /**
     * Get all the child site maps of a site map.
     * @param mapArray
     * @return
     */
    private List<SiteMap> getAllChildSiteMaps(JSONArray mapArray) {
        List<SiteMap> list = new ArrayList<>();

        Iterator<Object> iterator = mapArray.iterator();
        while (iterator.hasNext()) {
            JSONObject jsonObject = (JSONObject)iterator.next();
            list.add(parseJsonToSiteMap(jsonObject));
            if (jsonObject.containsKey("map")) {
                JSONArray myChildMap = (JSONArray) jsonObject.get("map");
                if (myChildMap != null && myChildMap.size() > 0) {
                    list.addAll(getAllChildSiteMaps(myChildMap));
                }
            }
        }

        return list;
    }

    /**
     * Parse a json object to SiteMap.
     * @param jsonObject the JSONObject containing site map info
     * @return the SiteMap object associated with JSONObject
     */
    private SiteMap parseJsonToSiteMap(JSONObject jsonObject) {
        SiteMap siteMap = new SiteMap();

        siteMap.setType((String) jsonObject.get("type"));
        siteMap.setPageId((String) jsonObject.get("pageId"));
        siteMap.setPageName((String) jsonObject.get("pageName"));
        if (jsonObject.containsKey("url")) {
            siteMap.setUrl((String) jsonObject.get("url"));
        }
        if (jsonObject.containsKey("pageTemplate"))
        siteMap.setPageTemplate((String) jsonObject.get("pageTemplate"));

        if (jsonObject.containsKey("showPageMenu"))
            siteMap.setShowPageMenu(Boolean.valueOf(jsonObject.get("showPageMenu").toString()));

        return siteMap;
    }

    /**
     * Get all the child site maps of a site map.
     * @param mapArray
     * @return
     */
    private List<SiteMap> getAllMenu(JSONArray mapArray, boolean isGetHiddenType) {
        List<SiteMap> list = new ArrayList<>();

        Iterator<Object> iterator = mapArray.iterator();
        while (iterator.hasNext()) {
            List<SiteMap> childMenus = new ArrayList<>();

            JSONObject jsonObject = (JSONObject)iterator.next();

            if (jsonObject.containsKey("map")) {
                JSONArray myChildMap = (JSONArray) jsonObject.get("map");
                if (myChildMap != null && myChildMap.size() > 0) {
                    childMenus = getAllChildMenu(myChildMap, isGetHiddenType);
                }
            }

            SiteMap siteMap = parseJsonToSiteMap(jsonObject);
            siteMap.setChildMenus(childMenus);

            if(isGetHiddenType){
                list.add(siteMap);
            } else if (!"hidden".equals(siteMap.getType())) {
                list.add(siteMap);
            }
        }

        return list;
    }

    /**
     * Get all the child site maps of a site map.
     * @param mapArray
     * @return
     */
    private List<SiteMap> getAllChildMenu(JSONArray mapArray, boolean isGetHiddenType) {
        List<SiteMap> list = new ArrayList<>();

        Iterator<Object> iterator = mapArray.iterator();
        while (iterator.hasNext()) {
            List<SiteMap> childMenus = new ArrayList<>();

            JSONObject jsonObject = (JSONObject)iterator.next();

            if (jsonObject.containsKey("map")) {
                JSONArray myChildMap = (JSONArray) jsonObject.get("map");
                if (myChildMap != null && myChildMap.size() > 0) {
                    childMenus = getAllChildMenu(myChildMap, isGetHiddenType);
                }
            }

            SiteMap siteMap = parseJsonToSiteMap(jsonObject);
            siteMap.setChildMenus(childMenus);

            if(isGetHiddenType){
                list.add(siteMap);
            } else if (!"hidden".equals(siteMap.getType())) {
                list.add(siteMap);
            }
        }

        return list;
    }

    public SiteMap getPageFromURL(String url, boolean getParent, String mappingUrl){
        for(int i = 0; i < siteMapDropdownMenu.size(); i++){
            SiteMap menu = siteMapDropdownMenu.get(i);
            if(isExistOnMultipleUrlMenu(url, menu.getUrl())){
                if(getParent){
                    return null;
                } else {
                    return menu;
                }
            }
            List<SiteMap> pages = menu.getChildMenus();
            for(int j = 0; j < pages.size(); j++){
                SiteMap page = pages.get(j);
                if(isExistOnMultipleUrlMenu(url, page.getUrl())){
                    if(getParent){
                        return menu;
                    } else {
                        return page;
                    }
                }
            }

        }

        // if don't find any exactly menu with param from url
        // will get parent of menu
        for(int i = 0; i < siteMapDropdownMenu.size(); i++){
            SiteMap menu = siteMapDropdownMenu.get(i);
            if(isExistOnMultipleUrlMenu(mappingUrl, menu.getUrl())){
                if(getParent){
                    return null;
                } else {
                    return menu;
                }
            }
            List<SiteMap> pages = menu.getChildMenus();
            for(int j = 0; j < pages.size(); j++){
                SiteMap page = pages.get(j);
                if(isExistOnMultipleUrlMenu(mappingUrl, page.getUrl())){
                    if(getParent){
                        return menu;
                    } else {
                        return page;
                    }
                }
            }

        }
        return null;
    }

    private boolean isExistOnMultipleUrlMenu(String url, String urlMenu){
        if(urlMenu != null) {
            String[] arrUrl = urlMenu.split(",");
            for (int i = 0; i < arrUrl.length; i++) {
                String temp = arrUrl[i];
                if (temp.trim().equals(url.trim())) {
                    log.info("exist url in sitemap: " + temp);
                    return true;
                }
            }
        }
        return false;
    }

    public int getIndexCurrentMenu(String menuId){
        for(int i = 0; i < siteMapDropdownMenu.size(); i++){
            SiteMap menu = siteMapDropdownMenu.get(i);
            if(menuId.equals(menu.getPageId())){
                return i;
            }
        }
        return 0;
    }

    /**
     *  Get current page base on pageId and url params
     * @param child
     * @param pageId
     * @param urlParams
     * @return
     */
    public int getIndexCurrentPage(List<SiteMap> child, String pageId, Map<String, String> urlParams){
        for(int i = 0; i < child.size(); i++){
            SiteMap menu = child.get(i);
            if(pageId.equals(menu.getPageId())){
                if(!urlParams.isEmpty()){
                    String urls = menu.getUrl();
                    if(urls != null) {
                        // multiple url
                        String[] arrUrl = urls.split(",");
                        for (int k = 0; k < arrUrl.length; k++) {
                            String url = arrUrl[k];
                            // multiple param of url
                            String[] arr = url.split("\\?");
                            if (arr.length > 1) {
                                String[] params = arr[1].split("&");
                                Map<String, String> configParams = new HashMap<>();
                                for (int j = 0; j < params.length; j++) {
                                    String keyValue = params[j];
                                    String[] arrKeyValue = keyValue.split("=");
                                    configParams.put(arrKeyValue[0], arrKeyValue[1]);
                                }
                                if (configParams.equals(urlParams)) {
                                    return i;
                                }
                            }
                        }
                    }
                } else {
                    return i;
                }
            }
        }

        // if don't find any exactly menu with param from url
        // will get parent of menu
        for(int i = 0; i < child.size(); i++){
            SiteMap menu = child.get(i);
            if(pageId.equals(menu.getPageId())){
                return i;
            }
        }
        return 0;
    }

    public List<SiteMap> getChildCurrentMenu(String menuId){
        List<SiteMap> child = new ArrayList<>();
        for(int i = 0; i < siteMapDropdownMenu.size(); i++){
            SiteMap menu = siteMapDropdownMenu.get(i);
            if(menuId.equals(menu.getPageId())){
                return menu.getChildMenus();
            }
        }
        return child;
    }

}
