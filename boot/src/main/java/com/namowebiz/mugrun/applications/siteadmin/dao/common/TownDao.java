package com.namowebiz.mugrun.applications.siteadmin.dao.common;

import com.namowebiz.mugrun.applications.siteadmin.models.common.Town;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/19/2017.
 */

@Repository
public interface TownDao {
    Town getByPK(Long customerNo);

    void insert(Town town);

    void update(Town town);

    void delete(Map<String, Object> params);

    List<Town> list(Map<String, Object> params);

    public Long count(Map<String, Object> params);
}
