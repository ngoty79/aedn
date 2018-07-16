package com.namowebiz.mugrun.components.modules.signup.dao;

import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignupProvision;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
@Component
public interface ModuleSignupProvisionMapper {
    /**
     * Get List of SiteProvision with SiteID
     * @param map
     * @return list of SiteProvision
     * @throws Exception
     */
    public List<ModuleSignupProvision> listProvision(Map<String, Object> map);

    /**
     * Get SiteProvision with PK
     * @param id
     * @return SiteProvision object
     * @throws Exception
     */
    public ModuleSignupProvision getProvision(Long id);

    /**
     * Add SiteProvision
     * @param mode SiteProvision
     * @throws Exception
     *
     */
    public void addProvision(ModuleSignupProvision mode);

    public int getMaxViewOrder(Map<String, Object> map);

    /**
     * Update SiteProvision
     * @param mode SiteProvision
     * @throws Exception
     */
    public void modifyProvision(ModuleSignupProvision mode);


    /**
     * delete SiteProvision
     * @param mode SiteProvision
     * @throws Exception
     */
    public void deleteProvision(ModuleSignupProvision mode);

    /**
     * delete list of SiteProvision
     * @param map list of id of SiteProvision
     * @throws Exception
     */
    public void deleteByIds(Map<String, Object> map);
}
