package com.namowebiz.mugrun.applications.siteadmin.models.common;

import org.springframework.web.multipart.MultipartFile;

public class FileUploadForm {
    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    private MultipartFile file;
}
