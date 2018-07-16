package com.namowebiz.mugrun.components.modules.common.controller;

import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.common.utils.FileUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.common.FileInfo;
import com.namowebiz.mugrun.applications.siteadmin.models.common.FileUploadForm;
import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.SiteFile;
import com.namowebiz.mugrun.applications.siteadmin.service.common.FileService;
import com.namowebiz.mugrun.applications.siteadmin.service.sitefile.SiteFileService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;

@CommonsLog
@Controller
@RequestMapping("/common/")
public class CommonController {
    private int BUFFER_SIZE = 1024;

    @Autowired
    private FileService fileService;
    @Autowired
    private SiteFileService siteFileService;


    @RequestMapping("editor/smart_editor_photo_uploader")
    public String index() {
        return "components/modules/common/photo_uploader";
    }

    @RequestMapping(value = "editor/addEditorFiles.json", method = RequestMethod.POST)
    @ResponseBody
    public String addEditorFiles(HttpServletRequest request, @ModelAttribute FileUploadForm form) {
        try {
            FileInfo file = fileService.uploadFile(request, fileService.getBasePath("/" + CommonConstants.SMART_EDITOR_SUB_DIRECTORY_NAME));
            return "sFileURL=/common/editor/loadFile?relativePath=/editor/" + file.getOriginalFileName();
        } catch (Exception e) {
            return "";
        }
    }

    @RequestMapping(value = "editor/loadFile", method= RequestMethod.GET)
    @ResponseBody
    public byte[] loadEditorFile(String relativePath, HttpServletResponse response) throws IOException {
        response.setHeader("Cache-Control","public");
        File imageFile = new File(fileService.getBasePath(relativePath));
        return FileUtil.getByteFromFile(imageFile);
    }

    @RequestMapping(value = "editor/loadSiteFile", method= RequestMethod.GET)
    @ResponseBody
    public byte[] loadEditorSiteFile(Long siteFileNo, HttpServletResponse response) throws Exception {
        response.setHeader("Cache-Control", "public");
        SiteFile siteFile = siteFileService.getSiteFile(siteFileNo);
        if(siteFile != null){
            File imageFile = new File(fileService.getBasePath(siteFile.getFilePath()));
            return FileUtil.getByteFromFile(imageFile);
        }
        return null;
    }

    @RequestMapping(value = "downloadFileSite", method= RequestMethod.GET)
    public void downloadFileSite(Long siteFileNo, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String userAgent = request.getHeader("User-Agent").toLowerCase();
        response.setHeader("Cache-Control", "public");
        SiteFile siteFile = siteFileService.getSiteFile(siteFileNo);
        if(siteFile != null){
            String fullPath = fileService.getBasePath(siteFile.getFilePath());
            File file = new File(fullPath);
            MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();
            if(file.exists()) {
                FileInputStream fileInputStream = null;
                ServletOutputStream outputStream = null;

                try {
                    fileInputStream = new FileInputStream(file);
                    outputStream = response.getOutputStream();

                    URI uri = new URI(null, null, file.getName(), null);
                    String fileName = uri.toASCIIString();
                    String mimeType = mimeTypesMap.getContentType(fullPath);

                    response.setContentType(MediaType.parseMediaType(mimeType).toString());
                    if (userAgent.contains("firefox")) {
                        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
                    } else {
                        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                    }
                    //response.setCharacterEncoding("UTF-8");
                    response.setStatus(HttpStatus.OK.value());
                    response.setHeader("Content-Length", String.valueOf(file.length()));

                    byte[] buf = new byte[BUFFER_SIZE];
                    int read = fileInputStream.read(buf, 0, BUFFER_SIZE);
                    while (read > 0) {
                        outputStream.write(buf, 0, read);
                        outputStream.flush();
                        if (read < BUFFER_SIZE) {
                            break;
                        }
                        read = fileInputStream.read(buf, 0, BUFFER_SIZE);
                    }
                    fileInputStream.close();
                    outputStream.close();
                } catch (IOException ex) {
                    log.error(ex.getMessage(), ex);
                    response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                } finally {
                    if (fileInputStream != null) {
                        fileInputStream.close();
                    }
                    if (outputStream != null) {
                        outputStream.close();
                    }
                }
            }
        }
    }

    @RequestMapping(value = "loadFile", method= RequestMethod.GET)
    @ResponseBody
    public byte[] loadFile(String relativePath, HttpServletResponse response) throws IOException {
        response.setHeader("Cache-Control","public");
        File imageFile = new File(fileService.getBasePath(relativePath));
        return FileUtil.getByteFromFile(imageFile);
    }

    @RequestMapping(value = "loadSiteFile", method= RequestMethod.GET)
    @ResponseBody
    public byte[] loadSiteFile(Long siteFileNo, HttpServletResponse response) throws Exception {
        response.setHeader("Cache-Control", "public");
        SiteFile siteFile = siteFileService.getSiteFile(siteFileNo);
        if(siteFile != null){
            File imageFile = new File(fileService.getBasePath(siteFile.getFilePath()));
            return FileUtil.getByteFromFile(imageFile);
        }
        return null;
    }
}
