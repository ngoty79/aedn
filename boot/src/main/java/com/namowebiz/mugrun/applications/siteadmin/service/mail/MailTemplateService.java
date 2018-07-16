package com.namowebiz.mugrun.applications.siteadmin.service.mail;

import com.namowebiz.mugrun.applications.siteadmin.dao.mail.MailTemplateMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.mail.MailTemplate;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by ngo.ty on 6/7/2016.
 */
@Service
public class MailTemplateService {

    @Autowired
    private MailTemplateMapper mailTemplateMapper;

    public MailTemplate getByTemplateType(String templateType) {
        return mailTemplateMapper.getByTemplateType(templateType);
    }

    public void save(MailTemplate mailTemplate, UserVO loginUser) throws Exception {
        mailTemplate.setUseYn(1);
        if(mailTemplate.getTemplateNo() != null && mailTemplate.getTemplateNo() > 0) {
            mailTemplate.setModUserNo(loginUser.getUserNo());
            mailTemplateMapper.update(mailTemplate);
        }else{
            mailTemplate.setRegUserNo(loginUser.getUserNo());
            mailTemplateMapper.insert(mailTemplate);
        }
    }

    public MailTemplate getByPK(Long templateNo){
        return mailTemplateMapper.getByPK(templateNo);
    }
}
