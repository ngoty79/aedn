package com.namowebiz.mugrun.applications.siteadmin.controller.plan;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 12/27/2018.
 */
@Controller
@CommonsLog
public class PlanController {
    @Autowired
    private UserService userService;


    @RequestMapping(value = "/admin/plan/index", method = RequestMethod.GET)
    public String payment(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        return "siteadmin/plan/index";
    }
}