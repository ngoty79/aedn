package com.namowebiz.mugrun.applications.siteadmin.models.common;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by NgocSon on 2/19/2016.
 */
@SuppressWarnings("PMD.UnusedPrivateField")
public class FileInfo extends BaseObject {
    @Getter @Setter
    private Long fileNo;

    @Getter @Setter
    private String fileTitle;

    @Getter @Setter
    private String filePath;

    @Getter @Setter
    private String originalFileName;

    @Getter @Setter
    private String thumbnailFilePath;

    @Getter @Setter
    private Long fileSize;

    @Getter @Setter
    private String fileExtType;

}
