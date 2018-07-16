package com.namowebiz.mugrun.applications.framework.common.utils;

import org.apache.commons.beanutils.BeanUtilsBean;

import java.lang.reflect.InvocationTargetException;

/**
 * Created by ngo.ty on 12/7/2015.
 */
public class NullAwareBeanUtilsBean extends BeanUtilsBean{
    @Override
    public void copyProperty(Object dest, String name, Object value)
            throws IllegalAccessException, InvocationTargetException {
        if(value==null)return;
        super.copyProperty(dest, name, value);
    }
}
