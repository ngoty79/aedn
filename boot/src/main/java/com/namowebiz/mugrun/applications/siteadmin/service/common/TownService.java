package com.namowebiz.mugrun.applications.siteadmin.service.common;

import com.namowebiz.mugrun.applications.siteadmin.dao.common.TownDao;
import com.namowebiz.mugrun.applications.siteadmin.models.common.Town;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/19/2017.
 */
@Service
public class TownService {

    @Autowired
    private TownDao townDao;

    public Town getByPK(Long townNo){
        return townDao.getByPK(townNo);
    }

    public void insert(Town town){
        townDao.insert(town);
    }

    public void update(Town town){
        townDao.update(town);
    }

    public void delete(Long townNo){
        Map<String, Object> params = new HashMap<>();
        params.put("townNo", townNo);
        townDao.delete(params);
    }
    public void delete(List<Long> townNoList){
        Map<String, Object> params = new HashMap<>();
        params.put("townNoList", townNoList);
        townDao.delete(params);
    }

    public List<Town> list(Map<String, Object> params){
        return townDao.list(params);
    }

    public Long count(Map<String, Object> params){
        Long count = townDao.count(params);
        return count == null? 0L : count;
    }

    public void addOrEdit(Town model){
        if(model.getTownNo() == null){
            insert(model);
        }else{
            update(model);
        }
    }
}
