package com.namowebiz.mugrun.applications.siteadmin.controller.mail;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.mail.MailTemplate;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.service.mail.MailTemplateService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by datnguyen on 6/24/2016.
 */
@Controller
@RequestMapping("/admin/mail")
@CommonsLog
public class MailTemplateManagementController {

    @Autowired
    private MailTemplateService mailTemplateService;

    @Autowired
    private ApplicationContext context;

    @RequestMapping("/signup/index")
    public String signup(Map<String, Object> map) {
        map.put("templateType", CommonConstants.MAIL_TEMPLATE_SIGNUP);

        return "siteadmin/mail/signup";
    }

    @RequestMapping("signupclose/index")
    public String signupClose(Map<String, Object> map) {
        map.put("templateType", CommonConstants.MAIL_TEMPLATE_SIGNUP_CLOSE);

        return "siteadmin/mail/signup_close";
    }

    @RequestMapping("/findid/index")
    public String findId(Map<String, Object> map) {
        map.put("templateType", CommonConstants.MAIL_TEMPLATE_FIND_ID);

        return "siteadmin/mail/find_id";
    }

    @RequestMapping("/findpass/index")
    public String findPass(Map<String, Object> map) {
        map.put("templateType", CommonConstants.MAIL_TEMPLATE_FIND_PASSWORD);

        return "siteadmin/mail/find_password";
    }

    @RequestMapping("/sms/index")
    public String sms(Map<String, Object> map) {
        map.put("templateType", CommonConstants.MAIL_TEMPLATE_SMS);

        return "siteadmin/mail/sms";
    }

    @RequestMapping(value = "/signup/loadMailTemplate.json")
    @ResponseBody
    public JsonResponse loadMailTemplateData(String templateType) {
        JsonResponse jsonResponse = new JsonResponse();
        MailTemplate template = mailTemplateService.getByTemplateType(templateType);
        if(template == null) {
            if(CommonConstants.MAIL_TEMPLATE_SMS.equals(templateType)) {
                Map<String, String> defaultValue = getMailTemplateDefaultValue(templateType);
                template = new MailTemplate();
                template.setTemplateContent(defaultValue.get("content"));
                template.setTemplateType(templateType);
                template.setSenderEmail(context.getMessage("mail.sender.phoneNo", null, LocaleContextHolder.getLocale()));
                template.setUseYn(1);
            }else{
                Map<String, String> defaultValue = getMailTemplateDefaultValue(templateType);
                template = new MailTemplate();
                template.setTemplateTitle(defaultValue.get("subject"));
                template.setTemplateContent(defaultValue.get("content"));
                template.setTemplateType(templateType);
                template.setSenderEmail(context.getMessage("mail.sender.email", null, LocaleContextHolder.getLocale()));
                template.setUseYn(1);
            }
        }
        jsonResponse.setData(template);

        return jsonResponse;
    }

    private Map<String, String> getMailTemplateDefaultValue(String templateType) {
        Map<String, String> rs = new HashMap<>();
        if(CommonConstants.MAIL_TEMPLATE_SIGNUP.equals(templateType)) {
            rs.put("subject", context.getMessage("mail.verificationMailTitle", null, LocaleContextHolder.getLocale()));
            rs.put("content", context.getMessage("mail.verificationMailContent", null, LocaleContextHolder.getLocale()));
        }else if(CommonConstants.MAIL_TEMPLATE_SIGNUP_CLOSE.equals(templateType)) {
            rs.put("subject", context.getMessage("mail.completeMailTitle", null, LocaleContextHolder.getLocale()));
            rs.put("content", context.getMessage("mail.completeMailContent", null, LocaleContextHolder.getLocale()));
        }else if(CommonConstants.MAIL_TEMPLATE_FIND_ID.equals(templateType)) {
            rs.put("subject", context.getMessage("mail.findidMailTitle", null, LocaleContextHolder.getLocale()));
            rs.put("content", context.getMessage("mail.findIdMailContent", null, LocaleContextHolder.getLocale()));
        }else if(CommonConstants.MAIL_TEMPLATE_FIND_PASSWORD.equals(templateType)) {
            rs.put("subject", context.getMessage("mail.findpwMailTitle", null, LocaleContextHolder.getLocale()));
            rs.put("content", context.getMessage("mail.findpwMailContent", null, LocaleContextHolder.getLocale()));
        }else if(CommonConstants.MAIL_TEMPLATE_SMS.equals(templateType)) {
            rs.put("content", context.getMessage("mail.smsContentTemplate", null, LocaleContextHolder.getLocale()));
        }
        return rs;
    }

    @RequestMapping(value = "/signup/submitMailTemplate.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse submitComposeForm(@RequestBody MailTemplate mailTemplate) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(mailTemplate != null) {
                UserVO loginUser = RequestUtil.getLoginUserInfo();
                mailTemplateService.save(mailTemplate, loginUser);
                jsonResponse.setSuccess(true);
            }else{
                jsonResponse.setSuccess(false);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }

}
