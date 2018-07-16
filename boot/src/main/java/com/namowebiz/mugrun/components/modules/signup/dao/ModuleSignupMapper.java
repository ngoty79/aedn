package com.namowebiz.mugrun.components.modules.signup.dao;

import com.namowebiz.mugrun.components.modules.signup.models.ModuleSignup;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
@Component
public interface ModuleSignupMapper {

    public List<ModuleSignup> list(Map<String, Object> params);

    public void insert(ModuleSignup moduleSignup);

    public void update(ModuleSignup moduleSignup);
}
