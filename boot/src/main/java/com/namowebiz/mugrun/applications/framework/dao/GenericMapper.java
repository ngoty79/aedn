package com.namowebiz.mugrun.applications.framework.dao;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 9/9/2016.
 * @since 1.0
 */
public interface GenericMapper<T, ID> {

    public List<T> list(Map<String, Object> map);

    public void insert(T object);

    public void update(T object);

    public void delete(ID pk);

    public T get(ID id);

    public Long count(Map<String, Object> params);
}
