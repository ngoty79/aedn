package com.namowebiz.mugrun.applications.siteadmin.models.user;

import com.namowebiz.mugrun.applications.framework.common.data.AdminType;
import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenuVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by ngo.ty on 2/17/2016.
 */
@SuppressWarnings("PMD.UnusedPrivateField")
public class UserVO extends User{
    @Getter @Setter
    private AdminType adminType;
    @Getter @Setter
    private String memberTypeName;
    @Getter @Setter
    private String memberStatusName;
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


    private List<UserGroup> userGroupListOfUser;

    private List<AdminMenuVO> myAdminMenu;

    private List<UserAddInfoVO> myAddInfo;

    public List<AdminMenuVO> getMyAdminMenu() {
        if (this.myAdminMenu == null) {
            this.myAdminMenu = new ArrayList<>();
        }

        return this.myAdminMenu;
    }



    public void setMyAdminMenu(final List<AdminMenuVO> list) {
        this.myAdminMenu = list;
    }

    public List<UserGroup> getUserGroupListOfUser() {
        if (this.userGroupListOfUser == null) {
            this.userGroupListOfUser = new ArrayList<>();
        }

        return this.userGroupListOfUser;
    }

    public void setUserGroupListOfUser(final List<UserGroup> list) {
        this.userGroupListOfUser = list;
    }

    public List<UserAddInfoVO> getMyAddInfo() {
        if (this.myAddInfo == null) {
            this.myAddInfo = new ArrayList<>();
        }

        return this.myAddInfo;
    }

    public void setMyAddInfo(final List<UserAddInfoVO> list) {
        this.myAddInfo = list;
    }

    @Getter @Setter
    private String passwordModDateStr;
    @Getter @Setter
    private String regDateStr;
    @Getter @Setter
    private String modDateStr;
    @Getter @Setter
    private String userGroupNo;
    @Getter @Setter
    private String userGroupName;

    private String phone1;
    private String phone2;
    private String phone3;

    public String getPhone1() {
        if(StringUtils.isNotEmpty(getTel())) {
            String[] arr = getTel().split("-");
            if(arr.length > 0) {
                return arr[0];
            }
        }
        return "";
    }

    public String getPhone2() {
        if(StringUtils.isNotEmpty(getTel())) {
            String[] arr = getTel().split("-");
            if(arr.length > 1) {
                return arr[1];
            }
        }
        return "";
    }

    public String getPhone3() {
        if(StringUtils.isNotEmpty(getTel())) {
            String[] arr = getTel().split("-");
            if(arr.length > 2) {
                return arr[2];
            }
        }
        return "";
    }

    @Getter @Setter
    private Long pointNo;

    @Getter @Setter
    private String pointName;

    @Getter @Setter
    private Integer pointValue;

    @Getter @Setter
    private String pointRegDateStr;

    private Date pointRegDate;

    public Date getPointRegDate() {
        if (this.pointRegDate != null) {
            return new Date(this.pointRegDate.getTime());
        } else {
            return null;
        }
    }

    public void setPointRegDate(Date value) {
        if (value != null) {
            this.pointRegDate = new Date(value.getTime());
        } else {
            this.pointRegDate = null;
        }
    }

    private String emailFirstPart;
    private String emailSecondPart;

    public String getEmailFirstPart(){
        if(!StringUtils.isEmpty(getEmail())){
            String[] emailArr = getEmail().split("@");
            if(emailArr.length > 0)
                return getEmail().split("@")[0];
        }
        return "";
    }

    public String getEmailSecondPart(){
        if(!StringUtils.isEmpty(getEmail())){
            String[] emailArr = getEmail().split("@");
            if(emailArr.length > 1)
                return getEmail().split("@")[1];
        }
        return "";
    }

    public List<String> getBirthdayList(){
        List<String> list = new ArrayList<>(3);
        String str1 = "",
                str2 = "",
                str3 = "";

        if(!StringUtils.isEmpty(getBirthday())){
            String[] values = getBirthday().split("-");
            if(values.length >= 1){
                str1 = values[0];
            }
            if(values.length >= 2){
                str2 = values[1];
            }
            if(values.length >= 3){
                str3 = values[2];
            }
        }

        list.add(str1);
        list.add(str2);
        list.add(str3);
        return list;
    }

    public boolean isApprove(){
        if(getApproveYn() != null && getApproveYn() == true){
            return true;
        }
        return false;
    }

    public boolean isFinish(){
        if(getFinishYn() != null && getFinishYn() == true){
            return true;
        }
        return false;
    }

    public void copyPermission(UserGroup userGroup){
        setApproveYn(userGroup.getApproveYn());
        setFinishYn(userGroup.getFinishYn());
        setCostYn(userGroup.getCostYn());
        setRevenueYn(userGroup.getRevenueYn());
        setCapitalYn(userGroup.getCapitalYn());
        setMenus(userGroup.getMenus());
    }


}
