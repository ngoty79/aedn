package com.namowebiz.mugrun.applications.framework.controllers.authentication;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * Controller class for handling authentication requests.
 */
@Controller
public class UserAuthenticationController {
    @RequestMapping(value = "/admin/login", method = RequestMethod.GET)
    public ModelAndView adminLogin(Model model, HttpServletRequest request) {
        return new ModelAndView("siteadmin/login/admin_login");
    }
}
