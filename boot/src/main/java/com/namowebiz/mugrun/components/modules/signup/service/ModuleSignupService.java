package com.namowebiz.mugrun.components.modules.signup.service;

import com.namowebiz.mugrun.components.modules.signup.dao.ModuleSignupMapper;
import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
@Service
public class ModuleSignupService {

    @Autowired
    private ModuleSignupMapper moduleSignupMapper;

    public List<ModuleSignup> list(Map<String, Object> params){
        return moduleSignupMapper.list(params);
    }

    public void insert(ModuleSignup moduleSignup) {
        moduleSignupMapper.insert(moduleSignup);
    }

    public void update(ModuleSignup moduleSignup) {
        moduleSignupMapper.update(moduleSignup);
    }
}
