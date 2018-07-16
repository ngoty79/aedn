package com.namowebiz.mugrun.applications.framework.controllers;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.core.sites.SiteMap;
import com.namowebiz.mugrun.applications.framework.core.sites.SiteMapService;
import com.namowebiz.mugrun.applications.framework.exception.NotFoundException;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Temporary Index Controller
 * Created by ngo.ty on 26/5/2016.
 */
@Controller
@CommonsLog
public class IndexController {
    @Autowired
    private SiteMapService siteMapService;

    @RequestMapping("/")
    public String home(HttpServletRequest request) {
        String url = CommonConstants.ADMIN_INDEX_URL;
        return "redirect:" + url;
    }

    @RequestMapping("/admin")
    public String adminIndex(HttpServletRequest request, Map<String, Object> map) {
        String url = CommonConstants.ADMIN_INDEX_URL;

        return "redirect:" + url;
    }

    @RequestMapping("/instagram/login")
    public String index(HttpServletRequest request, Map<String, Object> map, String code) {
        String url = CommonConstants.ADMIN_INDEX_URL;
        try {
            this.getAccessToken(code);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "redirect:" + url;
    }

    private void getAccessToken(String code) throws IOException {
        String clientID = "5c847ad54c2742779e00fa438fe1ffe2";
        String clientSecret = "8c000b2de3ab4d4bb01459122be63c2d";
        String redirectUri = "http://phuquocfinance.com/instagram/login";

        String url = "https://api.instagram.com/oauth/access_token";

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("client_id", clientID));
        params.add(new BasicNameValuePair("client_secret", clientSecret));
        params.add(new BasicNameValuePair("grant_type", "authorization_code"));
        params.add(new BasicNameValuePair("redirect_uri", redirectUri));
        params.add(new BasicNameValuePair("code", code));
        httpPost.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse response = client.execute(httpPost);
        String responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
        client.close();

    }

    @RequestMapping({"/{symbolicName:[^.]*}", "/site/{symbolicName:[^.]*}"})
    public String page(Map<String, Object> map, @PathVariable String symbolicName, @RequestParam(required = false) String scene,
                       @RequestParam(required = false) String type,
                       HttpServletResponse response, HttpServletRequest request) throws Exception {
        String mappingUrl = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String fullSymbolicName = symbolicName;
        if (mappingUrl.contains("site")) {
            fullSymbolicName = "site/" + symbolicName;
        }
        log.debug("DYNAMIC PAGE URL : " + fullSymbolicName);
        String templatePath = siteMapService.getTemplatePathBySymbolicName(fullSymbolicName);

        if (templatePath != null) {
            List<SiteMap> siteMapMenu = siteMapService.getSiteMapMenu();
            map.put("siteMapMenu", siteMapMenu);

            List<SiteMap> siteMapDropdownMenu = siteMapService.getSiteMapDropdownMenu();
            map.put("siteMapDropdownMenu", siteMapDropdownMenu);

            String getFullUrl = "/" + symbolicName;
            if (mappingUrl.contains("site")) {
                getFullUrl = "/site" + getFullUrl;
            }
            if(scene != null) {
                getFullUrl += "?scene=" + scene;
            }
            if(type != null) {
                getFullUrl += "&type=" + type;
            }

            SiteMap parentPage = siteMapService.getPageFromURL(getFullUrl, true, mappingUrl);
            SiteMap page = siteMapService.getPageFromURL(getFullUrl, false, mappingUrl);

            SiteMap firstMenu = null;
            if (parentPage != null) {
                firstMenu = parentPage;
            } else if (page != null){
                firstMenu = page;
            }

            if(firstMenu != null) {
                int indexCurrentMenu = siteMapService.getIndexCurrentMenu(firstMenu.getPageId());
                map.put("currentFirstMenu", indexCurrentMenu);
//                log.info("type of show: " + firstMenu.isShowPageMenu());
                if(!firstMenu.isShowPageMenu()){
                    map.put("showFirstMenu", false);
                } else {
                    map.put("showFirstMenu", true);
                }

                List<SiteMap> childCurrentMenu = siteMapService.getChildCurrentMenu(firstMenu.getPageId());
                map.put("childCurrentMenu", childCurrentMenu);

                Map<String, String> urlParams = new HashMap<>();
                if (scene != null) {
                    urlParams.put("scene", scene);
                }
                if (type != null) {
                    urlParams.put("type", type);
                }
                int indexCurrentPage = siteMapService.getIndexCurrentPage(childCurrentMenu, page.getPageId(), urlParams);
                map.put("currentSecondPage", indexCurrentPage);
                if(page != null){
                    map.put("currentTitle", page.getPageName());
                }
                if(!page.isShowPageMenu()){
                    map.put("showSecondMenu", false);
                } else {
                    map.put("showSecondMenu", true);
                }
            }

            return templatePath;
        } else {
            throw new NotFoundException();
        }
    }

    @RequestMapping("/site/getChildMenu.json")
    @ResponseBody
    public JsonResponse getChildMenu(String menuId) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<SiteMap> childCurrentMenu = siteMapService.getChildCurrentMenu(menuId);
            jsonResponse.setData(childCurrentMenu);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }
}
