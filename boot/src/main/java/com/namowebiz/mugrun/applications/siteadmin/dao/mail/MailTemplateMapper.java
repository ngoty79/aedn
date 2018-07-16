package com.namowebiz.mugrun.applications.siteadmin.dao.mail;

import com.namowebiz.mugrun.applications.siteadmin.models.mail.MailTemplate;
import org.springframework.stereotype.Component;

/**
 * Created by ngo.ty on 6/6/2016.
 */
@Component
public interface MailTemplateMapper {

    MailTemplate getByTemplateType(String templateType);

    void insert(MailTemplate mailTemplate);

    void update(MailTemplate mailTemplate);

    public MailTemplate getByPK(Long templateNo);
}
