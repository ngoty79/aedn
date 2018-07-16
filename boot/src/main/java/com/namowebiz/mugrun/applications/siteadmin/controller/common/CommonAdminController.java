package com.namowebiz.mugrun.applications.siteadmin.controller.common;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.common.Town;
import com.namowebiz.mugrun.applications.siteadmin.models.commoncode.CommonCodeVO;
import com.namowebiz.mugrun.applications.siteadmin.service.common.CodeService;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CommonsLog
@Controller
public class CommonAdminController {

    @Autowired
    private CodeService codeService;
    @Autowired
    private TownService townService;


    @RequestMapping(value = "/admin/common/getCodeByCodeGroup.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getCodeByCodeGroup(String codeGroup) {
        JsonResponse jsonResponse = new JsonResponse();
        List<CommonCodeVO> ls = codeService.getByCodeGroup(codeGroup);
        jsonResponse.setData(ls);
        return jsonResponse;
    }

    @RequestMapping(value = "/admin/town/index", method = RequestMethod.GET)
    public String townIndex(Map<String, Object> map, HttpServletRequest request) {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/town/index";
    }

    @RequestMapping(value = "/admin/town/list.json", method = RequestMethod.GET)
     @ResponseBody
     public PaginationList<Town> getUserList(String searchText, int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<Town> paging = new PaginationList<>(pageNumber, pageSize);

        List<Town> users = townService.list(params);
        Long count = townService.count(params);
        paging.setRows(users);
        paging.setTotal(count);

        return paging;
    }

    @RequestMapping(value = "/admin/town/addOrEdit.json", method = RequestMethod.POST)
    @ResponseBody
    public Object addOrEdit(Town modal, HttpServletRequest request) throws Exception {
        JsonResponse jsonResponse = new JsonResponse(false, modal);
        townService.addOrEdit(modal);
        jsonResponse.setSuccess(true);
        return jsonResponse;
    }

    @RequestMapping(value = "/admin/town/deleteSelected.json", method = RequestMethod.POST)
    @ResponseBody
    public Object deleteSelected(@RequestBody List<Long> townNoList, HttpServletRequest request) throws Exception {
        JsonResponse jsonResponse = new JsonResponse(false, null);
        townService.delete(townNoList);
        jsonResponse.setSuccess(true);
        return jsonResponse;
    }

}
