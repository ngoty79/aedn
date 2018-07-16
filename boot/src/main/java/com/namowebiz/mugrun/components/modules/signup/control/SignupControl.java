package com.namowebiz.mugrun.components.modules.signup.control;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.framework.services.component.control.AbstractComponentControl;
import com.namowebiz.mugrun.applications.framework.services.component.data.ComponentResultModel;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.common.utils.ConversionUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.mail.MailTemplate;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.service.mail.MailSenderService;
import com.namowebiz.mugrun.applications.siteadmin.service.mail.MailTemplateService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import com.namowebiz.mugrun.components.modules.signup.models.MemeberJoinStep;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignup;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignupProvision;
import com.namowebiz.mugrun.components.modules.signup.service.ModuleSignupProvisionService;
import com.namowebiz.mugrun.components.modules.signup.service.ModuleSignupService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */

@Component
@CommonsLog
public class SignupControl extends AbstractComponentControl{

    private static final String USER_AGREEMENT_SCENE = "userAgreement";
    private static final String VERIFICATION_SCENE = "identityVerification";
    private static final String ENTER_INFO_SCENE = "memberInfo";
    private static final String COMPLETE_SCENE = "joinComplete";

    @Autowired
    private ModuleSignupService moduleSignupService;

    @Autowired
    private ModuleSignupProvisionService moduleSignupProvisionService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModuleSignupProvisionService signupProvisionService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private MailTemplateService mailTemplateService;

    @Autowired
    private MailSenderService mailSenderService;

    private Map<String, Object> memberJoinStep;


    @Override
    public String getScene(HttpServletRequest request){
        String scene;
        ModuleSignup moduleSignup = getModuleSignup(request);
        getMemberJoinStep(moduleSignup);
        if((Boolean)memberJoinStep.get(USER_AGREEMENT_SCENE)) {
            scene = USER_AGREEMENT_SCENE;
        } else if((Boolean)memberJoinStep.get(VERIFICATION_SCENE)) {
            scene = VERIFICATION_SCENE;
        } else {
            scene = ENTER_INFO_SCENE;
        }
        String sceneName = request.getParameter("scene");
        if (jodd.util.StringUtil.isNotBlank(sceneName)) {
            scene = sceneName;
        }
        return scene;
    }

    @Override
    public ComponentResultModel doControl(HttpServletRequest request, HttpServletResponse response,
                                          Map<String, Object> componentConfig) {

        String methodName = "";
        ComponentResultModel componentResultModel = new ComponentResultModel();
        Map<String, Object> resultMap = new HashMap<>();

        Long moduleNo = getModuleSignup(request).getModuleNo();

        resultMap.put("config", componentConfig);

        UserVO loginUer = RequestUtil.getUserInfoInSession(request);
        Long userNo = loginUer==null? null:loginUer.getUserNo();

        try {
            ModuleSignup moduleSignup = getModuleSignup(request);
            getMemberJoinStep(moduleSignup);

            if(componentConfig.containsKey("memberJoinSteps")){
                String strMemberJoinSteps = (String)componentConfig.get("memberJoinSteps");
                List<Map<String, Object>> menuList= new ArrayList<>();

                if(!StringUtil.isEmpty(strMemberJoinSteps)){
                    menuList = (List<Map<String, Object>>)JsonUtil.parseJSON(strMemberJoinSteps, List.class);
                }

                resultMap.put("menuList", menuList);
            }

            resultMap.put("memberJoinStep", memberJoinStep);

            methodName = getScene(request);

            String prevScene = getPrevScene(memberJoinStep, methodName);
            String nextScene = getNextScene(memberJoinStep, methodName);

            resultMap.put("nextScene", nextScene);
            resultMap.put("prevScene", prevScene);

            if (USER_AGREEMENT_SCENE.equals(methodName)) {
                this.buildUserAgreementScene(moduleSignup.getModuleNo(), userNo, resultMap);
            }
            else if (VERIFICATION_SCENE.equals(methodName)) {
                this.buildVerifyScene(resultMap, request, response);
            }
            else if (ENTER_INFO_SCENE.equals(methodName)) {
                this.buildMemberInfoScene(request, response,resultMap);
            }
            else if (COMPLETE_SCENE.equals(methodName)){
                this.buildCompleteScene(request, resultMap, moduleSignup, moduleNo);
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }


        componentResultModel.setSceneName(methodName);
        componentResultModel.setResult(resultMap);
        return componentResultModel;
    }

    private void getMemberJoinStep(ModuleSignup moduleSignup) {

        if(!StringUtils.isEmpty(moduleSignup.getMemberJoinStep())){
            memberJoinStep = JsonUtil.parseJSON(moduleSignup.getMemberJoinStep());
        }
        else{
            // get default
            MemeberJoinStep temp = new MemeberJoinStep();
            temp.setEnterMemberInfo(true);
            temp.setIdentityVerification(true);
            temp.setJoinComplete(true);
            temp.setUserAgreement(true);
            memberJoinStep = JsonUtil.obj2Map(temp);
        }
    }


    private void buildUserAgreementScene(Long moduleNo, Long userNo, Map<String, Object> resultMap) throws Exception{
        List<ModuleSignupProvision> siteProvisionList;
        siteProvisionList = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.AGREEMENT_TYPE);
        if( siteProvisionList.isEmpty() ){
            moduleSignupProvisionService.insertDefaultProvisions(moduleNo, ModuleSignupProvision.AGREEMENT_TYPE, userNo);
            siteProvisionList = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.AGREEMENT_TYPE);
        }
        resultMap.put("siteProvisionList", siteProvisionList);
    }

    private String getNextScene(Map<String, Object> memberJoinStep, String currentScene){
        String nextScene = "";
        if (USER_AGREEMENT_SCENE.equals(currentScene)) {
            if((Boolean)memberJoinStep.get(VERIFICATION_SCENE)){
                nextScene = VERIFICATION_SCENE;
            }
            else{
                nextScene = ENTER_INFO_SCENE;
            }
        }
        else if (VERIFICATION_SCENE.equals(currentScene)) {
            nextScene = ENTER_INFO_SCENE;
        }
        else if (ENTER_INFO_SCENE.equals(currentScene)) {
            if((Boolean)memberJoinStep.get(COMPLETE_SCENE)) {
                nextScene = COMPLETE_SCENE;
            } else if((Boolean)memberJoinStep.get(USER_AGREEMENT_SCENE)){
                nextScene = USER_AGREEMENT_SCENE;
            } else if((Boolean)memberJoinStep.get(VERIFICATION_SCENE)){
                nextScene = VERIFICATION_SCENE;
            } else{
                nextScene = ENTER_INFO_SCENE;
            }
        }

        return nextScene;
    }

    private String getPrevScene(Map<String, Object> memberJoinStep, String currentScene){
        String preScene = "";
        if (VERIFICATION_SCENE.equals(currentScene)) {
            if((Boolean)memberJoinStep.get(USER_AGREEMENT_SCENE)){
                preScene = USER_AGREEMENT_SCENE;
            }
        }
        else if (ENTER_INFO_SCENE.equals(currentScene)) {
            if((Boolean)memberJoinStep.get(VERIFICATION_SCENE)){
                preScene = VERIFICATION_SCENE;
            }
            else if((Boolean)memberJoinStep.get(USER_AGREEMENT_SCENE)){
                preScene = USER_AGREEMENT_SCENE;
            }
        }
        else if (COMPLETE_SCENE.equals(currentScene)) {
            preScene = ENTER_INFO_SCENE;
        }
        return preScene;
    }

    private void buildVerifyScene(Map<String, Object> resultMap, HttpServletRequest request,
                                  HttpServletResponse response) throws Exception{

        Map<String, Object> verifyMethod = new HashMap<>();

        String verify= getModuleSignup(request).getCertType();
        if( !StringUtil.isEmpty(verify) ) {
            List<String> list = ConversionUtil.stringToStringList(verify);
            for(String type: list){
                verifyMethod.put("method"+type, true);
            }
        }

        resultMap.put("verifyMethod", verifyMethod);

        try{
//            Map<String, String> smsEncData = certCompService.commonCertProcess(request,response, "S");	//sms cert
//            resultMap.put("smsCertInfo", smsEncData);
//
//            Map<String, String> iPINEncData = certCompService.commonCertProcess(request,response, "I");	//ipin cert
//            resultMap.put("iPINEncData", iPINEncData);

        }catch(Exception e){
            log.error("certModule Error : " + e.getMessage());
        }
    }

    private void buildMemberInfoScene(HttpServletRequest request, HttpServletResponse response,
                                      Map<String, Object> resultMap) throws Exception{

        Map<String, Object> params = new HashMap<>();
        resultMap.put("user", new UserVO());

    }

    private void buildCompleteScene(HttpServletRequest request, Map<String, Object> resultMap,
                                    ModuleSignup moduleSignup, Long moduleNo) throws Exception{

        String _sUserNo = request.getParameter("userNo");

        if( !StringUtil.isEmpty(_sUserNo) ) {
            User newUser = userService.getByPK(Long.parseLong(_sUserNo));

            if (newUser != null) {
                resultMap.put("newUserName", newUser.getName());
                List<ModuleSignupProvision> list = signupProvisionService.listProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE);

                if (!list.isEmpty()) {
                    ModuleSignupProvision siteProvision = list.get(0);
                    String content = siteProvision.getProvisionContent().replaceAll("\\u0024userId", newUser.getId());
                    content = content.replaceAll("\\u0024userName", newUser.getName());
                    siteProvision.setProvisionContent(content);
                    resultMap.put("siteProvision", siteProvision);
                } else {
                    signupProvisionService.insertDefaultJoinCompleteProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE, request);
                    list = signupProvisionService.listProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE);
                    ModuleSignupProvision siteProvision = list.get(0);
                    String content = siteProvision.getProvisionContent().replaceAll("\\u0024userId", newUser.getId());
                    content = content.replaceAll("\\u0024userName", newUser.getName());
                    siteProvision.setProvisionContent(content);
                    resultMap.put("siteProvision", siteProvision);
                }

                //send Complete email
                MailTemplate mailComplete = mailTemplateService.getByTemplateType(CommonConstants.MAIL_TEMPLATE_SIGNUP_CLOSE);
                this.sendJoinCompletedMail(mailComplete, newUser);

                //clear all verified session
                clearVerifySession(request);
            }
        }
    }

    /**
     * clear all session of registration module
     * @param request
     */
    private void clearVerifySession(HttpServletRequest request){
        HttpSession session = request.getSession();

        session.removeAttribute("_pt_passing_" + USER_AGREEMENT_SCENE);
        session.removeAttribute("_pt_date_" + USER_AGREEMENT_SCENE);

        session.removeAttribute("_pt_passing_" + VERIFICATION_SCENE);
        session.removeAttribute("_pt_date_" + VERIFICATION_SCENE);

        session.removeAttribute("_pt_passing_" + ENTER_INFO_SCENE);
        session.removeAttribute("_pt_date_" + ENTER_INFO_SCENE);

        session.removeAttribute("_pt_passing_" + COMPLETE_SCENE);
        session.removeAttribute("_pt_date_" + COMPLETE_SCENE);
    }

    private void sendJoinCompletedMail(MailTemplate mailTemplate, User newUser){
        if(mailTemplate!=null){
            if(mailTemplate.getEmailAutoYn()!=null && mailTemplate.getEmailAutoYn()==1){
                String htmlContent = mailTemplate.getTemplateContent();
                htmlContent =  htmlContent.replaceAll("\\$userId", newUser.getId());
                htmlContent =  htmlContent.replaceAll("\\$userName", newUser.getName());
                htmlContent =  htmlContent.replaceAll("\\$userNickname", newUser.getNickname());

                mailSenderService.send(mailTemplate.getSenderEmail(), mailTemplate.getSenderEmail(),
                        newUser.getEmail(), newUser.getName(), mailTemplate.getTemplateTitle(), htmlContent);
            }

        }
        else{
            String subject = messageSource.getMessage("mail.completeMailTitle", null, LocaleContextHolder.getLocale());
            String htmlContent = messageSource.getMessage("mail.completeMailContent", null, LocaleContextHolder.getLocale());
            htmlContent =  htmlContent.replaceAll("\\$userId", newUser.getId());
            htmlContent =  htmlContent.replaceAll("\\$userName", newUser.getName());
            htmlContent =  htmlContent.replaceAll("\\$userNickname", newUser.getNickname());

            mailSenderService.send("admin@golf.com", "admin@golf.com",
                    newUser.getEmail(), newUser.getName(), subject, htmlContent );

        }

    }

    public ModuleSignup getModuleSignup(HttpServletRequest request) {
        // because signup moudle is just one on the site (we only have one site)
        Map<String, Object> params = new HashMap<>();
        List<ModuleSignup> list = moduleSignupService.list(params);

        if (list.size() > 0) {
            return list.get(0);
        } else {
            // create new
            ModuleSignup signup = new ModuleSignup();
            MemeberJoinStep memberJoinStep = new MemeberJoinStep();
            memberJoinStep.setEnterMemberInfo(true);
            memberJoinStep.setIdentityVerification(true);
            memberJoinStep.setJoinComplete(true);
            memberJoinStep.setUserAgreement(true);
            signup.setModuleTitle(messageSource.getMessage("module.signup.title", null, LocaleContextHolder.getLocale()));
            signup.setCertType(CommonConstants.COMMON_CODE_CERT_TYPE_IPIN + "," + CommonConstants.COMMON_CODE_CERT_TYPE_PHONE);
            signup.setCaptchaYn(CommonConstants.MODULE_SIGNUP_CAPTCHA_YN);
            signup.setMemberJoinStep(JsonUtil.toString(memberJoinStep));
            signup.setProvisionAgreeYn(CommonConstants.MODULE_SIGNUP_PROVISION_AGREE_YN);
//            String compIpin = certCompService.getCertInfoByCertType(CommonConstants.COMMON_CODE_CERT_TYPE_IPIN).getCertCompCd();
//            signup.setIpinVerifyService(compIpin);
//            String compModile = certCompService.getCertInfoByCertType(CommonConstants.COMMON_CODE_CERT_TYPE_PHONE).getCertCompCd();
//            signup.setMobileVerifyService(compModile);
            moduleSignupService.insert(signup);
            return moduleSignupService.list(params).get(0);
        }
    }
}
