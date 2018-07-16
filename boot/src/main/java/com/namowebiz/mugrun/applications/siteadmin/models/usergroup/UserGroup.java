package com.namowebiz.mugrun.applications.siteadmin.models.usergroup;

import com.namowebiz.mugrun.applications.siteadmin.common.data.GenericTreeVO;
import lombok.Getter;
import lombok.Setter;

/**
 * UserGroup
 * 
 * @author Vinh
 * @since 1.0
 */
public class UserGroup extends GenericTreeVO<UserGroup> {
    private static final long serialVersionUID = 134543534545435L;

    private Long userGroupNo;
    private int defaultYn;
    private Integer leftOrder;
    private int organizationChartYn;
    private Long parentUserGroupNo;
    private Integer rightOrder;
    private String siteId;
    private Integer treeDepth;
    private String userGroupDesc;

    private String userGroupName;
    @Getter @Setter
    private Boolean isUpdate;
    @Getter @Setter
    private Boolean approveYn;
    @Getter @Setter
    private Boolean finishYn;
    @Getter @Setter
    private Boolean revenueYn;
    @Getter @Setter
    private Boolean costYn;
    @Getter @Setter
    private Boolean capitalYn;
    @Getter @Setter
    private String menus;

    public UserGroup() {
    }

    public Long getUserGroupNo() {
        return userGroupNo;
    }

    public void setUserGroupNo(Long userGroupNo) {
        this.userGroupNo = userGroupNo;
    }

    public int getDefaultYn() {
        return defaultYn;
    }

    public void setDefaultYn(int defaultYn) {
        this.defaultYn = defaultYn;
    }
    
    public Integer getLeftOrder() {
        return leftOrder;
    }

    public void setLeftOrder(Integer leftOrder) {
        this.leftOrder = leftOrder;
    }

    public int getOrganizationChartYn() {
        return organizationChartYn;
    }

    public void setOrganizationChartYn(int organizationChartYn) {
        this.organizationChartYn = organizationChartYn;
    }

    public Long getParentUserGroupNo() {
        return parentUserGroupNo;
    }

    public void setParentUserGroupNo(Long parentUserGroupNo) {
        this.parentUserGroupNo = parentUserGroupNo;
    }

    public Integer getRightOrder() {
        return rightOrder;
    }

    public void setRightOrder(Integer rightOrder) {
        this.rightOrder = rightOrder;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public Integer getTreeDepth() {
        return treeDepth;
    }

    public void setTreeDepth(Integer treeDepth) {
        this.treeDepth = treeDepth;
    }

    public String getUserGroupDesc() {
        return userGroupDesc;
    }

    public void setUserGroupDesc(String userGroupDesc) {
        this.userGroupDesc = userGroupDesc;
    }

    public String getUserGroupName() {
        return userGroupName;
    }

    public void setUserGroupName(String userGroupName) {
        this.userGroupName = userGroupName;
    }

    @Override
    public String getText(){
    	return getUserGroupName();
    }
}
