package com.namowebiz.mugrun.applications.siteadmin.models.mail;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by datnguyen on 6/27/2016.
 */
@Getter
@Setter
@SuppressWarnings("PMD.UnusedPrivateField")
public class MailTemplate extends BaseObject {
    @Getter @Setter
    private Long templateNo;
    @Getter @Setter
    private String templateTitle;
    @Getter @Setter
    private String templateContent;
    @Getter @Setter
    private String imagePath;
    @Getter @Setter
    private String templateType;
    @Getter @Setter
    private Integer emailAutoYn;
    @Getter @Setter
    private String senderEmail;
    @Getter @Setter
    private Integer useYn;
}
