package com.namowebiz.mugrun.applications.siteadmin.common.utils;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

/**
 * the Utility class to get the file path of Webtree.
 * 
 * @author jipark
 * @since 1.0
 */
public class FilePathUtil {
	private static String ROOT_DIR = "/data";
	
	/**
	 * get home path of the site
	 * @param siteId the site id
	 * @return the file path
	 */
	public static String getSitePath(String siteId) {
		return ROOT_DIR + "/sites/" + siteId;
	}

    /**
     * get the root path of sites folder
     * @return /data/sites
     */
    public static String getSitePath() {
		return ROOT_DIR + "/sites";
	}

    /**
     * Get site temporary path
     * @param siteId
     * @return /data/sites/{siteId}/temp
     */
    public static String getSiteTempPath(String siteId) {
        return ROOT_DIR + "/sites/" + siteId + "/temp";
    }
	
	/**
	 * get home path of the snapshot
	 * @param siteId the site id
	 * @param snapshotNo the snapshot no
	 * @return the file path
	 */
	public static String getSnapshotPath(String siteId, Long snapshotNo) {
		return getSitePath(siteId) + "/snapshot/" + snapshotNo.toString();
	}
	
	/**
	 * get file path of the component used on the snapshot like mainmenu widget.
	 * @param siteId the site id
	 * @param snapshotNo the snapshot no
	 * @param compType the component type (widget/module)
	 * @param compName the component name
	 * @param compId the component id
	 * @return the file path
	 */
	public static String getSnapshotComponentPath(String siteId, Long snapshotNo, String compType, String compName, String compId) {
		return getSnapshotPath(siteId, snapshotNo) + "/component/" + compType + "/" + compName + "/" + compId;
	}
	
	/**
	 * get file path of the npx
	 * @param siteId the site id
	 * @param snapshotNo the snapshot no
	 * @param npxType the npx type (master/page)
	 * @param npxId the npx id (1234)
	 * @return the file path, e.g /data/sites/default/1/npx/page/1234
	 */
	public static String getSnapshotNpxPath(String siteId, Long snapshotNo, String npxType, String npxId) {
		return getSnapshotPath(siteId, snapshotNo) + "/npx/" + npxType + "/" + npxType + "_" + npxId + ".xml";
	}

	public static String getRobotFileNpxPath(String siteId, Long snapshotNo) {
		return getSnapshotPath(siteId, snapshotNo) + "/config/" + "/robots.txt";
	}

    public static String getSitemapFilePath(String siteId, Long snapshotNo) {
		return getSnapshotPath(siteId, snapshotNo) + "/config/" + "/sitemap.xml";
	}

    public static String getSnapshotNpxPathWOExtension(String siteId, Long snapshotNo, String npxType, String npxId) {
        return getSnapshotPath(siteId, snapshotNo) + "/npx/" + npxType + "/" + npxType + "_" + npxId;
    }

    public static String getSnapshotNpxBasePath(String siteId, Long snapshotNo) {
        return getSnapshotPath(siteId, snapshotNo) + "/npx";
    }
	
	/**
	 * get the additional file path
	 * @param siteId the site id
	 * @param compType the component type (widget/module)
	 * @param compName the component name
	 * @param compId the component id
	 * @return the file path
	 */
	public static String getProjectContentComponentPath(String compType, String compName, String compId) {
		String path = ROOT_DIR + "/contents/" + "component/" + compType + "/" + compName;
        if (compId != null) {
            path = path + "/" + compId;
        }
        return path;
	}
	
	/**
	 * get home path of project resources.
	 * @param siteId the site id
	 * @return the file path
	 */
	public static String getProjectResourcePath(String siteId) {
		return getSitePath(siteId) + "/resources";
	}
	
	/**
	 * get file path of project resources used on the component
	 * @param siteId the site id
	 * @param compType the component type (widget/module)
	 * @param compName the component name
	 * @return the file path
	 */
	public static String getProjectResourceComponentPath(String siteId, String compType, String compName) {
		return getSitePath(siteId) + "/resources/" + "component/" + compType + "/" + compName + "/files";
	}

    public static String getProjectResourceComponentBasePath(String siteId) {
        return getSitePath(siteId) + "/resources/" + "component";
    }
	
	/**
	 * get home path of my resources.
	 * @param userNo the user no
	 * @return the file path
	 */
	public static String getMyResourcePath(Long userNo) {
		return ROOT_DIR + "/users/" + userNo.toString() + "/files";
	}
	
	/*
	 * get home path of system resources.
	 * @return the file path
	 */
	public static String getSystemPath() {
		return ROOT_DIR + "/system";
	}
	
	/**
	 * get file path of system skins.
	 * @param compType the component type (widget/module)
	 * @param compName the component name
	 * @param skinName the skin name
	 * @return the file path
	 */
	public static String getSystemSkinPath(String compType, String compName, String skinName) {
		return getSystemComponentPath() + "/"+ compType + "/" + compName + "/skins/" + skinName;
	}

	/**
	 * get file path of custom skins.
	 * @param siteId the siteId
	 * @param compType the component type (widget/module)
	 * @param compName the component name
	 * @param skinName the skin name
	 * @return the file path
	 */
	public static String getCustomSkinPath(String siteId, String compType, String compName, String skinName) {
        return getSitePath(siteId) + "/resources/component/" + compType + "/" + compName + "/skins/" + skinName;
	}

    public static String getCustomComponentPath(String siteId) {
        return getSitePath(siteId) + "/resources/component";
    }

    public static String getCustomComponentPath(String siteId, String componentType, String componentName) {
        return getCustomComponentPath(siteId) + "/" + componentType + "/" + componentName;
    }

    /**
     * get root path of system component: /data/system/component
     * @return
     */
    public static String getSystemComponentPath() {
		return getSystemPath() + "/component";
	}

    public static String getSystemComponentPath(String componentType, String componentName) {
        return getSystemComponentPath() + "/" + componentType + "/" + componentName;
    }

    public static String getBaseComponentPath() {
        return "/component";
    }

    public static String getCloudBaseComponentPath(String cloudName) {
        return "/cloud/" + cloudName + "/component";
    }

    /**
     * get base component path (system components packaged in Webtree)
     * @param compType
     * @param compName
     * @return e.g /component/widget/banner
     */
    public static String getBaseComponentPath(String compType, String compName) {
		return getBaseComponentPath() + "/" + compType + "/" + compName;
	}

    public static String getCloudComponentPath(String cloudName, String compType, String compName) {
		return getCloudBaseComponentPath(cloudName) + "/" + compType + "/" + compName;
	}

    /**
     * get basic skin path (system skins packaged in Webtree
     * @param compType
     * @param compName
     * @param skinName
     * @return e.g /component/widget/banner/skins/basic
     */
    public static String getBaseSkinPath(String compType, String compName, String skinName) {
		return getBaseComponentPath(compType, compName) + "/skins/" + skinName;
	}

	/**
	 * get file path of system resources used on error pages.
	 * @return the file path
	 */
	public static String getSystemPagePath() {
		return getSystemPath() + "/error_pages";
	}
	
	/**
	 * get file path of system resources used on system login/loading page.
	 * @return the file path
	 */
	public static String getSystemUiPath() {
		return getSystemPath() + "/application_ui";
	}

    /**
     * Get site config path
     * @param siteId
     * @param snapshotNo
     * @return E.g: /data/sites/default/1/config/site-config.xml
     */
    public static String getSiteConfigPath(String siteId, Long snapshotNo) {
        return getSnapshotPath(siteId, snapshotNo) + "/config/site-config.xml";
    }

    /**
     * Get default site config path
     * @return Absolute path pointing to classpath:/conf/site-config.default.xml
     */
    public static String getDefaultSiteConfigPath() {
        return FilePathUtil.class.getResource("/conf/site-config.default.xml").getPath().replaceAll("%20", " ");
    }

    /**
     * Get base css path
     * @param siteId
     * @param snapshotNo
     * @return E.g: /data/sites/default/1/css/base.css
     */
    public static String getBaseCssPath(String siteId, Long snapshotNo) {
        return getSnapshotPath(siteId, snapshotNo) + "/css/base.css";
    }

    public static String getCustomComponentMessagePath(String siteId, String componentType, String componentName) {
        return getSitePath(siteId) + "/resources/" + "component/" + componentType + "/" + componentName  + "/lang";
    }

    public static String getUserFontSetPath(String siteId) {
        return getSitePath(siteId) + "/resources/" + "/fontset";
    }

    /**
     * Determine file type extension based on the path input.
     * Support only: PDF, Image and epub.
     *
     * @return
     */
    public static String getFileExtensionType(String path) {
        String extension = FilenameUtils.getExtension(path);

        if (StringUtils.isBlank(extension)) {
            // No extension. Don't know it.
            return null;
        }

        if ("pdf".equalsIgnoreCase(extension.trim())) {
            return "PDF";
        }

        if(ArrayUtils.contains(new String[]{"gif", "png", "jpg", "jpeg"}, extension.trim().toLowerCase())) {
            return "IMAGE";
        }

        if ("epub".equalsIgnoreCase(extension.trim())) {
            return "EPUB";
        }

        return null;
    }
    
    /**
     * get sql file path
     * @param siteId
     * @return
     */
    public static String getPatchSqlFilePath(String siteId){
    	return getSystemPath()+"/patch" + "/sqlfile";
    }   
    
    /**
     * ssl key file default path
     * @param sslId
     * @return
     */
    public static String getDefaultSSLKeyFilePath(String sslId){
    	return getSystemPath()+"/ssl/"+sslId;
    }

    /**
     * get file path of document use when upload chapter and cover image
     * @return the file path
     */
    public static String getSiteDocumentPath() {
        return ROOT_DIR + "/data/document";
    }

    public static String getSiteExhibitPath() {
        return ROOT_DIR + "/data/exhibit";
    }

    public static String getSiteProductPath() {
        return ROOT_DIR + "/data/product";
    }
    public static String getSiteFormMakerDgistPath() {
        return ROOT_DIR + "/data/formmakerdgist";
    }
    
    public static String getSiteFormMakerKyungbokPath() {
        return ROOT_DIR + "/data/formmakerkyungbok";
    }
}
