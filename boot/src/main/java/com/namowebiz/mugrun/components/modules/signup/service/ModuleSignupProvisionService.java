package com.namowebiz.mugrun.components.modules.signup.service;

import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.components.modules.signup.dao.ModuleSignupProvisionMapper;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignupProvision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
@Service
public class ModuleSignupProvisionService {

    @Autowired
    private ModuleSignupProvisionMapper dao;

    @Autowired
    private MessageSource messageSource;


    /**
     * Get List ModuleSignupProvision with SiteID
     * @param moduleNo
     * @return
     * @throws Exception
     */
    public List<ModuleSignupProvision> listProvision(Long moduleNo) throws Exception{
        Map<String, Object> map = new HashMap<>();
        map.put("moduleNo", moduleNo);
        return dao.listProvision(map);
    }

    /**
     * Get List ModuleSignupProvision with SiteID
     * @param moduleNo
     * @return
     * @throws Exception
     */
    public List<ModuleSignupProvision> listProvision(Long moduleNo, String provisionType) throws Exception{
        Map<String, Object> map = new HashMap<>();
        map.put("moduleNo", moduleNo);
        map.put("provisionType", provisionType);
        return dao.listProvision(map);
    }

    /**
     * Get List ModuleSignupProvision with SiteID
     * @param moduleNo
     * @return
     * @throws Exception
     */
    public List<ModuleSignupProvision> listProvision(Long moduleNo, String provisionType, Long savedUser, String defaultName ) throws Exception{
        Map<String, Object> map = new HashMap<>();
        map.put("moduleNo", moduleNo);
        map.put("provisionType", provisionType);

        List<ModuleSignupProvision> list = dao.listProvision(map);

        if(list.isEmpty()){
            ModuleSignupProvision model = new ModuleSignupProvision();
            model.setBaseAgreementYn(1);
            model.setRegUserNo(savedUser);
            model.setModuleNo(moduleNo);
            model.setProvisionType(provisionType);
            model.setViewOrder(0);
            model.setProvisionName(defaultName);

            this.addProvision(model);

            list = dao.listProvision(map);

        }
        return list;
    }

    /**
     * Get ModuleSignupProvision with ID
     * @param id
     * @return
     * @throws Exception
     */
    public ModuleSignupProvision getProvision(Long id) throws Exception{
        return dao.getProvision(id);
    }

    /**
     * Add ModuleSignupProvision
     * @param model
     * @return
     * @throws Exception
     */
    @Transactional
    public void addProvision(ModuleSignupProvision model) throws Exception{
        dao.addProvision(model);
    }

    public int getMaxViewOrder(ModuleSignupProvision model){
        Map<String, Object> map = new HashMap<>();
        map.put("moduleNo", model.getModuleNo());
        return dao.getMaxViewOrder(map);
    }


    public void updateProvision(ModuleSignupProvision model) throws Exception{
        dao.modifyProvision(model);
    }

    @Transactional
    public void addOrUpdateProvision(ModuleSignupProvision model) throws Exception{
        if(model.getProvisionNo()!=null){
            ModuleSignupProvision provision = dao.getProvision(model.getProvisionNo());
            if(provision!=null){
                provision.setProvisionName(model.getProvisionName());
                provision.setProvisionContent(model.getProvisionContent());
                provision.setModUserNo(model.getModUserNo());
                dao.modifyProvision(provision);

            }
        }
        else{
            Map<String, Object> map = new HashMap<>();
            map.put("moduleNo", model.getModuleNo());
            int viewOrder = dao.getMaxViewOrder(map);
            model.setViewOrder(viewOrder+1);
            dao.addProvision(model);
        }

    }

    /**
     * Update ModuleSignupProvision
     * @param model
     * @throws Exception
     */
    public void modifyProvision(ModuleSignupProvision model) throws Exception{
        dao.modifyProvision(model);
    }

    @Transactional
    public void modifyProvisions(ModuleSignupProvision[] siteProvisionList, Long userNo) throws Exception{
        for(ModuleSignupProvision model: siteProvisionList){
            model.setModUserNo(userNo);
            dao.modifyProvision(model);
        }
    }


    /**
     * delete ModuleSignupProvision
     * @param mode
     * @throws Exception
     */
    public void deleteProvision(ModuleSignupProvision mode) throws Exception{
        dao.deleteProvision(mode);
    }

    @Transactional
    public void deleteProvisionList(String ids) throws Exception{
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("list", ids.split(","));
        dao.deleteByIds(map);
    }

    /**
     * Modify vieworder between 2 site_provision
     * @param provisionNo1
     * @param provisionNo2
     * @throws Exception
     */
    @Transactional
    public void modifyProvisionViewOrder(Long provisionNo1, Long provisionNo2, Long userNo) throws Exception{
        ModuleSignupProvision provision1 = dao.getProvision(provisionNo1);
        ModuleSignupProvision provision2 = dao.getProvision(provisionNo2);

        if(provision1!=null && provision2!=null){
            int tmp = provision1.getViewOrder()==null? 0: provision1.getViewOrder();
            provision1.setViewOrder(provision2.getViewOrder());
            provision2.setViewOrder(tmp);

            provision1.setModUserNo(userNo);
            provision2.setModUserNo(userNo);

            dao.modifyProvision(provision1);
            dao.modifyProvision(provision2);

        }
    }

    @Transactional
    public void insertDefaultProvisions(Long moduleNo, String provisionType,
                                        Long userNo) throws Exception{

        String agreement = messageSource.getMessage("module.signup.default.agreement", null, LocaleContextHolder.getLocale());
        String privacyStatementTitle = messageSource.getMessage("module.signup.default.privacyStatement", null, LocaleContextHolder.getLocale());
        String defaultContent = messageSource.getMessage("module.signup.default.defaultContent", null, LocaleContextHolder.getLocale());

        ModuleSignupProvision model = new ModuleSignupProvision();
        model.setBaseAgreementYn(1);
        model.setRegUserNo(userNo);
        model.setModuleNo(moduleNo);
        model.setProvisionType(provisionType);
        model.setViewOrder(0);
        model.setProvisionName(agreement);
        model.setProvisionContent(defaultContent);

        this.addProvision(model);

        ModuleSignupProvision privacyStatement = new ModuleSignupProvision();
        privacyStatement.setBaseAgreementYn(1);
        privacyStatement.setRegUserNo(userNo);
        privacyStatement.setModuleNo(moduleNo);
        privacyStatement.setProvisionType(provisionType);
        privacyStatement.setViewOrder(0);
        privacyStatement.setProvisionName(privacyStatementTitle);
        privacyStatement.setProvisionContent(defaultContent);

        this.addProvision(privacyStatement);

    }

    @Transactional
    public void insertDefaultJoinCompleteProvision(Long moduleNo, String provisionType,
                                                   HttpServletRequest request) throws Exception{

        String defaultContent = messageSource.getMessage("module.signup.default.defaultJoinCompleteContent", null, LocaleContextHolder.getLocale());

        ModuleSignupProvision model = new ModuleSignupProvision();
        model.setBaseAgreementYn(1);
        model.setRegUserNo(RequestUtil.getUserInfoInSession(request).getUserNo());
        model.setModuleNo(moduleNo);
        model.setProvisionType(provisionType);
        model.setViewOrder(0);
        model.setProvisionContent(defaultContent);

        this.addProvision(model);

    }
}
