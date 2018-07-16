package com.namowebiz.mugrun.components.modules.signup.controller;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.JsonUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.commoncode.CommonCodeVO;
import com.namowebiz.mugrun.applications.siteadmin.service.commoncode.CommonCodeService;
import com.namowebiz.mugrun.components.modules.signup.models.MemeberJoinStep;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignup;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignupProvision;
import com.namowebiz.mugrun.components.modules.signup.service.ModuleSignupProvisionService;
import com.namowebiz.mugrun.components.modules.signup.service.ModuleSignupService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * RegistrationController class handling all request in Registration site manager and view page
 * @version 1.0
 * @author ngo.ty
 */
@Controller
@CommonsLog
@RequestMapping("/admin/signup")
public class SignupAdminController {


    @Autowired
    private ModuleSignupService moduleSignupService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModuleSignupProvisionService moduleSignupProvisionService;

    private ModuleSignup moduleSignup;

    @Autowired
    private CommonCodeService commonCodeService;

    /**
     * If don't have signup module will create default
     * Return index page
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(HttpServletRequest request) throws Exception {
        // because signup moudle is just one on the site (we only have one site)
        Map<String, Object> params = new HashMap<>();
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        List<ModuleSignup> list = moduleSignupService.list(params);
        if (list.size() > 0) {
            moduleSignup = list.get(0);
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
//            signup.setMobileVerifyService(compModile);
            signup.setRegUserNo(userNo);
            moduleSignupService.insert(signup);
            moduleSignup = moduleSignupService.list(params).get(0);
        }
        return "components/modules/signup/admin/index";
    }

    /**
     * update module signup
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCurrModuleSignup.json")
    @ResponseBody
    public JsonResponse getModuleSignup() throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            jsonResponse.setData(moduleSignup);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * update module signup
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateModuleSignup(@RequestBody ModuleSignup signup,HttpServletRequest request) throws Exception {
        // because signup moudle is just one on the site (we only have one site)
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        JsonResponse jsonResponse = new JsonResponse();
        try {
            signup.setModUserNo(userNo);
            moduleSignupService.update(signup);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping("/getMemberJoinStep.json")
    @ResponseBody
    public JsonResponse getMemberJoinStep() throws Exception {

        JsonResponse jsonResponse = new JsonResponse();
        try {
            String joinStepStr = moduleSignup.getMemberJoinStep();
            Map<String,Object> joinStepObj = JsonUtil.parseJSON(joinStepStr);
            joinStepObj.put("moduleSignup", moduleSignup);

            jsonResponse.setData(joinStepObj);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping(value = "/modifyMemberJoinStep.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse modifyMemberJoinStep(@RequestBody MemeberJoinStep memberJoinStep, HttpServletRequest request) throws Exception {
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        JsonResponse jsonResponse = new JsonResponse();
        try {
            moduleSignup.setMemberJoinStep(JsonUtil.toString(memberJoinStep));
            moduleSignup.setModUserNo(userNo);
            moduleSignup.setModDate(new Date());
            moduleSignupService.update(moduleSignup);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping("/listProvision.json")
    @ResponseBody
    public JsonResponse listProvision(HttpServletRequest request) throws Exception {

        JsonResponse jsonResponse = new JsonResponse();
        try {
            Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
            Long moduleNo = moduleSignup.getModuleNo();
            List<ModuleSignupProvision> provisions = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.AGREEMENT_TYPE);
            if(provisions.isEmpty()){
                moduleSignupProvisionService.insertDefaultProvisions(moduleNo,ModuleSignupProvision.AGREEMENT_TYPE, userNo);
                provisions = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.AGREEMENT_TYPE);
            }
            jsonResponse.setData(provisions);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * delete provision by provisionNo
     *
     * @param provisionNo
     * @return status of delete
     * @throws Exception
     */
    @RequestMapping(value = "/provision/delete")
    @ResponseBody
    public JsonResponse deleteProvision(@RequestParam String provisionNo) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            moduleSignupProvisionService.deleteProvisionList(provisionNo);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * add provision
     *
     * @return status of delete
     * @throws Exception
     */
    @RequestMapping(value = "/provision/add")
    @ResponseBody
    public JsonResponse addProvision(HttpServletRequest request) throws Exception {
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        JsonResponse jsonResponse = new JsonResponse();
        try {
            ModuleSignupProvision data = new ModuleSignupProvision();
            data.setModuleNo(moduleSignup.getModuleNo());
            data.setProvisionName(messageSource.getMessage("module.signup.default.provision.name", null, LocaleContextHolder.getLocale()));
            data.setProvisionContent(messageSource.getMessage("module.signup.default.provision.content", null, LocaleContextHolder.getLocale()));
            data.setRegUserNo(userNo);
            data.setViewOrder(CommonConstants.MODULE_SIGNUP_INIT_VIEW_ORDER);
            data.setBaseAgreementYn(CommonConstants.MODULE_SIGNUP_BASE_AGREEMENT_YN);
            data.setUseYn(CommonConstants.MODULE_SIGNUP_USE_YN);
            data.setProvisionType(ModuleSignupProvision.AGREEMENT_TYPE);
            moduleSignupProvisionService.addProvision(data);
            int viewOrder = moduleSignupProvisionService.getMaxViewOrder(data);
            data.setViewOrder(viewOrder+1);
            moduleSignupProvisionService.modifyProvision(data);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping(value = "/listProvision/update" ,method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateListProvision(@RequestBody List<ModuleSignupProvision> provisions, HttpServletRequest request) throws Exception {
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        JsonResponse jsonResponse = new JsonResponse();
        try {
            for(int i = 0; i < provisions.size(); i++){
                ModuleSignupProvision pro = provisions.get(i);
                pro.setModUserNo(userNo);
                moduleSignupProvisionService.modifyProvision(pro);
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping(value = "/verification/certType")
    @ResponseBody
    public JsonResponse getCodeByCertType() throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("useYn", CommonConstants.COMMON_CODE_USE_YN);
            params.put("groupCode", CommonConstants.COMMON_CODE_GROUP_CODE_CERT_TYPE);
            List<CommonCodeVO> list = commonCodeService.list(params);
            List<CommonCodeVO> result = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                CommonCodeVO com = list.get(i);
                if(CommonConstants.COMMON_CODE_CERT_TYPE_IPIN.equals(com.getCommonCode())
                        || CommonConstants.COMMON_CODE_CERT_TYPE_PHONE.equals(com.getCommonCode())){
                    result.add(com);
                }
            }
            jsonResponse.setData(result);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    @RequestMapping("/getJoinCompleteProvision.json")
    @ResponseBody
    public JsonResponse getJoinCompleteProvision(HttpServletRequest request) throws Exception {

        JsonResponse jsonResponse = new JsonResponse();
        try {
            ModuleSignupProvision moduleSignupProvision;
            Long moduleNo = moduleSignup.getModuleNo();
            List<ModuleSignupProvision> provisions = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE);
            if(provisions.size() > 0) {
                moduleSignupProvision = provisions.get(0);
            } else {
                moduleSignupProvisionService.insertDefaultJoinCompleteProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE, request);
                provisions = moduleSignupProvisionService.listProvision(moduleNo, ModuleSignupProvision.JOIN_COMPLETE);
                moduleSignupProvision = provisions.get(0);
            }
            jsonResponse.setData(moduleSignupProvision);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

}
