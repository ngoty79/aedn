package com.namowebiz.mugrun.applications.siteadmin.common.data;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import org.apache.commons.lang.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * ModuleDbManageItem class
 * @version 1.0
 * @author cong.son
 */
public class ModuleDbManageItem extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String DBMANAGE_TYPE_DB = "dbman";
	public static final String DBMANAGE_TYPE_FORM = "dbform";
	
	public static final String SURVEY_FORM = "survey";
	public static final String APPLY_FORM = "apply";
    public static final String PROMOTION_FORM = "promotion";
	public static final String ITEM_TEXT_TYPE = "T";
	
	public static final Long APPLICATION_PERIOD_ID = 13L;
	public static final Long TRAINING_PERIOD_ID = 14L;
	
	private Long itemNo;
	private String itemName;
	private String itemType;
	private boolean htmlDataYn;
	
	private Long categoryNo;
	private String accessLevel;
	private boolean addYn;
	private int width=10;
	private String dbmanageType;
	private String formType;       
	
	//custom field
	private int sortItemYn;
	private int indexItemYn;
	private boolean useFieldYn;
	private Integer itemWidth;
	
	private boolean hasPermission;
	private int order;
	
	public Long getItemNo() {
		return itemNo;
	}
	public void setItemNo(Long itemNo) {
		this.itemNo = itemNo;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getItemType() {
		return itemType;
	}
	public void setItemType(String itemType) {
		this.itemType = itemType;
	}
	
	public Long getCategoryNo() {
		return categoryNo;
	}
	public void setCategoryNo(Long categoryNo) {
		this.categoryNo = categoryNo;
	}
	public String getAccessLevel() {
		return accessLevel;
	}
	public void setAccessLevel(String accessLevel) {
		this.accessLevel = accessLevel;
	}
	public boolean isAddYn() {
		return addYn;
	}
	public void setAddYn(boolean addYn) {
		this.addYn = addYn;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((categoryNo == null) ? 0 : categoryNo.hashCode());
		result = prime * result + ((itemNo == null) ? 0 : itemNo.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ModuleDbManageItem other = (ModuleDbManageItem) obj;
		if (categoryNo == null) {
			if (other.categoryNo != null)
				return false;
		} else if (!categoryNo.equals(other.categoryNo))
			return false;
		if (itemNo == null) {
			if (other.itemNo != null)
				return false;
		} else if (!itemNo.equals(other.itemNo))
			return false;
		return true;
	}
	public String getDbmanageType() {
		return dbmanageType;
	}
	public void setDbmanageType(String dbmanageType) {
		this.dbmanageType = dbmanageType;
	}
	public String getFormType() {
		return formType;
	}
	public void setFormType(String formType) {
		this.formType = formType;
	}
	public int getSortItemYn() {
		return sortItemYn;
	}
	public void setSortItemYn(int sortItemYn) {
		this.sortItemYn = sortItemYn;
	}
	public int getIndexItemYn() {
		return indexItemYn;
	}
	public void setIndexItemYn(int indexItemYn) {
		this.indexItemYn = indexItemYn;
	}

	public Integer getItemWidth() {
		return itemWidth;
	}
	public void setItemWidth(Integer itemWidth) {
		this.itemWidth = itemWidth;
	}
	public boolean isHtmlDataYn() {
		return htmlDataYn;
	}
	public void setHtmlDataYn(boolean htmlDataYn) {
		this.htmlDataYn = htmlDataYn;
	}
	public boolean isUseFieldYn() {
		return useFieldYn;
	}
	public void setUseFieldYn(boolean useFieldYn) {
		this.useFieldYn = useFieldYn;
	}
	public boolean isHasPermission() {
		return hasPermission;
	}
	public void setHasPermission(boolean hasPermission) {
		this.hasPermission = hasPermission;
	}

	public void checkPermission(List<UserGroup> listOfUser){
		if(listOfUser != null && !listOfUser.isEmpty() && StringUtils.isNotEmpty(this.accessLevel)){
			String[] str = this.accessLevel.split(",");
			if(str.length > 0){
				List<String> list = Arrays.asList(str);
				for (UserGroup group : listOfUser) {
					if(list.indexOf(String.valueOf(group.getUserGroupNo())) >= 0){
						this.hasPermission = true;
						break;
					}
				}
				
			}
		}
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	
}
