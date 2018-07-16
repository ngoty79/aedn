package com.namowebiz.mugrun.applications.siteadmin.common.utils;

import com.namowebiz.mugrun.applications.siteadmin.common.data.FileType;
import jodd.util.StringUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.FileImageInputStream;
import javax.imageio.stream.ImageInputStream;
import java.awt.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Util class to handle file related tasks.
 * Created by NgocSon on 11/27/2015.
 */
@CommonsLog
public class FileUtil {

    public static String getFileExt(String fileName) {
        if (fileName == null || "".equals(fileName))
            return "";

        int idx = fileName.lastIndexOf('.');
        if (idx < 0) {
            return "";
        }

        return fileName.substring(idx + 1);
    }

    public static String getFileNameOnly(String fileName) {
        try {
            int idx = fileName.lastIndexOf('/');
            String tmp = fileName.substring(idx + 1);
            if (!StringUtils.isEmpty(tmp)) {
                idx = tmp.lastIndexOf('.');
                tmp = tmp.substring(0, idx);
            }
            return tmp;

        } catch (Exception e) {
            return fileName;
        }
    }

    public static String getFileNameWithExt(String filePath) {
        if(!StringUtil.isEmpty(filePath)){
            return filePath.substring(filePath.lastIndexOf("/") + 1);
        }
        return "";
    }

    public static FileType getFileViewTypeByStream(Object o) {
        String formatName = getFormatName(o);
        if(StringUtils.isNotEmpty(formatName)){
            return FileType.IMAGE;
        }
        return FileType.NORMAL;
    }

    public static File checkExistingAndGetNewFile(File file) {
        File newFile = file;
        Pattern fileNamePattern = Pattern.compile(".+(\\(\\d\\))");
        if (file.exists()) {
            String fileNameWOExt = FileUtil.getFileNameOnly(file.getName());
            String fileExt = FileUtil.getFileExt(file.getName());
            int index = 0;
            Matcher matcher = fileNamePattern.matcher(fileNameWOExt);
            if (matcher.find()) {
                String sIndex = matcher.group(1);
                fileNameWOExt = fileNameWOExt.replace(sIndex, "");
                sIndex = sIndex.replaceAll("[\\(\\)]", "");
                try {
                    index = Integer.parseInt(sIndex);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }
            boolean found = false;
            while (!found) {
                index++;
                String newFileName = fileNameWOExt + ("(") + index + ")." + fileExt;
                newFile = new File(file.getParent(), newFileName);
                if (!newFile.exists()) {
                    found = true;
                }
            }
        }

        return newFile;
    }

    public static Dimension getImageDimension(File imgFile) throws IOException {
        int pos = imgFile.getName().lastIndexOf(".");
        if (pos == -1) {
            throw new IOException("No extension for file: " + imgFile.getAbsolutePath());
        }
        String suffix = imgFile.getName().substring(pos + 1);
        Iterator<ImageReader> iter = ImageIO.getImageReadersBySuffix(suffix);
        if (iter.hasNext()) {
            ImageReader reader = iter.next();
            ImageInputStream stream = null;
            try {
                stream = new FileImageInputStream(imgFile);
                reader.setInput(stream);
                int width = reader.getWidth(reader.getMinIndex());
                int height = reader.getHeight(reader.getMinIndex());
                return new Dimension(width, height);
            } catch (IOException e) {
                log.warn(e.getMessage(), e);
            } finally {
                reader.dispose();
                if (stream != null) {
                    stream.close();
                }
            }
        }

        throw new IOException("Not a known image file: " + imgFile.getAbsolutePath());
    }

    /**
     * Checks if a file name matches a pattern.
     *
     * @param fullFileName the full file name, with extension
     * @param fileNamePattern the pattern to check
     * @return true of file name matches pattern, otherwise false
     */
    public static Boolean isFileNameMatch(String fullFileName, String fileNamePattern) {
        String fileName = getFileNameOnly(fullFileName);
        Pattern pattern = Pattern.compile(fileNamePattern);
        Matcher matcher = pattern.matcher(fileName);

        return matcher.matches();
    }

    @SuppressWarnings("rawtypes")
    private static String getFormatName(Object o) {
        ImageInputStream iis = null;
        try {
            iis = ImageIO.createImageInputStream(o);

            Iterator iter = ImageIO.getImageReaders(iis);
            if (!iter.hasNext()) {
                return null;
            }
            ImageReader reader = (ImageReader)iter.next();

            return reader.getFormatName();
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            if (iis != null) {
                try {
                    iis.close();
                } catch (IOException e) {
                    log.error(e.getMessage(), e);
                }
            }
        }
        return null;
    }

    /**
     * 파일 복사 유틸
     *
     * @param source
     * @param target
     * @param isFile
     * @return
     */
    public static long copyFile(File source, File target, boolean isFile) {
        FileInputStream fis = null;
        FileOutputStream fos = null;

        File targetFile = target;

        if (!targetFile.isFile()) {
            try {
                if (isFile) {
                    targetFile = new File(target.getCanonicalPath());
                } else {
                    targetFile = new File(target.getCanonicalPath() + File.separator + target.getName());
                }

                File folder = targetFile.getParentFile();
                if (!folder.exists() && !folder.mkdirs()) {
                    throw new IOException("Cannot create folder " + folder.getAbsolutePath());
                }

                if (!targetFile.exists() && !targetFile.createNewFile()) {
                    throw new IOException("Cannot create target file " + targetFile.getAbsolutePath());
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }

        try {
            fis = new FileInputStream(source);
            fos = new FileOutputStream(targetFile.getAbsolutePath());

            byte[] buffer = new byte[4096];
            int bytesRead;

            while ((bytesRead = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
            }

        } catch (Exception e) {
            log.error(e.getMessage(),e);
        } finally {
            if (fis != null) try {
                fis.close();
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
            try {
                if (fos != null) {
                    fos.flush();
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
            try {
                if (fos != null) {
                    fos.close();
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }

        return source.length();
    }

    /**
     * Delete a file using its path
     * @param path the full path of file
     * @return true if successfully delete, otherwise false
     */
    public static boolean deleteFileByPath(String path) {
        File file = new File(path);

        return deleteFile(file);
    }

    /**
     * Delete a file using its file object
     * @param file file object
     * @return true if successfully delete, otherwise false
     */
    public static boolean deleteFile(File file) {
        if (!file.exists()) {
            return false;
        } else {
            return file.delete();
        }
    }

    public static byte[] getByteFromFile(File imageFile)throws IOException {
        if(imageFile != null && imageFile.exists() && !imageFile.isDirectory()){
            FileInputStream fis = new FileInputStream(imageFile);
            byte[] bytes = IOUtils.toByteArray(fis);
            fis.close();
            return bytes;
        }
        return null;
    }
}
