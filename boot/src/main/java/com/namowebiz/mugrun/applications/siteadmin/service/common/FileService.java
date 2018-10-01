package com.namowebiz.mugrun.applications.siteadmin.service.common;

import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.common.data.FileType;
import com.namowebiz.mugrun.applications.siteadmin.common.utils.FileUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.common.FileInfo;
import jodd.util.StringUtil;
import lombok.extern.apachecommons.CommonsLog;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Service class for file related tasks.
 * <p>
 * Created by NgocSon on 2/19/2016.
 */
@CommonsLog
@Service
public class FileService {
    public static final String MODULE_DIRECTORY_NAME = "files/modules";

    public static final String WIDGETS_DIRECTORY_NAME = "files/widgets";


    @Value("${mugrun.storage-base-path}")
    private String baseDirectory;


    public String getBasePath(String relativePath) {
        String path = baseDirectory;
        String relPath = relativePath;

        if (relativePath.startsWith("/")) {
            relPath = relPath.substring(1);
        }
        if (!path.endsWith("/")) {
            path = path + "/";
        }
        if (!StringUtil.isEmpty(relPath)) {
            return path + relPath;
        }
        return path;
    }



    public String getRelativePath(String moduleName) {
        return MODULE_DIRECTORY_NAME + "/" + moduleName + "/";
    }

    public String getWidgetsRelativePath(String widgetsName) {
        return WIDGETS_DIRECTORY_NAME + "/" + widgetsName + "/";
    }

    public FileInfo upload(HttpServletRequest request, String relativePath) throws Exception {
        FileInfo fileInfo = null;
        MultipartHttpServletRequest mpRequest = null;
        if (request instanceof MultipartHttpServletRequest) {
            mpRequest = (MultipartHttpServletRequest) request;
        }

        if (mpRequest == null) {
            return null;
        }

        Iterator fileIter = mpRequest.getFileNames();

        while (fileIter.hasNext()) {
            MultipartFile mFile = mpRequest.getFile((String) fileIter.next());
            if (mFile.getSize() > 0) {
                fileInfo = processUploadFile(relativePath, mFile);
            } else {
                throw new IOException();
            }
        }

        return fileInfo;
    }

    public FileInfo processUploadFile(String uploadRealPath, MultipartFile mFile)
            throws IOException {

        if (!uploadRealPath.endsWith("/")) {
            uploadRealPath = uploadRealPath + "/";
        }

        String normalizeUploadRealPath = getBasePath(uploadRealPath);

        FileType fileType = FileUtil.getFileViewTypeByStream(mFile.getInputStream());
        String fileExt = FileUtil.getFileExt(mFile.getOriginalFilename());
        String realFileName = getOriginalFilename(mFile); //.getOriginalFilename();

        File file = new File(normalizeUploadRealPath + "/" + realFileName);
        // Check to overwrite if the file is existing
        if (file.exists()) {
            file = FileUtil.checkExistingAndGetNewFile(file);
            realFileName = file.getName();
        }

        String fileNmWithoutExt = "" + FileUtil.getFileNameOnly(realFileName);
        String fileNm = fileNmWithoutExt + "." + fileExt;

        FileInfo fileInfo = new FileInfo();
        fileInfo.setOriginalFileName(realFileName);
        fileInfo.setFilePath(uploadRealPath + realFileName);
        fileInfo.setOriginalFileName(fileNm);
        fileInfo.setFileSize(mFile.getSize());
        fileInfo.setFileExtType(fileExt);

        // Create directories if not exist
        File folder = file.getParentFile();
        if (!folder.exists() && !folder.mkdirs()) {
            throw new IOException();
        }
        mFile.transferTo(file);
        return fileInfo;
    }

    private String getOriginalFilename(MultipartFile mFile) {
        String fileName = mFile.getOriginalFilename();
        if (fileName.indexOf(":\\") > 0) {
            fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
        }
        return fileName;
    }


    public FileInfo uploadFile(HttpServletRequest request, String absolutePath) throws Exception {
        FileInfo fileInfo = null;
        MultipartHttpServletRequest mpRequest = null;
        if (request instanceof MultipartHttpServletRequest) {
            mpRequest = (MultipartHttpServletRequest) request;
        }

        if (mpRequest == null) {
            return null;
        }

        Iterator fileIter = mpRequest.getFileNames();

        while (fileIter.hasNext()) {
            MultipartFile mFile = mpRequest.getFile((String) fileIter.next());
            if (mFile.getSize() > 0) {
                fileInfo = processUploadingFile(absolutePath, mFile, true, 0);
            } else {
                throw new IOException();
            }
        }

        return fileInfo;
    }

    public List<FileInfo> uploadFiles(HttpServletRequest request, String absolutePath) throws Exception {
        List<FileInfo> fileList = new ArrayList<>();
        MultipartHttpServletRequest mpRequest = null;
        if (request instanceof MultipartHttpServletRequest) {
            mpRequest = (MultipartHttpServletRequest) request;
        }

        if (mpRequest == null) {
            return null;
        }

        Iterator fileIter = mpRequest.getFileNames();

        while (fileIter.hasNext()) {
            MultipartFile mFile = mpRequest.getFile((String) fileIter.next());
            if (mFile.getSize() > 0) {
                // temporary no need create thumbnail
                //FileInfo fileInfo = processUploadingFile(absolutePath, mFile, true, 0);
                FileInfo fileInfo = processUploadFile(absolutePath, mFile);

                fileList.add(fileInfo);
            } else {
                throw new IOException();
            }
        }

        return fileList;
    }

    /**
     * Perform downloading process of a http request for download file using its relative path
     *
     * @param relativeFilePath the relative path of the file
     * @param request          the HttpServletRequest of the http request
     * @param response         the HttpServletResponse of the http request
     * @throws Exception
     */
    public void downloadFileByRelativePath(String relativeFilePath, HttpServletRequest request,
                                           HttpServletResponse response)
            throws Exception {
        File file = new File(getBasePath(relativeFilePath));

        if (file.exists()) {
            performDownload(request, response, file, relativeFilePath);
        }
    }

    /**
     * Process uploading a single file and return uploaded information of the file.
     *
     * @param uploadRealPath the path to upload file
     * @param mFile          the MultipartFile object of the upload file
     * @return the FileInfo object containing uploaded information of the file
     * @throws java.io.IOException
     */
    public FileInfo processUploadingFile(String uploadRealPath, MultipartFile mFile,
                                         boolean shouldCreateThumbnail, int thumbnailSize)
            throws IOException {
        String normalizeUploadRealPath = uploadRealPath;
        if (uploadRealPath.endsWith("/")) {
            normalizeUploadRealPath = uploadRealPath.substring(0, uploadRealPath.length() - 1);
        }

        FileType fileType = FileUtil.getFileViewTypeByStream(mFile.getInputStream());
        String fileExt = FileUtil.getFileExt(mFile.getOriginalFilename());
        String realFileName = mFile.getOriginalFilename();

        File file = new File(normalizeUploadRealPath + "/" + realFileName);
        // Check to overwrite if the file is existing
        if (file.exists()) {
            file = FileUtil.checkExistingAndGetNewFile(file);
            realFileName = file.getName();
        }

        String fileNmWithoutExt = "" + FileUtil.getFileNameOnly(realFileName);
        String fileNm = fileNmWithoutExt + "." + fileExt;

        FileInfo fileInfo = new FileInfo();
        fileInfo.setOriginalFileName(realFileName);
        fileInfo.setFilePath(file.getPath());
        fileInfo.setOriginalFileName(fileNm);
        fileInfo.setFileSize(mFile.getSize());
        fileInfo.setFileExtType(fileExt);

        // Create directories if not exist
        File folder = file.getParentFile();
        if (!folder.exists() && !folder.mkdirs()) {
            throw new IOException();
        }

        mFile.transferTo(file);

        if (FileType.IMAGE.equals(fileType)) {
            String fileAbsolutePath = normalizeUploadRealPath + "/" + fileNm;
            String fileAbsolutePathWithoutExt = normalizeUploadRealPath + "/" + fileNmWithoutExt;

            if (shouldCreateThumbnail) {
                fileInfo.setThumbnailFilePath(fileNmWithoutExt
                        + CommonConstants.THUMBNAIL_POSTFIX + CommonConstants.THUMBNAIL_EXT);

                int size = thumbnailSize;
                if (size <= 0) {
                    size = CommonConstants.THUMNAIL_MAX_SIZE;
                }
                Thumbnails.of(new File(fileAbsolutePath))
                        .size(size, size)
                        .toFile(new File(fileAbsolutePathWithoutExt
                                + CommonConstants.THUMBNAIL_POSTFIX + CommonConstants.THUMBNAIL_EXT));
            }
        }

        return fileInfo;
    }

    /**
     * Perform the download process of a file
     *
     * @param request          the HttpServletRequest of the http request
     * @param response         the HttpServletResponse of the http request
     * @param file             the File object to download
     * @param relativeFilePath the relative path of the file
     * @throws java.net.URISyntaxException
     * @throws java.io.IOException
     */
    private void performDownload(HttpServletRequest request, HttpServletResponse response,
                                 File file, String relativeFilePath)
            throws Exception {
        String fileName = FileUtil.getFileNameWithExt(relativeFilePath.startsWith("/") ?
                relativeFilePath : "/" + relativeFilePath);
        URI uri = new URI(null, null, fileName, null);
        fileName = uri.toASCIIString();

        response.setContentType("application/octet-stream;charset=UTF-8");
        String userAgent = request.getHeader("User-Agent").toLowerCase();
        if (userAgent.contains("firefox")) {
            response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
        } else {
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        }
        response.setCharacterEncoding("UTF-8");
        ServletOutputStream out = response.getOutputStream();
        FileInputStream fileIn = new FileInputStream(file);

        try {
            byte[] buf = new byte[1024];
            int len = fileIn.read(buf, 0, 1024);
            while (len > 0) {
                out.write(buf, 0, len);
                if (len < 1024) {
                    break;
                }
                len = fileIn.read(buf, 0, 1024);
                out.flush();
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new IOException(e);
        } finally {
            fileIn.close();
            out.close();
        }

    }

    public String getImageEncodeBase64(String filePath) {
        if (StringUtils.isNotEmpty(filePath)) {
            try {
                File imageFile = new File(getBasePath(filePath));
                if (imageFile != null && imageFile.exists() && !imageFile.isDirectory()) {
                    return Base64.encodeBase64String(FileUtil.getByteFromFile(imageFile));
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
        return "";
    }

    public void deleteFile(String realPath) {
        File file = new File(getBasePath(realPath));
        if (file.exists()) {
            file.delete();
        }
    }
}
