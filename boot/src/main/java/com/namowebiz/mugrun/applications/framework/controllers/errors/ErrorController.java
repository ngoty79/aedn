package com.namowebiz.mugrun.applications.framework.controllers.errors;

import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller class for error pages
 * Created by NgocSon on 11/24/2015.
 */
@CommonsLog
@Controller
@RequestMapping("/error/")
public class ErrorController {
    @RequestMapping("401")
    public String error401(){
        return "mugrun/errors/401";
    }

    @RequestMapping("403")
    public String error403(){
        return "mugrun/errors/403";
    }

    @RequestMapping("404")
    public String error404(){
        return "mugrun/errors/404";
    }

    @RequestMapping("500")
    public String error500(){
        return "mugrun/errors/500";
    }
}
